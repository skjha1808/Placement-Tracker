const Company = require("../models/Company");
const Application = require("../models/Application");

const checkStudentEligibility = async (student, companyId) => {

    const company = await Company.findById(companyId);

    if (!company) {
        return {
            eligible: false,
            status: 404,
            reason: "Company not found.",
        };
    }

    // Check if company is open
    if (company.status !== "Open") {
        return {
            eligible: false,
            status: 400,
            reason: "Applications are closed.",
        };
    }

    // Check application deadline
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(company.applicationDeadline);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < today) {
        return {
            eligible: false,
            status: 400,
            reason: "Application deadline has passed.",
        };
    }

    // Check student verification
    if (!student.isVerified) {
        return {
            eligible: false,
            status: 403,
            reason: "Your profile is not verified yet.",
        };
    }

    // Check CGPA
    if (student.cgpa < company.minimumCGPA) {
        return {
            eligible: false,
            status: 200,
            reason: `Minimum CGPA required is ${company.minimumCGPA}.`,
        };
    }

    // Check branch eligibility
    const isBranchEligible = company.eligibleBranches.some(
        (branch) =>
            branch.toLowerCase() ===
            student.branch.toLowerCase()
    );

    if (!isBranchEligible) {
        return {
            eligible: false,
            status: 200,
            reason: "Your branch is not eligible.",
        };
    }

    // Check duplicate application
    const alreadyApplied = await Application.findOne({
        student: student._id,
        company: company._id,
    });

    if (alreadyApplied) {
        return {
            eligible: false,
            status: 200,
            reason: "You have already applied to this company.",
        };
    }

    return {
        eligible: true,
        status: 200,
        reason: "Eligible",
        company,
    };
};

module.exports = {
    checkStudentEligibility,
};