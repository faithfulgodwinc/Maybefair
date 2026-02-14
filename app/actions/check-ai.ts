'use server'

import { listAvailableModels } from "@/lib/ai/gemini";

export async function checkGeminiModelsAction() {
    const models = await listAvailableModels();
    console.log("Check Models Action Result:", models);
    return models;
}
