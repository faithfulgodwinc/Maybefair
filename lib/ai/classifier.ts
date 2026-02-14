import { generateContentWithFallback, listAvailableModels } from './gemini';

export type EmailCategory = 'meeting_request' | 'question' | 'urgent' | 'newsletter' | 'spam' | 'other';

export interface ClassificationResult {
    category: EmailCategory;
    confidence: number;
}

export async function classifyEmail(subject: string, snippet: string): Promise<ClassificationResult> {
    const prompt = `
    You are an executive assistant's AI. Classify the following email into one of these categories:
    - meeting_request: Requests for meetings, scheduling, calendar invites.
    - question: Direct questions requiring an answer.
    - urgent: High priority, immediate action required (e.g., "Urgent", "ASAP").
    - newsletter: Marketing, updates, digests.
    - spam: Junk, unsolicited offers.
    - other: Anything else.

    Email Subject: "${subject}"
    Email Snippet: "${snippet}"

    Return ONLY a JSON object in this format: { "category": "category_name", "confidence": 0.0 to 1.0 }
  `;

    try {
        console.log('🔍 [CLASSIFIER] Starting classification for:', { subject: subject.substring(0, 50) });
        console.log('📤 [CLASSIFIER] Sending prompt to Gemini (first 200 chars):', prompt.substring(0, 200));

        const text = await generateContentWithFallback(prompt, {
            responseMimeType: "application/json"
        });

        console.log('📥 [CLASSIFIER] Raw Gemini response:', text);

        const classification = JSON.parse(text) as ClassificationResult;

        console.log('✅ [CLASSIFIER] Parsed classification:', classification);
        console.log('🏷️  [CLASSIFIER] Category:', classification.category, '| Confidence:', classification.confidence);

        return classification;
    } catch (error) {
        console.error('❌ [CLASSIFIER] Classification error:', error);
        console.error('⚠️  [CLASSIFIER] Using fallback: category=other, confidence=0');

        // Log available models for debugging if it failed
        listAvailableModels().then(models => console.log("📋 [CLASSIFIER] Available models:", models));

        return { category: 'other', confidence: 0 };
    }
}
