const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");

const {
    createApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
} = require("../controllers/applicationController");

// Apply authentication to all routes
router.use(authMiddleware);

// Student Routes
router.post(
    "/",
    studentMiddleware,
    createApplication
);

router.get(
    "/my",
    studentMiddleware,
    getMyApplications
);

// Admin Routes
router.get(
    "/",
    adminMiddleware,
    getAllApplications
);

router.get(
    "/:id",
    adminMiddleware,
    getApplicationById
);

router.put(
    "/:id",
    adminMiddleware,
    updateApplication
);

router.delete(
    "/:id",
    adminMiddleware,
    deleteApplication
);

module.exports = router;