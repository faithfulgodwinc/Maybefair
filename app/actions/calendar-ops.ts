'use server'

import { createClient } from '@/lib/supabase/server';
import { CalendarService, CalendarEvent } from '@/lib/calendar/service';

export async function getUpcomingEventsAction(): Promise<{ events: CalendarEvent[]; error?: string }> {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.provider_token) {
        return { events: [], error: 'Not authenticated with Google' };
    }

    try {
        const calendar = new CalendarService(session.provider_token);
        const events = await calendar.listUpcomingEvents();
        return { events };
    } catch (error: any) {
        console.error("Fetch events error:", error);
        return { events: [], error: 'Failed to fetch events' };
    }
}
