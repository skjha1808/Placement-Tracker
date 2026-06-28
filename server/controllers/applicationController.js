const Application = require("../models/Application");

const createApplication = async (req, res) => {
    try {
        const application = await Application.create(req.body);

        res.status(201).json(application);
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
        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedApplication);
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
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
};