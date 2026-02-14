import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

// Models to try in order of preference
export const MODEL_CANDIDATES = [
    "gemini-3-flash-preview",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
];

export async function generateContentWithFallback(
    prompt: string | any[],
    config?: GenerationConfig
): Promise<string> {
    let lastError: any;

    for (const modelName of MODEL_CANDIDATES) {
        try {
            console.log(`Attempting to generate content with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // Build request parts
            const parts = Array.isArray(prompt) ? prompt : [{ text: prompt }];

            const result = await model.generateContent({
                contents: [{ role: 'user', parts }],
                generationConfig: config
            });

            const text = result.response.text();
            if (text) {
                console.log(`Success with model: ${modelName}`);
                return text;
            }
        } catch (error: any) {
            console.warn(`Failed with model ${modelName}:`, error.message);
            lastError = error;
            // Continue to next model if it's a 404 or similar recoverable error
            // If it's an API key issue, it might fail for all, but worth trying
        }
    }

    throw lastError || new Error("All model attempts failed.");
}

export async function listAvailableModels() {
    try {
        // This relies on the system instruction not being supported in listModels directly via SDK sometimes depending on version,
        // but let's try the direct API call pattern or SDK method if available.
        // The SDK doesn't always expose listModels directly on the main class easily in all versions, 
        // but currently verify:
        // Actually, strictly speaking, specific SDK versions might vary. 
        // Let's implement a simple fetch if SDK listing is obscure, but genAI.getGenerativeModel is the main entry.
        // Using direct fetch for strictly listing models if SDK doesn't have it handy:

        // Wait, SDK usually doesn't expose listModels on the client instance directly in Node? 
        // Let's check typical usage. 
        // It's often `fetch https://generativelanguage.googleapis.com/v1beta/models?key=...`

        if (!apiKey) return ["No API Key"];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            return data.models.map((m: any) => m.name.replace('models/', ''));
        }
        return ["Could not list models via API"];
    } catch (e) {
        console.error("Error listing models", e);
        return ["Error listing models"];
    }
}
