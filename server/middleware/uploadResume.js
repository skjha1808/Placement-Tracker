const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/resumes");

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            path.extname(file.originalname);

        cb(null, uniqueName);

    },

});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {

        cb(null, true);

    } else {

        cb(
            new Error("Only PDF files are allowed"),
            false
        );

    }

};

const uploadResume = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024,

    },

});

module.exports = uploadResume;