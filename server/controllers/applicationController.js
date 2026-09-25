const Application = require("../models/Application");
const Student = require("../models/Student");

const {
    checkStudentEligibility,
} = require("../services/eligibilityService");

const createApplication = async (req, res) => {
    try {
        const { company, notes } = req.body;

        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        const eligibility = await checkStudentEligibility(
            student,
            company
        );

        if (!eligibility.eligible) {
            return res.status(eligibility.status).json({
                success: false,
                message: eligibility.reason,
            });
        }

        const application = await Application.create({
            student: student._id,
            company,
            notes,
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully.",
            application,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getMyApplications = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        const applications = await Application.find({
            student: student._id,
        })
            .sort({ createdAt: -1 })
            .populate("company");

        res.status(200).json(applications);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getAllApplications = async (req, res) => {
    try {

        const applications = await Application.find()
            .sort({ createdAt: -1 })
            .populate("student")
            .populate("company");

        res.status(200).json(applications);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getApplicationById = async (req, res) => {
    try {

        const application = await Application.findById(req.params.id)
            .populate("student")
            .populate("company");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        res.status(200).json(application);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const updateApplication = async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        application.status = status;

        await application.save();

        await application.populate("student");
        await application.populate("company");

        res.status(200).json({
            success: true,
            message: "Application updated successfully.",
            application,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const deleteApplication = async (req, res) => {
    try {

        const deletedApplication =
            await Application.findByIdAndDelete(req.params.id);

        if (!deletedApplication) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Application deleted successfully.",
            deletedApplication,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
    createApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
};