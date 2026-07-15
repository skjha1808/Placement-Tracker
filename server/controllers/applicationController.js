const Application = require("../models/Application");
const Student = require("../models/Student");

const createApplication = async (req, res) => {
    try {
        const { company, notes } = req.body;

        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        const existingApplication = await Application.findOne({
            student: student._id,
            company,
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied to this company",
            });
        }

        const application = await Application.create({
            student: student._id,
            company,
            notes,
        });

        res.status(201).json(application);

    } catch (error) {
        res.status(500).json({
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
                message: "Student profile not found",
            });
        }

        const applications = await Application.find({
            student: student._id,
        }).populate("company");

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("student")
            .populate("company");

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate("student")
            .populate("company");

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateApplication = async (req, res) => {
    try {

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("student")
            .populate("company");

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        res.status(200).json(application);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const deleteApplication = async (req, res) => {
    try {
        const deletedApplication = await Application.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Application deleted successfully",
            deletedApplication,
        });
    } catch (error) {
        res.status(500).json({
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