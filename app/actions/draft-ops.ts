'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { GmailService } from '@/lib/gmail/service';

export async function deleteDraftAction(draftId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('drafts').delete().eq('id', draftId);

    if (error) {
        console.error("Delete draft error:", error);
        return { success: false, error: 'Failed to delete' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function sendDraftAction(draftId: string, content: string) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.provider_token) {
        return { success: false, error: 'No provider token found. Please sign out and sign in again.' };
    }

    // 1. Get draft info to find email_id
    const { data: draft, error: draftError } = await supabase
        .from('drafts')
        .select('email_id')
        .eq('id', draftId)
        .single();

    if (draftError || !draft) return { success: false, error: 'Draft not found' };

    // 2. Get original email to find threadId and messageId
    const { data: email, error: emailError } = await supabase
        .from('emails')
        .select('id, snippet') // 'id' contains the Gmail Message ID
        .eq('id', draft.email_id)
        .single();

    if (emailError || !email) {
        console.error("Fetch email error:", emailError);
        return { success: false, error: 'Original email not found' };
    }

    try {
        const gmail = new GmailService(session.provider_token);

        // Fetch full original email to get ThreadID and Message-ID (for In-Reply-To)
        // Note: 'gmail_id' in our DB is the Message ID from the list response. 
        // We need to fetch the actual message to find its 'threadId' and header 'Message-ID' (if different, but usually the API ID is enough for threadId).
        // Actually, gmail.users.messages.get response includes threadId.

        const originalMsg = await gmail.getEmail('me', email.id);

        if (!originalMsg.threadId) {
            return { success: false, error: 'Could not find thread ID for original email' };
        }

        // Find the Message-ID header for In-Reply-To
        const headers = originalMsg.payload?.headers;
        const messageIdHeader = headers?.find((h: any) => h.name === 'Message-ID')?.value;
        const fromHeader = headers?.find((h: any) => h.name === 'From')?.value;
        const subjectHeader = headers?.find((h: any) => h.name === 'Subject')?.value;

        // Use the original Subject (with Re: if needed, though usually client handles it or threadId does)
        // Gmail threading usually requires matching Subject and Re: prefix helps
        let subject = subjectHeader || 'No Subject';
        if (!subject.startsWith('Re:')) {
            subject = 'Re: ' + subject;
        }

        if (!messageIdHeader) {
            console.warn("Could not find Message-ID header, sending as new message in thread if possible.");
        }

        // Send reply
        await gmail.sendReply(
            originalMsg.threadId,
            messageIdHeader || email.id, // Fallback to API ID
            fromHeader || '', // Reply to the sender
            subject,
            content
        );

        await supabase
            .from('drafts')
            .update({ status: 'sent', content: content })
            .eq('id', draftId);

        revalidatePath('/dashboard');
        return { success: true, recipient: fromHeader || 'recipient' };
    } catch (error: any) {
        console.error("Send draft error:", error);
        return { success: false, error: error.message };
    }
}
