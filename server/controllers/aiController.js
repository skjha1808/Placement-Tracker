const { parseResume } = require("../utils/resumeParser");
const { analyzeResume } = require("../services/aiService");

async function analyzeResumeController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required.",
            });
        }

        const resumeText = await parseResume(req.file.buffer);

        const analysis = await analyzeResume(resumeText);

        return res.status(200).json({
            success: true,
            analysis,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    analyzeResumeController,
};