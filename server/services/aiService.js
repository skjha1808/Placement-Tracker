const { GoogleGenAI } = require("@google/genai");
const buildResumePrompt = require("../prompts/resumePrompt");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

function validateResumeAnalysis(analysis) {

    const requiredFields = [
        "resumeScore",
        "overallVerdict",
        "scoreBreakdown",
        "roleFit",
        "strengths",
        "weaknesses",
        "atsKeywords",
        "missingSkills",
        "suggestions",
        "nextSteps",
        "summary",
    ];

    for (const field of requiredFields) {

        if (!(field in analysis)) {
            throw new Error(
                `Gemini returned an incomplete analysis: missing "${field}".`
            );
        }
    }

    return true;
}

function validateScoreRanges(analysis) {

    const breakdown = analysis.scoreBreakdown;

    const limits = {
        technicalSkills: 20,
        projects: 20,
        education: 15,
        experience: 20,
        atsOptimization: 15,
        resumeFormatting: 10,
    };

    // Validate overall score
    if (
        !Number.isInteger(analysis.resumeScore) ||
        analysis.resumeScore < 0 ||
        analysis.resumeScore > 100
    ) {
        throw new Error(
            "Gemini returned an invalid resume score."
        );
    }

    // Validate individual breakdown scores
    for (const [field, max] of Object.entries(limits)) {

        const value = breakdown[field];

        if (
            !Number.isInteger(value) ||
            value < 0 ||
            value > max
        ) {
            throw new Error(
                `Gemini returned an invalid score for "${field}".`
            );
        }
    }

    // Ensure total matches resumeScore
    const total =
        breakdown.technicalSkills +
        breakdown.projects +
        breakdown.education +
        breakdown.experience +
        breakdown.atsOptimization +
        breakdown.resumeFormatting;

    if (total !== analysis.resumeScore) {
        throw new Error(
            "Gemini returned an inconsistent resume score."
        );
    }

    return true;
}

async function analyzeResume(resumeText) {

    try {
        // Build the prompt
        const prompt = buildResumePrompt(resumeText);

        // Send prompt to Gemini
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });

        // Get generated text
        const result = response.text;

        // Check for empty response
        if (!result || !result.trim()) {
            throw new Error("Empty response from Gemini.");
        }

        // Remove possible Markdown code fences
        const cleanedResult = result
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Parse Gemini JSON response
        let analysis;

        try {
            analysis = JSON.parse(cleanedResult);

        } catch (parseError) {

            console.error("Gemini JSON Parse Error:", parseError);
            console.error("Gemini Raw Response:", result);

            throw new Error(
                "Gemini returned an invalid analysis response."
            );
        }

        // Check that Gemini returned an object
        if (!analysis || typeof analysis !== "object") {

            throw new Error(
                "Gemini returned an invalid analysis response."
            );
        }

        // Validate required fields
        validateResumeAnalysis(analysis);
        validateScoreRanges(analysis);

        // Return validated analysis
        return analysis;

    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}

module.exports = {
    analyzeResume,
};