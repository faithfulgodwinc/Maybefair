'use server'

import { createClient } from '@/lib/supabase/server';
import { generateDraft } from '@/lib/ai/drafter';
import { CalendarService } from '@/lib/calendar/service';
import { revalidatePath } from 'next/cache';

export async function generateDraftAction(emailId: string) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return { error: 'Not authenticated' };
    }

    // 1. Fetch the email details
    const { data: email, error: fetchError } = await supabase
        .from('emails')
        .select('*')
        .eq('id', emailId)
        .single();

    if (fetchError || !email) {
        return { error: 'Email not found' };
    }

    // 2. Generate Draft
    // Ensure we have a sender name (or fallback)
    const senderName = email.sender || 'Sender';

    let availabilityContext = '';

    // Only fetch calendar if it seems like a meeting request
    if (email.category === 'meeting_request' && session.provider_token) {
        try {
            const calendar = new CalendarService(session.provider_token);
            // Fetch events for next 3 days
            const events = await calendar.listUpcomingEvents(15);

            if (events.length > 0) {
                availabilityContext = events.map((e: any) => {
                    const time = e.start.dateTime
                        ? new Date(e.start.dateTime).toLocaleString()
                        : `All Day (${e.start.date})`;
                    return `- ${e.summary} at ${time}`;
                }).join('\n');
            } else {
                availabilityContext = "No upcoming events found (Calendar is clear).";
            }
        } catch (calError: any) {
            console.warn("Failed to fetch calendar for draft context:", calError);
            // Continue without calendar context
        }
    }

    const userDisplayName = session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Me';
    const draftContent = await generateDraft(email.subject, email.snippet, senderName, availabilityContext, userDisplayName);

    // 3. Save to Drafts table
    const { error: insertError } = await supabase
        .from('drafts')
        .insert({
            user_id: session.user.id,
            email_id: emailId,
            content: draftContent,
            status: 'pending'
        });

    if (insertError) {
        console.error("Draft Insert Error:", insertError);
        return { error: 'Failed to save draft' };
    }

    // Return the full draft object so UI can display it immediately
    const { data: newDraft, error: fetchDraftError } = await supabase
        .from('drafts')
        .select('*')
        .eq('email_id', emailId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (fetchDraftError || !newDraft) {
        return { success: true }; // Fallback to revalidate only
    }

    revalidatePath('/dashboard');
    return { success: true, draft: newDraft };
}
