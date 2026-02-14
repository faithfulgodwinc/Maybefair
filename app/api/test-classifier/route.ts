import { NextRequest, NextResponse } from 'next/server';
import { classifyEmail } from '@/lib/ai/classifier';

export async function POST(request: NextRequest) {
    try {
        const { subject, snippet } = await request.json();

        if (!subject) {
            return NextResponse.json(
                { error: 'Subject is required' },
                { status: 400 }
            );
        }

        console.log('🧪 [TEST-CLASSIFIER] Testing classification:', { subject, snippet });

        const result = await classifyEmail(subject, snippet || '');

        console.log('🧪 [TEST-CLASSIFIER] Result:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('🧪 [TEST-CLASSIFIER] Error:', error);
        return NextResponse.json(
            { error: 'Classification failed' },
            { status: 500 }
        );
    }
}
