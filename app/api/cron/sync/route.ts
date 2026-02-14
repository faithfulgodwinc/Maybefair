import { createClient } from '@/lib/supabase/server';
import { GmailService, getHeader } from '@/lib/gmail/service';
import { classifyEmail } from '@/lib/ai/classifier';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 60 seconds execution

export async function GET(request: Request) {
    // Basic auth check for cron
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // WARNING: Cron jobs run without a user session context. 
    // This implementation assumes we are syncing for the "current" user session,
    // which effectively means it only works if triggered manually by a logged-in user
    // or if we have a way to iterate through all users with tokens.
    //
    // For now, we will try to use the session. If triggered by Vercel Cron, this will likely fail
    // unless we implement token storage in DB.
    //
    // However, to satisfy the requirement of "Deep Sync", we are placing the logic here.

    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.provider_token) {
        return NextResponse.json({
            error: 'No active session found. Cron job requires offline tokens or active session.'
        }, { status: 401 });
    }

    try {
        const gmail = new GmailService(session.provider_token);

        // Calculate date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateQuery = `after:${Math.floor(sevenDaysAgo.getTime() / 1000)}`;
        const query = `is:unread ${dateQuery}`;

        console.log(`[CRON] Starting deep sync with query: ${query}`);

        let pageToken: string | undefined = undefined;
        let totalSynced = 0;
        let pageCount = 0;
        const MAX_PAGES = 10;
        const MAX_EMAILS = 200;

        do {
            pageCount++;
            const { messages, nextPageToken } = await gmail.listEmails('me', query, 50, pageToken);
            pageToken = nextPageToken || undefined;

            if (!messages || messages.length === 0) continue;

            const messageIds = messages.map(m => m.id);
            const { data: existingEmails } = await supabase
                .from('emails')
                .select('id')
                .in('id', messageIds);

            const existingIds = new Set(existingEmails?.map(e => e.id) || []);
            const newMessages = messages.filter(m => !existingIds.has(m.id));

            if (newMessages.length === 0) continue;

            for (const msg of newMessages) {
                if (totalSynced >= MAX_EMAILS) break;

                try {
                    const fullMsg = await gmail.getEmail('me', msg.id!);
                    if (!fullMsg.payload) continue;

                    const subject = getHeader(fullMsg.payload?.headers || [], 'Subject') || 'No Subject';
                    const from = getHeader(fullMsg.payload?.headers || [], 'From') || 'Unknown Sender';
                    const snippet = fullMsg.snippet || '';

                    let classification = { category: 'other', confidence: 0 };
                    try {
                        classification = await classifyEmail(subject, snippet);
                    } catch (err) {
                        console.error(`[CRON] Classification failed:`, err);
                    }

                    const { error } = await supabase.from('emails').insert({
                        id: msg.id,
                        user_id: session.user.id,
                        thread_id: fullMsg.threadId,
                        subject,
                        snippet,
                        sender: from,
                        category: classification.category,
                        confidence: classification.confidence,
                        received_at: new Date(Number(fullMsg.internalDate)).toISOString(),
                    });

                    if (!error) totalSynced++;
                } catch (e) {
                    console.error(`[CRON] Failed to process email ${msg.id}`, e);
                }
            }

            if (totalSynced >= MAX_EMAILS || pageCount >= MAX_PAGES) break;

        } while (pageToken);

        return NextResponse.json({ success: true, count: totalSynced });

    } catch (error) {
        console.error('[CRON] Sync failed:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
