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

        resumeLink: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;