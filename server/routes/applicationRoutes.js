const express = require("express");

const router = express.Router();

const {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
} = require("../controllers/applicationController");

router.get("/", getAllApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

module.exports = router;