import { classifyEmail } from '@/lib/ai/classifier';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { subject, snippet } = await request.json();

        if (!subject && !snippet) {
            return NextResponse.json({ error: 'Subject or snippet required' }, { status: 400 });
        }

        const result = await classifyEmail(subject || '', snippet || '');
        return NextResponse.json(result);
    } catch (error) {
        console.error('Classification API error:', error);
        return NextResponse.json({ error: 'Failed to classify' }, { status: 500 });
    }
}
