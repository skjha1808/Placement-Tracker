const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createStudent,
    getMyProfile,
    updateMyProfile,
    verifyStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} = require("../controllers/studentController");

router.post(
    "/",
    authMiddleware,
    studentMiddleware,
    createStudent
);

router.get(
    "/me",
    authMiddleware,
    studentMiddleware,
    getMyProfile
);

router.put(
    "/me",
    authMiddleware,
    studentMiddleware,
    updateMyProfile
);

router.put(
    "/:id/verify",
    authMiddleware,
    adminMiddleware,
    verifyStudent
);

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllStudents
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getStudentById
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateStudent
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteStudent
);

module.exports = router;