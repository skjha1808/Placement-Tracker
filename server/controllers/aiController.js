const { parseResume } = require("../utils/resumeParser");
const { analyzeResume } = require("../services/aiService");

async function analyzeResumeController(req, res) {

    try {

        // Check whether a resume was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required.",
            });
        }


        // Extract text from PDF
        const resumeText = await parseResume(req.file.buffer);


        // Validate extracted text
        const wordCount = resumeText
            .split(/\s+/)
            .filter(Boolean)
            .length;


        if (wordCount < 30) {
            return res.status(400).json({
                success: false,
                message:
                    "We couldn't extract readable text from this PDF. " +
                    "This usually happens with some resume templates or PDF export formats. " +
                    "Please re-export your resume as a standard PDF using Microsoft Word, " +
                    "Google Docs, or your resume builder.",
            });
        }


        // Analyze resume using Gemini
        const analysis = await analyzeResume(resumeText);


        // Send successful response
        return res.status(200).json({
            success: true,
            analysis,
        });

    } catch (error) {

        console.error("AI Resume Analysis Error:", error);


        const originalMessage = error.message || "";
        const message = originalMessage.toLowerCase();


        // Gemini quota / rate-limit error
        if (
            message.includes("resource_exhausted") ||
            message.includes("quota") ||
            message.includes("429") ||
            message.includes("rate limit")
        ) {
            return res.status(429).json({
                success: false,
                message:
                    "AI Resume Analysis is temporarily unavailable due to usage limits. Please try again later.",
            });
        }


        // Gemini authentication / API key error
        if (
            message.includes("api key") ||
            message.includes("authentication") ||
            message.includes("unauthorized") ||
            message.includes("401")
        ) {
            return res.status(503).json({
                success: false,
                message:
                    "AI Resume Analysis is temporarily unavailable. Please try again later.",
            });
        }


        // Invalid Gemini JSON response
        if (
            message.includes("invalid analysis response") ||
            message.includes("incomplete analysis")
        ) {
            return res.status(502).json({
                success: false,
                message:
                    "The AI service returned an invalid analysis. Please try again.",
            });
        }


        // Invalid AI score
        if (
            message.includes("invalid resume score") ||
            message.includes("invalid score for") ||
            message.includes("inconsistent resume score")
        ) {
            return res.status(502).json({
                success: false,
                message:
                    "The AI service returned an inconsistent analysis. Please try again.",
            });
        }


        // PDF parsing error
        if (
            message.includes("failed to parse resume pdf") ||
            message.includes("pdf parse")
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Unable to read this PDF. Please upload another PDF version or export the resume again.",
            });
        }


        // Generic server error
        return res.status(500).json({
            success: false,
            message:
                "Failed to analyze the resume. Please try again later.",
        });
    }
}


module.exports = {
    analyzeResumeController,
};