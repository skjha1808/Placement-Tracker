const Company = require("../models/Company");

const {
    formatText,
    formatCompanyName,
    formatLocation,
    formatRole,
    formatBranches,
} = require("../utils/formatters");

const {
    isPositiveNumber,
    isValidCGPA,
    isFutureDate,
} = require("../utils/validators");

const createCompany = async (req, res) => {
    try {
        const {
            companyName,
            role,
            package,
            location,
            jobType,
            eligibleBranches,
            minimumCGPA,
            applicationDeadline,
        } = req.body;

        // Check required fields
        if (
            !companyName ||
            !role ||
            package === undefined ||
            !location ||
            !jobType ||
            !eligibleBranches ||
            eligibleBranches.length === 0 ||
            minimumCGPA === undefined ||
            !applicationDeadline
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate package
        if (!isPositiveNumber(package)) {
            return res.status(400).json({
                success: false,
                message: "Package must be a positive number",
            });
        }

        // Validate CGPA
        if (!isValidCGPA(minimumCGPA)) {
            return res.status(400).json({
                success: false,
                message: "Minimum CGPA must be between 0 and 10",
            });
        }

        // Validate deadline
        if (!isFutureDate(applicationDeadline)) {
            return res.status(400).json({
                success: false,
                message: "Application deadline cannot be in the past",
            });
        }

        // Format values
        const formattedCompanyName = formatCompanyName(companyName);
        const formattedRole = formatRole(role);
        const formattedLocation = formatLocation(location);
        const formattedBranches =
            formatBranches(eligibleBranches);

        // Check duplicate company
        const existingCompany = await Company.findOne({
            companyName: formattedCompanyName,
            role: formattedRole,
        });

        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message:
                    "Company with this role already exists",
            });
        }

        // Create company
        const company = await Company.create({
            ...req.body,
            companyName: formattedCompanyName,
            role: formattedRole,
            location: formattedLocation,
            eligibleBranches: formattedBranches,
        });

        return res.status(201).json({
            success: true,
            message: "Company created successfully",
            company,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedCompanies = companies.map((company) => {
            const companyObj = company.toObject();

            const deadline = new Date(companyObj.applicationDeadline);
            deadline.setHours(0, 0, 0, 0);

            if (
                companyObj.status === "Open" &&
                deadline < today
            ) {
                companyObj.status = "Closed";
            }
            
            return companyObj;
        });

        return res.status(200).json({
            success: true,
            companies: updatedCompanies,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(
            req.params.id
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        const companyObj = company.toObject();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (
            companyObj.status === "Open" &&
            new Date(companyObj.applicationDeadline) < today
        ) {
            companyObj.status = "Closed";
        }

        return res.status(200).json({
            success: true,
            company: companyObj,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCompany = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.companyName) {
            updateData.companyName = formatCompanyName(
                updateData.companyName
            );
        }

        if (updateData.role) {
            updateData.role = formatRole(
                updateData.role
            );
        }

        if (updateData.location) {
            updateData.location = formatLocation(
                updateData.location
            );
        }

        if (updateData.eligibleBranches) {
            updateData.eligibleBranches =
                formatBranches(
                    updateData.eligibleBranches
                );
        }

        // Check if company exists
        const currentCompany = await Company.findById(
            req.params.id
        );

        if (!currentCompany) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        // Values after update
        const companyName =
            updateData.companyName ||
            currentCompany.companyName;

        const role =
            updateData.role ||
            currentCompany.role;

        // Check duplicate company
        const existingCompany = await Company.findOne({
            companyName,
            role,
            _id: { $ne: req.params.id },
        });

        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message:
                    "Company with this role already exists",
            });
        }

        console.log("Update Data:", updateData);
        
        const updatedCompany =
            await Company.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        return res.status(200).json({
            success: true,
            message: "Company updated successfully",
            company: updatedCompany,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteCompany = async (req, res) => {
    try {
        const deletedCompany =
            await Company.findByIdAndDelete(
                req.params.id
            );

        if (!deletedCompany) {
            return res.status(404).json({
                success: false,
                message: "Company not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
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