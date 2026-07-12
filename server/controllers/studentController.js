const Student = require("../models/Student");
const Notification = require("../models/Notification");

const createStudent = async (req, res) => {
    try {
        const existingStudent = await Student.findOne({
            user: req.user._id,
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Student profile already exists",
            });
        }

        const student = await Student.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json(student);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user._id,
        });

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        if (student.isVerified) {
            const lockedFields = [
                "name",
                "branch",
                "education",
                "cgpa",
            ];

            const attemptedLockedFieldUpdate =
                lockedFields.some(
                    field => field in req.body
                );

            if (attemptedLockedFieldUpdate) {
                return res.status(403).json({
                    message:
                        "Academic details cannot be updated after verification",
                });
            }
        }

        const updatedStudent =
            await Student.findOneAndUpdate(
                {
                    user: req.user._id,
                },
                req.body,
                {
                    new: true,
                }
            );

        res.status(200).json(updatedStudent);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const uploadResume = async (req, res) => {

    try {

        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {

            return res.status(404).json({
                message: "Student profile not found",
            });

        }

        if (!req.file) {

            return res.status(400).json({
                message: "Please upload a PDF resume",
            });

        }

        student.resume = {

            fileName: req.file.originalname,

            filePath: `/uploads/resumes/${req.file.filename}`,

        };

        await student.save();

        res.status(200).json({

            message: "Resume uploaded successfully",

            resume: student.resume,

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};

const verifyStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                isVerified: true,
            },
            {
                new: true,
            }
        );

        const Notification = require("../models/Notification");

            await Notification.create({

                user: student.user,

                title: "Profile Verified",

                message:
                    "Your profile has been verified by the placement cell.",

                type: "success",

        });

        res.status(200).json({
            message: "Student verified successfully",
            student,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("user", "name email role");

        res.status(200).json(students);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("user", "name email role");

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedStudent);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Student deleted successfully",
            deletedStudent,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createStudent,
    getMyProfile,
    updateMyProfile,
    uploadResume,
    verifyStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};