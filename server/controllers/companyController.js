const Company = require("../models/Company");

const createCompany = async (req, res) => {
    try {

        const company = await Company.create({

            ...req.body,

            location:
                req.body.location
                    .trim()
                    .split(" ")
                    .map(
                        word =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" "),

            role:
                req.body.role
                    .trim()
                    .split(" ")
                    .map(
                        word =>
                            word.toUpperCase() === "SDE"
                                ? "SDE"
                                : word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                    )
                    .join(" "),

            eligibleBranches:
                req.body.eligibleBranches.map(
                    branch =>
                        branch
                            .trim()
                            .toUpperCase()
                ),

        });

        res.status(201).json(company);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateCompany = async (req, res) => {
    try {

        const updatedCompany = await Company.findByIdAndUpdate(

            req.params.id,
            {
                ...req.body,

                location:
                    req.body.location
                        ?.trim()
                        .split(" ")
                        .map(
                            word =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                        )
                        .join(" "),

                role:
                    req.body.role
                        ?.trim()
                        .split(" ")
                        .map(
                            word =>
                                word.toUpperCase() === "SDE"
                                    ? "SDE"
                                    : word.charAt(0).toUpperCase() +
                                      word.slice(1).toLowerCase()
                        )
                        .join(" "),

                eligibleBranches:
                    req.body.eligibleBranches?.map(
                        branch =>
                            branch
                                .trim()
                                .toUpperCase()
                    ),
            },
            {
                new: true,
            }
        );

        res.status(200).json(updatedCompany);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteCompany = async (req, res) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Company deleted successfully",
            deletedCompany,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
};