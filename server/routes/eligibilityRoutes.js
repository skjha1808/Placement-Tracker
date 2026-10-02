const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");

const {
    checkEligibility,
} = require("../controllers/eligibilityController");

// Apply authentication to all routes
router.use(authMiddleware);

// Check eligibility for a company
router.get(
    "/:companyId",
    studentMiddleware,
    checkEligibility
);

module.exports = router;