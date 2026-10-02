const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Company = require("../models/Company");

const {
    formatCompanyName,
    formatLocation,
    formatRole,
    formatBranches,
} = require("../utils/formatters");

dotenv.config();

const formatExistingCompanies = async () => {
    try {
        await connectDB();

        const companies = await Company.find();

        let updatedCount = 0;

        for (const company of companies) {
            const formattedCompanyName = formatCompanyName(company.companyName);
            const formattedLocation = formatLocation(company.location);
            const formattedRole = formatRole(company.role);
            const formattedBranches = formatBranches(
                company.eligibleBranches || []
            );

            let isUpdated = false;

            if (company.companyName !== formattedCompanyName) {
                company.companyName = formattedCompanyName;
                isUpdated = true;
            }

            if (company.role !== formattedRole) {
                company.role = formattedRole;
                isUpdated = true;
            }

            if (
                JSON.stringify(company.eligibleBranches) !==
                JSON.stringify(formattedBranches)
            ) {
                company.eligibleBranches = formattedBranches;
                isUpdated = true;
            }

            if (company.location !== formattedLocation) {
                company.location = formattedLocation;
                isUpdated = true;
            }

            if (isUpdated) {
                await company.save();
                updatedCount++;
            }
        }

        console.log(`${updatedCount} company(s) updated successfully.`);
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

formatExistingCompanies();