const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        phone: {
            type: String,
            required: true,
        },

        branch: {
            type: String,
            required: true,
        },

        education: {
            type: String,
            required: true,
        },

        cgpa: {
            type: Number,
            required: true,
        },

        skills: [
            {
                type: String,
            },
        ],

        resume: {
            fileName: {
                type: String,
                default: "",
            },

            filePath: {
                type: String,
                default: "",
            },
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;