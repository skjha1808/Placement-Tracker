const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    uploadResume: uploadResumeMiddleware,
    validateResumePDF,
} = require("../middleware/uploadResume");

const {
    createStudent,
    getMyProfile,
    updateMyProfile,
    uploadResume,
    getMyResume,
    getStudentResume,
    verifyStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,

    // Profile Update Request
    createProfileUpdateRequest,
    getMyProfileUpdateRequests,
    getAllProfileUpdateRequests,
    approveProfileUpdateRequest,
    rejectProfileUpdateRequest,
    revokeProfileEditAccess,
} = require("../controllers/studentController");


// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);


// =====================================================
// STUDENT ROUTES
// =====================================================

// Create student profile
router.post(
    "/",
    studentMiddleware,
    createStudent
);


// Get logged-in student's profile
router.get(
    "/me",
    studentMiddleware,
    getMyProfile
);


// Get logged-in student's resume
router.get(
    "/me/resume",
    studentMiddleware,
    getMyResume
);


// Upload resume
router.post(
    "/upload-resume",
    studentMiddleware,
    uploadResumeMiddleware.single("resume"),
    validateResumePDF,
    uploadResume
);


// Update logged-in student's profile
router.put(
    "/me",
    studentMiddleware,
    updateMyProfile
);


// =====================================================
// PROFILE UPDATE REQUESTS - STUDENT
// =====================================================

// Submit request to temporarily edit frozen profile
router.post(
    "/profile-update-requests",
    studentMiddleware,
    createProfileUpdateRequest
);


// Get logged-in student's profile update requests
router.get(
    "/profile-update-requests/me",
    studentMiddleware,
    getMyProfileUpdateRequests
);


// =====================================================
// PROFILE UPDATE REQUESTS - ADMIN
// =====================================================

// Get all profile update requests
router.get(
    "/profile-update-requests",
    adminMiddleware,
    getAllProfileUpdateRequests
);


// Approve profile update request
router.put(
    "/profile-update-requests/:id/approve",
    adminMiddleware,
    approveProfileUpdateRequest
);


// Reject profile update request
router.put(
    "/profile-update-requests/:id/reject",
    adminMiddleware,
    rejectProfileUpdateRequest
);


// Revoke temporary edit access immediately
router.put(
    "/:id/revoke-edit-access",
    adminMiddleware,
    revokeProfileEditAccess
);


// =====================================================
// ADMIN STUDENT ROUTES
// =====================================================

// Get student resume
router.get(
    "/:id/resume",
    adminMiddleware,
    getStudentResume
);


// Verify student
router.put(
    "/:id/verify",
    adminMiddleware,
    verifyStudent
);


// Get all students
router.get(
    "/",
    adminMiddleware,
    getAllStudents
);


// Get student by ID
router.get(
    "/:id",
    adminMiddleware,
    getStudentById
);


// Update student
router.put(
    "/:id",
    adminMiddleware,
    updateStudent
);


// Delete student
router.delete(
    "/:id",
    adminMiddleware,
    deleteStudent
);


module.exports = router;