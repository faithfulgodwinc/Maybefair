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
        const text = await generateContentWithFallback(prompt, {
            responseMimeType: "application/json"
        });

        const classification = JSON.parse(text) as ClassificationResult;
        return classification;
    } catch (error) {
        console.error('Classification error:', error);

        // Log available models for debugging if it failed
        listAvailableModels().then(models => console.log("Available models:", models));

        return { category: 'other', confidence: 0 };
    }
}
