const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} = require("../controllers/notificationController");

// Apply authentication to all routes
router.use(authMiddleware);

// Notification Routes
router.get(
    "/",
    getMyNotifications
);

router.put(
    "/:id/read",
    markAsRead
);

router.put(
    "/read-all",
    markAllAsRead
);

router.delete(
    "/:id",
    deleteNotification
);

module.exports = router;