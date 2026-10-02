const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
} = require("../controllers/companyController");

// Apply authentication to all routes
router.use(authMiddleware);

// Common Routes (Admin & Student)

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);

// Admin Routes
router.post(
    "/",
    adminMiddleware,
    createCompany
);

router.put(
    "/:id",
    adminMiddleware,
    updateCompany
);

router.delete(
    "/:id",
    adminMiddleware,
    deleteCompany
);

module.exports = router;