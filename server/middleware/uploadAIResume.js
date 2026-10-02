const multer = require("multer");

const isValidPDF = require("../utils/pdfValidator");

const uploadAIResume = multer({
    storage: multer.memoryStorage(),

    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed."), false);
        }

        cb(null, true);
    },

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

const validateAIResumePDF = (req, res, next) => {
    if (!req.file || !isValidPDF(req.file.buffer)) {
        return res.status(400).json({
            success: false,
            message: "Invalid PDF file.",
        });
    }

    next();
};

module.exports = {
    uploadAIResume,
    validateAIResumePDF,
};