const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            required: true,
        },

        package: {
            type: Number,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        jobType: {
            type: String,
            required: true,
        },

        eligibleBranches: [
            {
                type: String,
            },
        ],

        minimumCGPA: {
            type: Number,
            required: true,
        },

        applicationDeadline: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            default: "Open",
        },
    },
    {
        timestamps: true,
    }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;