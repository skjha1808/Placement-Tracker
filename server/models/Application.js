const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "OA Cleared",
                "Interview Scheduled",
                "Selected",
                "Rejected",
            ],
            default: "Applied",
        },

        appliedDate: {
            type: Date,
            default: Date.now,
        },

        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

module.exports = Application;