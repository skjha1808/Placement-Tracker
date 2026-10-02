const Student = require("../models/Student");

const {
    checkStudentEligibility,
} = require("../services/eligibilityService");

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

        const eligibility = await checkStudentEligibility(
            student,
            req.params.companyId
        );

        return res.status(eligibility.status).json({
            success: eligibility.status === 200,
            eligible: eligibility.eligible,
            reason: eligibility.reason,
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