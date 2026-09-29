const multer = require("multer");
const path = require("path");
const fs = require("fs");

const isValidPDF = require("../utils/pdfValidator");

const uploadPath = "uploads/resumes";

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname).toLowerCase()}`;

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed."), false);
    }
};

const uploadResume = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

const validateResumePDF = (req, res, next) => {
    if (!req.file || !isValidPDF(fs.readFileSync(req.file.path))) {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
            success: false,
            message: "Invalid PDF file.",
        });
    }

    next();
};

module.exports = {
    uploadResume,
    validateResumePDF,
};