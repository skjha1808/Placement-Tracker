const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
} = require("../controllers/authController");

const { authLimiter } = require("../middleware/rateLimiter");

// Authentication Routes
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);

module.exports = router;