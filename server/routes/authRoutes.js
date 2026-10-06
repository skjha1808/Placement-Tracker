const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getCurrentUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");


// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

router.post(
    "/register",
    authLimiter,
    registerUser
);

router.post(
    "/login",
    authLimiter,
    loginUser
);


// =====================================================
// CURRENT USER
// =====================================================

router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);


module.exports = router;