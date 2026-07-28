const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const uploadResumeMiddleware = require("../middleware/uploadResume");

const {
    createStudent,
    getMyProfile,
    updateMyProfile,
    uploadResume,
    verifyStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} = require("../controllers/studentController");

// Apply authentication to all routes
router.use(authMiddleware);

// Student Routes
router.post(
    "/",
    studentMiddleware,
    createStudent
);

router.get(
    "/me",
    studentMiddleware,
    getMyProfile
);

router.put(
    "/me",
    studentMiddleware,
    updateMyProfile
);

router.post(
    "/upload-resume",
    studentMiddleware,
    uploadResumeMiddleware.single("resume"),
    uploadResume
);

// Admin Routes
router.put(
    "/:id/verify",
    adminMiddleware,
    verifyStudent
);

router.get(
    "/",
    adminMiddleware,
    getAllStudents
);

router.get(
    "/:id",
    adminMiddleware,
    getStudentById
);

router.put(
    "/:id",
    adminMiddleware,
    updateStudent
);

router.delete(
    "/:id",
    adminMiddleware,
    deleteStudent
);

module.exports = router;