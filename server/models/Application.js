const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: [true, "Student is required"],
        },

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: [true, "Company is required"],
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "OA Cleared",
                "Interview",
                "Selected",
                "Rejected",
            ],
            default: "Applied",
            required: true,
        },

        appliedDate: {
            type: Date,
            default: Date.now,
        },

        notes: {
            type: String,
            trim: true,
            maxlength: [
                500,
                "Notes cannot exceed 500 characters",
            ],
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate applications
applicationSchema.index(
    { student: 1, company: 1 },
    { unique: true }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

module.exports = Application;