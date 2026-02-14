import { google } from 'googleapis';

export interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: {
        dateTime?: string; // format: "2023-10-25T10:00:00-07:00"
        date?: string; // format: "2023-10-25" (all day)
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    location?: string;
    htmlLink?: string;
}

export class CalendarService {
    private auth: any;

    constructor(accessToken: string) {
        this.auth = new google.auth.OAuth2();
        this.auth.setCredentials({ access_token: accessToken });
    }

    async listUpcomingEvents(maxResults: number = 10): Promise<CalendarEvent[]> {
        const calendar = google.calendar({ version: 'v3', auth: this.auth });
        try {
            const res = await calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                maxResults: maxResults,
                singleEvents: true,
                orderBy: 'startTime',
            });

            return (res.data.items as CalendarEvent[]) || [];
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            throw error;
        }
    }

    async checkAvailability(startTime: string, endTime: string): Promise<boolean> {
        const calendar = google.calendar({ version: 'v3', auth: this.auth });
        try {
            const res = await calendar.freebusy.query({
                requestBody: {
                    timeMin: startTime,
                    timeMax: endTime,
                    items: [{ id: 'primary' }],
                },
            });

            const busySlots = res.data.calendars?.['primary']?.busy;
            return !busySlots || busySlots.length === 0;
        } catch (error) {
            console.error('Error checking availability:', error);
            // Assume busy on error to be safe? Or rethrow?
            // Let's return false safely but log it.
            return false;
        }
    }
}
