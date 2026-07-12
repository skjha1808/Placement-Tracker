const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");

const {
    checkEligibility,
} = require("../controllers/eligibilityController");

router.get(
    "/:companyId",
    authMiddleware,
    studentMiddleware,
    checkEligibility
);

module.exports = router;