const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");

const {
    createApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
} = require("../controllers/applicationController");

router.post(
    "/",
    authMiddleware,
    studentMiddleware,
    createApplication
);

router.get(
    "/my",
    authMiddleware,
    studentMiddleware,
    getMyApplications,
);

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllApplications
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getApplicationById
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateApplication
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteApplication
);

module.exports = router;