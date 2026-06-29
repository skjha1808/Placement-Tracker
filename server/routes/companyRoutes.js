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

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createCompany
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateCompany
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteCompany
);

module.exports = router;