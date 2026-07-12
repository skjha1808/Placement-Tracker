const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    getMyNotifications,

    markAsRead,

    markAllAsRead,

} = require("../controllers/notificationController");

router.get(
    "/",
    authMiddleware,
    getMyNotifications
);

router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);

router.put(
    "/read-all",
    authMiddleware,
    markAllAsRead
);

module.exports = router;