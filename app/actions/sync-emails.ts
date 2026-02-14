'use server'

import { createClient } from '@/lib/supabase/server';
import { GmailService, getHeader } from '@/lib/gmail/service';
import { classifyEmail } from '@/lib/ai/classifier';
import { revalidatePath } from 'next/cache';

export async function syncEmailsAction() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.provider_token) {
        return { error: 'Not authenticated or missing provider token. Please sign out and sign in again.' };
    }

    try {
        const gmail = new GmailService(session.provider_token);

        // Calculate date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dateQuery = `after:${Math.floor(sevenDaysAgo.getTime() / 1000)}`;
        const query = `is:unread ${dateQuery}`;

        console.log(`[SYNC] Starting sync with query: ${query}`);

        let pageToken: string | undefined = undefined;
        let totalSynced = 0;
        let pageCount = 0;
        const MAX_PAGES = 10; // Safety break
        const MAX_EMAILS = 200; // Safety break

        do {
            pageCount++;
            console.log(`[SYNC] Fetching page ${pageCount}...`);

            const { messages, nextPageToken } = await gmail.listEmails('me', query, 50, pageToken);
            pageToken = nextPageToken || undefined;

            if (!messages || messages.length === 0) {
                console.log(`[SYNC] No messages found on page ${pageCount}.`);
                continue;
            }

            console.log(`[SYNC] Found ${messages.length} messages on page ${pageCount}. Processing...`);

            // Filter out duplicates in batch
            const messageIds = messages.map(m => m.id);
            const { data: existingEmails } = await supabase
                .from('emails')
                .select('id')
                .in('id', messageIds);

            const existingIds = new Set(existingEmails?.map(e => e.id) || []);
            const newMessages = messages.filter(m => !existingIds.has(m.id));

            console.log(`[SYNC] ${newMessages.length} new messages to process (out of ${messages.length}).`);

            if (newMessages.length === 0) continue;

            // Process new messages
            for (const msg of newMessages) {
                // Double check loop limit
                if (totalSynced >= MAX_EMAILS) break;

                try {
                    const fullMsg = await gmail.getEmail('me', msg.id!);

                    if (!fullMsg.payload) {
                        console.warn(`[SYNC] Email ${msg.id} has no payload, skipping`);
                        continue;
                    }

                    const subject = getHeader(fullMsg.payload?.headers || [], 'Subject') || 'No Subject';
                    const from = getHeader(fullMsg.payload?.headers || [], 'From') || 'Unknown Sender';
                    const snippet = fullMsg.snippet || '';

                    // AI Classification
                    let classification = { category: 'other', confidence: 0 };
                    try {
                        classification = await classifyEmail(subject, snippet);
                    } catch (err) {
                        console.error(`[SYNC] Classification failed for ${msg.id}:`, err);
                    }

                    // Insert into DB
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

                    if (!error) {
                        totalSynced++;
                    } else {
                        console.error(`[SYNC] DB Insert error for ${msg.id}:`, error);
                    }

                } catch (emailError) {
                    console.error(`[SYNC] Failed to process email ${msg.id}:`, emailError);
                }
            }

            if (totalSynced >= MAX_EMAILS) {
                console.log(`[SYNC] Reached safe limit of ${MAX_EMAILS} emails. Stopping.`);
                break;
            }

            if (pageCount >= MAX_PAGES) {
                console.log(`[SYNC] Reached safe limit of ${MAX_PAGES} pages. Stopping.`);
                break;
            }

        } while (pageToken);

        revalidatePath('/dashboard');
        console.log(`[SYNC] Sync complete. Total synced: ${totalSynced}`);
        return { success: true, count: totalSynced };

    } catch (error) {
        console.error('[SYNC] Sync failed:', error);
        return { error: 'Failed to sync emails. Please try again.' };
    }
}
