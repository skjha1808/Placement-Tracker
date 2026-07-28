const Student = require("../models/Student");
const Company = require("../models/Company");
const Application = require("../models/Application");

const checkEligibility = async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                eligible: false,
                reason: "Student profile not found.",
            });
        }

        const company = await Company.findById(
            req.params.companyId
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                eligible: false,
                reason: "Company not found.",
            });
        }

        // Check if company is open
        if (company.status !== "Open") {
            return res.status(400).json({
                success: false,
                eligible: false,
                reason: "Applications are closed.",
            });
        }

        // Check application deadline
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deadline = new Date(company.applicationDeadline);
        deadline.setHours(0, 0, 0, 0);

        if (deadline < today) {
            return res.status(400).json({
                success: false,
                eligible: false,
                reason: "Application deadline has passed.",
            });
        }

        // Check student verification
        if (!student.isVerified) {
            return res.status(403).json({
                success: false,
                eligible: false,
                reason: "Your profile is not verified yet.",
            });
        }

        // Check CGPA
        if (student.cgpa < company.minimumCGPA) {
            return res.status(200).json({
                success: true,
                eligible: false,
                reason: `Minimum CGPA required is ${company.minimumCGPA}.`,
            });
        }

        // Check branch eligibility
        const isBranchEligible = company.eligibleBranches.some(
            (branch) =>
                branch.toLowerCase() ===
                student.branch.toLowerCase()
        );

        if (!isBranchEligible) {
            return res.status(200).json({
                success: true,
                eligible: false,
                reason: "Your branch is not eligible.",
            });
        }

        // Check duplicate application
        const alreadyApplied = await Application.findOne({
            student: student._id,
            company: company._id,
        });

        if (alreadyApplied) {
            return res.status(200).json({
                success: true,
                eligible: false,
                reason: "You have already applied to this company.",
            });
        }

        return res.status(200).json({
            success: true,
            eligible: true,
            reason: "Eligible",
        });

    } catch (error) {
        console.error("Eligibility Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to check eligibility.",
        });
    }
};

module.exports = {
    checkEligibility,
};