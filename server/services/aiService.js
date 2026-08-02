const { GoogleGenAI } = require("@google/genai");
const buildResumePrompt = require("../prompts/resumePrompt");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeResume(resumeText) {
    try {
        // Build the prompt
        const prompt = buildResumePrompt(resumeText);

        // Send prompt to Gemini
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });

        // Get the generated text
        const result = response.text;

        // Remove markdown if present
        const cleanedResult = result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // Check for empty response
        if (!cleanedResult) {
            throw new Error("Empty response from Gemini.");
        }

        // Convert JSON string to JavaScript object
        return JSON.parse(cleanedResult);

    } catch (error) {
        console.error("Gemini Error:", error);

        throw error;
    }
}

module.exports = {
    analyzeResume,
};