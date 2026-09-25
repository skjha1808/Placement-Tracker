const multer = require("multer");

const uploadAIResume = multer({
    storage: multer.memoryStorage(),

    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed."), false);
        }
    },

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

module.exports = uploadAIResume;