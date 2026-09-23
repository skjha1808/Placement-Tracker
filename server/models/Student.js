const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
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
            required: [true, "CGPA is required"],
            min: [0, "CGPA cannot be less than 0"],
            max: [10, "CGPA cannot exceed 10"],
        },

        skills: [
            {
                type: String,
            },
        ],

        resume: {
            type: {
                fileName: {
                    type: String,
                    default: "",
                },
                filePath: {
                    type: String,
                    default: "",
                },
            },
            default: {},
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