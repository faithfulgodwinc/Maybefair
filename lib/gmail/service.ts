import { google } from 'googleapis'

export class GmailService {
    private auth: any

    constructor(accessToken: string) {
        this.auth = new google.auth.OAuth2()
        this.auth.setCredentials({ access_token: accessToken })
    }

    async listEmails(userId: string = 'me', query: string = 'is:unread', maxResults: number = 10, pageToken?: string) {
        const gmail = google.gmail({ version: 'v1', auth: this.auth })
        const res = await gmail.users.messages.list({
            userId,
            q: query,
            maxResults,
            pageToken,
        })
        return {
            messages: res.data.messages || [],
            nextPageToken: res.data.nextPageToken
        }
    }

    async getEmail(userId: string = 'me', messageId: string) {
        const gmail = google.gmail({ version: 'v1', auth: this.auth })
        const res = await gmail.users.messages.get({
            userId,
            id: messageId,
            format: 'full',
        })
        return res.data
    }
    async sendReply(threadId: string, inReplyTo: string, to: string, subject: string, body: string) {
        const gmail = google.gmail({ version: 'v1', auth: this.auth });

        const str = [
            'Content-Type: text/plain; charset="UTF-8"',
            'MIME-Version: 1.0',
            'Content-Transfer-Encoding: 7bit',
            `To: ${to}`,
            `Subject: ${subject}`,
            `In-Reply-To: ${inReplyTo}`,
            `References: ${inReplyTo}`,
            '',
            body
        ].join('\n');

        const encodedMail = Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMail,
                threadId: threadId
            }
        });

        return res.data;
    }
}

export function getBody(payload: any): string {
    let body = ''
    if (payload.parts) {
        for (const part of payload.parts) {
            if (part.mimeType === 'text/plain') {
                body = part.body.data
            } else if (part.mimeType === 'text/html') {
                // Prefer HTML if available, or handle preference logic here
            }
            if (part.parts) { // recursive
                body = getBody(part)
            }
            if (body) break
        }
    } else if (payload.body && payload.body.data) {
        body = payload.body.data
    }

    if (body) {
        return Buffer.from(body, 'base64').toString('utf-8')
    }
    return ''
}

export function getHeader(headers: any[], name: string): string {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase())
    return header ? header.value : ''
}
