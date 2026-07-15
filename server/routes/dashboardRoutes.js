const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAdminDashboard,
} = require("../controllers/dashboardController");

router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    getAdminDashboard
);

module.exports = router;