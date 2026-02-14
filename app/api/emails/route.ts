import { createClient } from '@/lib/supabase/server'
import { GmailService, getBody, getHeader } from '@/lib/gmail/service'
import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session || !session.provider_token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const gmail = new GmailService(session.provider_token)

    try {
        const messages = await gmail.listEmails('me', 'is:unread', 5)
        const emails = []

        for (const msg of messages) {
            const fullMsg = await gmail.getEmail('me', msg.id!)

            // Safely access payload with optional chaining and fallbacks
            if (!fullMsg.payload) {
                console.warn(`Email ${msg.id} has no payload, skipping`);
                continue;
            }

            const subject = getHeader(fullMsg.payload?.headers || [], 'Subject') || 'No Subject'
            const from = getHeader(fullMsg.payload?.headers || [], 'From') || 'Unknown Sender'
            const snippet = fullMsg.snippet || ''
            emails.push({ id: msg.id, subject, from, snippet })
        }

        return NextResponse.json({ emails })

    } catch (error) {
        console.error('Gmail API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
    }
}
