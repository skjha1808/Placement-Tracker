const express = require("express");

const { analyzeResumeController } = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");
const uploadAIResume = require("../middleware/uploadAIResume");

const router = express.Router();

router.post(
    "/analyze-resume",
    authMiddleware,
    studentMiddleware,
    uploadAIResume.single("resume"),
    analyzeResumeController
);

module.exports = router;