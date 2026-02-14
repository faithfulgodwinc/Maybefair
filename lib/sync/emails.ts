import { GmailService, getBody, getHeader } from '@/lib/gmail/service';
import { classifyEmail } from '@/lib/ai/classifier';
import { createClient } from '@/lib/supabase/client'; // Use client for now as this might be client-triggered

export async function syncEmails(accessToken: string, userId: string) {
    const gmail = new GmailService(accessToken);
    const supabase = createClient();

    try {
        // 1. Fetch unread emails
        const messages = await gmail.listEmails('me', 'is:unread', 10);
        if (!messages || messages.length === 0) return { count: 0 };

        let count = 0;

        for (const msg of messages) {
            // 2. Check existence
            if (!msg.id) continue;

            const { data: existing } = await supabase
                .from('emails')
                .select('id')
                .eq('id', msg.id)
                .single();

            if (existing) continue;

            // 3. Process new email
            const fullMsg = await gmail.getEmail('me', msg.id);
            const subject = getHeader(fullMsg.payload.headers, 'Subject');
            const from = getHeader(fullMsg.payload.headers, 'From');
            const snippet = fullMsg.snippet;
            // const body = getBody(fullMsg.payload); // Body can be large, maybe skip for now if not needed for classification immediately

            console.log('📧 [SYNC] Processing email:', { id: msg.id, subject: subject?.substring(0, 50) });

            // 4. Classify
            const classification = await classifyEmail(subject, snippet || '');

            console.log('🏷️  [SYNC] Classification result:', {
                subject: subject?.substring(0, 50),
                category: classification.category,
                confidence: classification.confidence
            });

            // 5. Store
            console.log('💾 [SYNC] Saving to database:', {
                id: msg.id,
                category: classification.category,
                confidence: classification.confidence
            });

            const { error } = await supabase.from('emails').insert({
                id: msg.id,
                user_id: userId,
                thread_id: fullMsg.threadId,
                subject,
                snippet,
                sender: from,
                category: classification.category,
                confidence: classification.confidence,
                received_at: new Date(Number(fullMsg.internalDate)).toISOString(),
            });

            if (error) {
                console.error('❌ [SYNC] Failed to insert email:', error);
            } else {
                console.log('✅ [SYNC] Email saved successfully:', msg.id);
                count++;
            }
        }

        console.log('🎉 [SYNC] Sync complete! Total emails synced:', count);
        return { count };

    } catch (error) {
        console.error('Sync Error:', error);
        throw error;
    }
}
