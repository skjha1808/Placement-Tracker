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
                eligible: false,
                reason: "Student profile not found",
            });
        }

        const company = await Company.findById(
            req.params.companyId
        );

        if (!company) {
            return res.status(404).json({
                eligible: false,
                reason: "Company not found",
            });
        }

        if (company.status !== "Open") {
            return res.status(400).json({
                eligible: false,
                reason: "Applications are closed",
            });
        }

        if (student.cgpa < company.minimumCGPA) {
            return res.status(200).json({
                eligible: false,
                reason: `Minimum CGPA required is ${company.minimumCGPA}`,
            });
        }

        const isBranchEligible =
            company.eligibleBranches.some(
                branch =>
                    branch.toLowerCase() ===
                    student.branch.toLowerCase()
            );

        if (!isBranchEligible) {
            return res.status(200).json({
                eligible: false,
                reason: "Your branch is not eligible",
            });
        }

        const alreadyApplied =
            await Application.findOne({
                student: student._id,
                company: company._id,
            });

        if (alreadyApplied) {
            return res.status(200).json({
                eligible: false,
                reason: "Already Applied",
            });
        }

        return res.status(200).json({
            eligible: true,
            reason: "Eligible",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

module.exports = {
    checkEligibility,
};