const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAdminDashboard,
} = require("../controllers/dashboardController");

// Apply authentication to all routes
router.use(authMiddleware);

// Admin Dashboard
router.get(
    "/admin",
    adminMiddleware,
    getAdminDashboard
);

module.exports = router;