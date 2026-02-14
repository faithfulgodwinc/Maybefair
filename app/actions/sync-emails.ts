'use server'

import { createClient } from '@/lib/supabase/server';
import { GmailService, getHeader } from '@/lib/gmail/service';
import { classifyEmail } from '@/lib/ai/classifier';
import { revalidatePath } from 'next/cache';

export async function getUnreadMessageIds() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.provider_token) {
        return { error: 'Not authenticated' };
    }

    try {
        const gmail = new GmailService(session.provider_token);

        // 1. Calculate date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateQuery = `after:${Math.floor(sevenDaysAgo.getTime() / 1000)}`;
        const query = `is:unread ${dateQuery}`;

        // 2. Fetch list of all relevant message IDs
        const MAX_EMAILS = 100;
        const { messages } = await gmail.listEmails('me', query, MAX_EMAILS);

        if (!messages || messages.length === 0) {
            return { ids: [] };
        }

        // 3. Filter duplicates
        const messageIds = messages.map(m => m.id);
        const { data: existingEmails } = await supabase
            .from('emails')
            .select('id')
            .in('id', messageIds);

        const existingIds = new Set(existingEmails?.map(e => e.id) || []);
        const newIds = messageIds.filter(id => !existingIds.has(id!)) as string[];

        return { ids: newIds, totalFound: messages.length };

    } catch (error) {
        console.error('Failed to get unread IDs:', error);
        return { error: 'Failed to fetch emails' };
    }
}

export async function syncBatch(messageIds: string[]) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.provider_token) {
        return { error: 'Not authenticated' };
    }

    try {
        const gmail = new GmailService(session.provider_token);
        let syncedCount = 0;

        await Promise.all(messageIds.map(async (id) => {
            try {
                const fullMsg = await gmail.getEmail('me', id);
                if (!fullMsg.payload) return;

                const subject = getHeader(fullMsg.payload?.headers || [], 'Subject') || 'No Subject';
                const from = getHeader(fullMsg.payload?.headers || [], 'From') || 'Unknown Sender';
                const snippet = fullMsg.snippet || '';

                let classification = { category: 'other', confidence: 0 };
                try {
                    classification = await classifyEmail(subject, snippet || '');
                } catch (err) {
                    console.error(`Classification failed for ${id}`, err);
                }

                const { error } = await supabase.from('emails').insert({
                    id: id,
                    user_id: session.user.id,
                    thread_id: fullMsg.threadId,
                    subject,
                    snippet,
                    sender: from,
                    category: classification.category,
                    confidence: classification.confidence,
                    received_at: new Date(Number(fullMsg.internalDate)).toISOString(),
                });

                if (!error) syncedCount++;
            } catch (e) {
                console.error(`Error processing email ${id}`, e);
            }
        }));

        if (syncedCount > 0) {
            revalidatePath('/dashboard');
        }

        return { success: true, count: syncedCount };

    } catch (error) {
        console.error('Batch sync failed:', error);
        return { error: 'Batch failed' };
    }
}

// Keep original action for backward compatibility if needed, using the new functions
export async function syncEmailsAction() {
    const result = await getUnreadMessageIds();
    if (result.error) return { error: result.error };
    if (!result.ids || !result.ids.length) return { success: true, count: 0 };

    // Process all in one go (chunking handled here to assume legacy behavior)
    const CHUNK_SIZE = 5;
    let totalSynced = 0;

    for (let i = 0; i < result.ids.length; i += CHUNK_SIZE) {
        const chunk = result.ids.slice(i, i + CHUNK_SIZE);
        const batchResult = await syncBatch(chunk); // Reuse the batch logic
        if (batchResult.count) totalSynced += batchResult.count;
    }

    return { success: true, count: totalSynced };
}
