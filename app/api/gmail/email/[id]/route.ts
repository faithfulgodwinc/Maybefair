import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GmailService, getBody } from '@/lib/gmail/service';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();

        // Get user and access token
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's session for access token
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.provider_token;

        if (!accessToken) {
            return NextResponse.json({ error: 'No access token' }, { status: 401 });
        }

        const emailId = params.id;

        console.log('📧 [EMAIL-DETAIL] Fetching email:', emailId);

        // Fetch full email from Gmail
        const gmail = new GmailService(accessToken);
        const fullEmail = await gmail.getEmail('me', emailId);

        // Extract body
        const body = getBody(fullEmail.payload);

        console.log('✅ [EMAIL-DETAIL] Email fetched successfully');

        return NextResponse.json({
            id: emailId,
            body: body || fullEmail.snippet,
            snippet: fullEmail.snippet,
        });
    } catch (error) {
        console.error('❌ [EMAIL-DETAIL] Error fetching email:', error);
        return NextResponse.json(
            { error: 'Failed to fetch email' },
            { status: 500 }
        );
    }
}
