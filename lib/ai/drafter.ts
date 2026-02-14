import { generateContentWithFallback } from './gemini';

export async function generateDraft(
    emailSubject: string,
    emailSnippet: string,
    senderName: string,
    availabilityContext?: string,
    userDisplayName?: string
) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("No Gemini Key found, returning mock draft.");
        return `Hi ${senderName},\n\nThanks for reaching out. I received your email regarding "${emailSubject}".\n\nI will get back to you shortly.\n\nBest,\n[Your Name]`;
    }

    try {
        let prompt = `
        You are an expert executive assistant. Your goal is to draft professional, concise, and polite email replies.
        
        Incoming Email:
        Subject: ${emailSubject}
        Sender: ${senderName}
        Snippet: ${emailSnippet}
        `;

        if (availabilityContext) {
            prompt += `
            
            My Calendar Context (Upcoming Events):
            ${availabilityContext}
            
            Instruction:
            The sender is likely asking for a meeting. 
            Use the calendar context to suggest a time when I am free.
            Propose 1 or 2 specific slots.
            `;
        } else {
            prompt += `
            Draft a response that acknowledges the email.
            If the email asks for something you don't know, provide a polite standard response explaining I will look into it.
            `;
        }

        prompt += `
        CRITICAL RULES:
        1. Do NOT include a "Subject:" line. Start directly with the greeting.
        2. Do NOT use placeholders like "[Insert Name]" or "[Your Name]".
        3. Sign off as "${userDisplayName || 'Maybefair User'}".
        4. Write as if YOU are the user replying.
        5. Keep it natural, professional, and under 100 words.
        `;

        const text = await generateContentWithFallback(prompt);
        return text || "Draft generation failed.";
    } catch (error: any) {
        console.error("Gemini Draft Error:", error);
        return `Error generating draft: ${error.message || JSON.stringify(error)}`;
    }
}
