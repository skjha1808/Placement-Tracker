const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        package: {
            type: Number,
            required: [true, "Package is required"],
            min: 0,
        },

        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },

        jobType: {
            type: String,
            enum: [
                "Full-time",
                "Internship",
                "Internship + FTE"
            ],
            required: true,
        },

        eligibleBranches: {
            type: [String],
            required: true,
        },

        minimumCGPA: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },

        applicationDeadline: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open",
        },
    },
    {
        timestamps: true,
    }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;