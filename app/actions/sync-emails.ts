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
        const messages = await gmail.listEmails('me', 'is:unread', 5);

        if (!messages || messages.length === 0) {
            return { success: true, count: 0 };
        }

        let count = 0;

        for (const msg of messages) {
            // Check availability
            const { data: existing } = await supabase.from('emails').select('id').eq('id', msg.id!).single();
            if (existing) continue;

            const fullMsg = await gmail.getEmail('me', msg.id!);
            const subject = getHeader(fullMsg.payload.headers, 'Subject');
            const from = getHeader(fullMsg.payload.headers, 'From');
            const snippet = fullMsg.snippet;

            let classification = { category: 'other', confidence: 0 };
            try {
                classification = await classifyEmail(subject, snippet || '');
            } catch (err) {
                console.error(`Classification failed for email ${msg.id}:`, err);
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

            if (!error) count++;
        }

        revalidatePath('/dashboard');
        return { success: true, count };

    } catch (error) {
        console.error('Sync failed:', error);
        return { error: 'Failed to sync emails. Please try again.' };
    }
}
