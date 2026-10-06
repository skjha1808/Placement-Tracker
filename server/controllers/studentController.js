const path = require("path");

const fs = require("fs");

const Student = require("../models/Student");
const ProfileUpdateRequest = require("../models/ProfileUpdateRequest");
const Notification = require("../models/Notification");

const {
    formatName,
    formatBranches,
} = require("../utils/formatters");


// =====================================================
// CREATE STUDENT PROFILE
// =====================================================

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

            // =========================
            // PERSONAL INFORMATION
            // =========================

            name: formatName(req.body.name),
            gender: req.body.gender || "",
            email: req.body.email,
            phone: req.body.phone,
            city: req.body.city || "",
            bio: req.body.bio || "",

            // =========================
            // ACADEMIC INFORMATION
            // =========================

            branch: req.body.branch
                ? formatBranches([req.body.branch])[0]
                : "",

            education: req.body.education || "",
            cgpa: req.body.cgpa,

            tenth: {
                schoolName: req.body.tenth?.schoolName || "",
                percentage: req.body.tenth?.percentage ?? null,
                board: req.body.tenth?.board || "",
                passingYear: req.body.tenth?.passingYear ?? null,
            },

            twelfth: {
                schoolName: req.body.twelfth?.schoolName || "",
                percentage: req.body.twelfth?.percentage ?? null,
                board: req.body.twelfth?.board || "",
                stream: req.body.twelfth?.stream || "",
                passingYear: req.body.twelfth?.passingYear ?? null,
            },

            graduation: {
                college: req.body.graduation?.college || "",
                degree: req.body.graduation?.degree || "",

                branch: req.body.graduation?.branch
                    ? formatBranches([
                          req.body.graduation.branch,
                      ])[0]
                    : "",

                cgpa:
                    req.body.graduation?.cgpa ??
                    req.body.cgpa ??
                    null,

                graduationYear:
                    req.body.graduation?.graduationYear ??
                    null,

                currentSemester:
                    req.body.graduation?.currentSemester ??
                    null,
            },

            // =========================
            // PROFESSIONAL / TECHNICAL
            // =========================

            skills: req.body.skills || [],

            programmingLanguages:
                req.body.programmingLanguages || [],

            frameworksLibraries:
                req.body.frameworksLibraries || [],

            databases:
                req.body.databases || [],

            cloudTools:
                req.body.cloudTools || [],

            // =========================
            // DEVELOPER PROFILES
            // =========================

            developerProfiles: {

                linkedin:
                    req.body.developerProfiles?.linkedin ||
                    "",

                github:
                    req.body.developerProfiles?.github ||
                    "",

                leetcode:
                    req.body.developerProfiles?.leetcode ||
                    "",

                portfolio:
                    req.body.developerProfiles?.portfolio ||
                    "",
            },

            // =========================
            // EXPERIENCE & ACHIEVEMENTS
            // =========================

            internships:
                req.body.internships || [],

            certifications:
                req.body.certifications || [],

            achievements:
                req.body.achievements || [],

            hackathons:
                req.body.hackathons || [],

            projects:
                req.body.projects || [],

            codingAchievements:
                req.body.codingAchievements || [],

            // =========================
            // USER
            // =========================

            user: req.user._id,
        });

        res.status(201).json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });

    }

};


// =====================================================
// GET MY PROFILE
// =====================================================

const getMyProfile = async (req, res) => {

    try {

        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {

            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });

        }

        res.status(200).json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }

};


// =====================================================
// UPDATE MY PROFILE
// =====================================================

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


        // =================================================
        // VERIFIED PROFILE FREEZE
        // =================================================

        if (student.isVerified) {

            const accessEnabled =
                student.profileEditAccess?.enabled === true;

            const expiresAt =
                student.profileEditAccess?.expiresAt
                    ? new Date(
                          student.profileEditAccess.expiresAt
                      )
                    : null;

            const accessActive =
                accessEnabled &&
                expiresAt &&
                expiresAt > new Date();

            if (!accessActive) {

                if (student.profileEditAccess?.enabled) {

                    student.profileEditAccess = {
                        enabled: false,
                        expiresAt: null,
                        approvedBy: null,
                    };

                    await student.save();

                }

                return res.status(403).json({

                    success: false,

                    code: "PROFILE_FROZEN",

                    message:
                        "Your profile is frozen. Please request temporary edit access from the placement cell.",
                });

            }

        }


        const updateData = {};


        // =================================================
        // PERSONAL INFORMATION
        // =================================================

        if (req.body.name !== undefined) {

            updateData.name =
                formatName(req.body.name);

        }

        if (req.body.gender !== undefined) {

            updateData.gender =
                req.body.gender;

        }

        if (req.body.email !== undefined) {

            updateData.email =
                req.body.email;

        }

        if (req.body.phone !== undefined) {

            updateData.phone =
                req.body.phone;

        }

        if (req.body.city !== undefined) {

            updateData.city =
                req.body.city;

        }

        if (req.body.bio !== undefined) {

            updateData.bio =
                req.body.bio;

        }


        // =================================================
        // EXISTING ACADEMIC FIELDS
        // =================================================

        if (req.body.branch !== undefined) {

            updateData.branch =
                formatBranches([
                    req.body.branch,
                ])[0];

        }

        if (req.body.education !== undefined) {

            updateData.education =
                req.body.education;

        }

        if (req.body.cgpa !== undefined) {

            updateData.cgpa =
                req.body.cgpa;

        }


        // =================================================
        // 10TH
        // =================================================

        if (req.body.tenth !== undefined) {

            updateData.tenth = {

                schoolName:
                    req.body.tenth.schoolName ??
                    "",

                percentage:
                    req.body.tenth.percentage ??
                    null,

                board:
                    req.body.tenth.board ??
                    "",

                passingYear:
                    req.body.tenth.passingYear ??
                    null,
            };

        }


        // =================================================
        // 12TH
        // =================================================

        if (req.body.twelfth !== undefined) {

            updateData.twelfth = {

                schoolName:
                    req.body.twelfth.schoolName ??
                    "",

                percentage:
                    req.body.twelfth.percentage ??
                    null,

                board:
                    req.body.twelfth.board ??
                    "",

                stream:
                    req.body.twelfth.stream ??
                    "",

                passingYear:
                    req.body.twelfth.passingYear ??
                    null,
            };

        }


        // =================================================
        // GRADUATION
        // =================================================

        if (req.body.graduation !== undefined) {

            updateData.graduation = {

                college:
                    req.body.graduation.college ??
                    "",

                degree:
                    req.body.graduation.degree ??
                    "",

                branch:
                    req.body.graduation.branch
                        ? formatBranches([
                              req.body.graduation.branch,
                          ])[0]
                        : "",

                cgpa:
                    req.body.graduation.cgpa ??
                    null,

                graduationYear:
                    req.body.graduation.graduationYear ??
                    null,

                currentSemester:
                    req.body.graduation.currentSemester ??
                    null,
            };

        }


        // =================================================
        // PROFESSIONAL / TECHNICAL
        // =================================================

        if (req.body.skills !== undefined) {

            updateData.skills =
                req.body.skills;

        }

        if (
            req.body.programmingLanguages !==
            undefined
        ) {

            updateData.programmingLanguages =
                req.body.programmingLanguages;

        }

        if (
            req.body.frameworksLibraries !==
            undefined
        ) {

            updateData.frameworksLibraries =
                req.body.frameworksLibraries;

        }

        if (req.body.databases !== undefined) {

            updateData.databases =
                req.body.databases;

        }

        if (req.body.cloudTools !== undefined) {

            updateData.cloudTools =
                req.body.cloudTools;

        }


        // =================================================
        // DEVELOPER PROFILES
        // =================================================

        if (
            req.body.developerProfiles !==
            undefined
        ) {

            updateData.developerProfiles = {

                linkedin:
                    req.body.developerProfiles.linkedin ??
                    "",

                github:
                    req.body.developerProfiles.github ??
                    "",

                leetcode:
                    req.body.developerProfiles.leetcode ??
                    "",

                portfolio:
                    req.body.developerProfiles.portfolio ??
                    "",
            };

        }


        // =================================================
        // EXPERIENCE & ACHIEVEMENTS
        // =================================================

        if (req.body.internships !== undefined) {

            updateData.internships =
                req.body.internships;

        }

        if (req.body.certifications !== undefined) {

            updateData.certifications =
                req.body.certifications;

        }

        if (req.body.achievements !== undefined) {

            updateData.achievements =
                req.body.achievements;

        }

        if (req.body.hackathons !== undefined) {

            updateData.hackathons =
                req.body.hackathons;

        }

        if (req.body.projects !== undefined) {

            updateData.projects =
                req.body.projects;

        }

        if (
            req.body.codingAchievements !==
            undefined
        ) {

            updateData.codingAchievements =
                req.body.codingAchievements;

        }


        // =================================================
        // UPDATE
        // =================================================

        const updatedStudent =
            await Student.findOneAndUpdate(

                {
                    user: req.user._id,
                },

                updateData,

                {
                    new: true,
                    runValidators: true,
                }

            );


        res.status(200).json(
            updatedStudent
        );


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });

    }

};


// =====================================================
// UPLOAD RESUME
// =====================================================

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


        // =================================================
        // VERIFIED PROFILE FREEZE
        // =================================================

        if (student.isVerified) {

            const accessEnabled =
                student.profileEditAccess?.enabled === true;

            const expiresAt =
                student.profileEditAccess?.expiresAt
                    ? new Date(
                          student.profileEditAccess.expiresAt
                      )
                    : null;

            const accessActive =
                accessEnabled &&
                expiresAt &&
                expiresAt > new Date();

            if (!accessActive) {

                if (student.profileEditAccess?.enabled) {

                    student.profileEditAccess = {
                        enabled: false,
                        expiresAt: null,
                        approvedBy: null,
                    };

                    await student.save();

                }

                return res.status(403).json({

                    success: false,

                    code: "PROFILE_FROZEN",

                    message:
                        "Your profile is frozen. Please request temporary edit access from the placement cell.",
                });

            }

        }


        student.resume = {

            fileName:
                req.file.originalname,

            filePath:
                `/uploads/resumes/${req.file.filename}`,

        };


        await student.save();


        res.status(200).json({

            message:
                "Resume uploaded successfully",

            resume:
                student.resume,

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });

    }

};


// =====================================================
// GET MY RESUME
// =====================================================

const getMyResume = async (req, res) => {

    try {

        const student = await Student.findOne({
            user: req.user._id,
        });

        if (
            !student ||
            !student.resume?.filePath
        ) {

            return res.status(404).json({

                success: false,

                message: "Resume not found",

            });

        }

        const fileName =
            path.basename(
                student.resume.filePath
            );

        const filePath =
            path.join(
                __dirname,
                "..",
                "uploads",
                "resumes",
                fileName
            );

        if (!fs.existsSync(filePath)) {

            return res.status(404).json({

                success: false,

                message:
                    "Resume file not found",

            });

        }

        res.sendFile(filePath);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// GET STUDENT RESUME - ADMIN
// =====================================================

const getStudentResume = async (req, res) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            );

        if (
            !student ||
            !student.resume?.filePath
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Resume not found",

            });

        }

        const fileName =
            path.basename(
                student.resume.filePath
            );

        const filePath =
            path.join(
                __dirname,
                "..",
                "uploads",
                "resumes",
                fileName
            );

        if (!fs.existsSync(filePath)) {

            return res.status(404).json({

                success: false,

                message:
                    "Resume file not found",

            });

        }

        res.sendFile(filePath);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// VERIFY STUDENT
// =====================================================

const verifyStudent = async (req, res) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            );

        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found",

            });

        }

        if (student.isVerified) {

            return res.status(400).json({

                message:
                    "Student is already verified",

            });

        }


        student.isVerified = true;

        student.profileEditAccess = {

            enabled: false,

            expiresAt: null,

            approvedBy: null,

        };


        await student.save();


        await Notification.create({

            user: student.user,

            title:
                "Profile Verified",

            message:
                "Your profile has been verified by the placement cell.",

            type:
                "success",

        });


        res.status(200).json({

            message:
                "Student verified successfully",

            student,

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// GET ALL STUDENTS - ADMIN
// =====================================================

const getAllStudents = async (req, res) => {

    try {

        const students =
            await Student.find()
                .populate(
                    "user",
                    "name email role"
                );

        res.status(200).json(
            students
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// GET STUDENT BY ID - ADMIN
// =====================================================

const getStudentById = async (req, res) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            ).populate(
                "user",
                "name email role"
            );

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found",

            });

        }

        res.status(200).json(
            student
        );


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// UPDATE STUDENT - ADMIN
// =====================================================

const updateStudent = async (req, res) => {

    try {

        const allowedUpdates = {};


        // =========================
        // PERSONAL INFORMATION
        // =========================

        if (req.body.name !== undefined) {

            allowedUpdates.name =
                formatName(
                    req.body.name
                );

        }

        if (req.body.gender !== undefined) {

            allowedUpdates.gender =
                req.body.gender;

        }

        if (req.body.email !== undefined) {

            allowedUpdates.email =
                req.body.email;

        }

        if (req.body.phone !== undefined) {

            allowedUpdates.phone =
                req.body.phone;

        }

        if (req.body.city !== undefined) {

            allowedUpdates.city =
                req.body.city;

        }

        if (req.body.bio !== undefined) {

            allowedUpdates.bio =
                req.body.bio;

        }


        // =========================
        // EXISTING ACADEMIC FIELDS
        // =========================

        if (req.body.branch !== undefined) {

            allowedUpdates.branch =
                formatBranches([
                    req.body.branch,
                ])[0];

        }

        if (req.body.education !== undefined) {

            allowedUpdates.education =
                req.body.education;

        }

        if (req.body.cgpa !== undefined) {

            allowedUpdates.cgpa =
                req.body.cgpa;

        }


        // =========================
        // 10TH
        // =========================

        if (req.body.tenth !== undefined) {

            allowedUpdates.tenth = {

                schoolName:
                    req.body.tenth.schoolName ??
                    "",

                percentage:
                    req.body.tenth.percentage ??
                    null,

                board:
                    req.body.tenth.board ??
                    "",

                passingYear:
                    req.body.tenth.passingYear ??
                    null,

            };

        }


        // =========================
        // 12TH
        // =========================

        if (req.body.twelfth !== undefined) {

            allowedUpdates.twelfth = {

                schoolName:
                    req.body.twelfth.schoolName ??
                    "",

                percentage:
                    req.body.twelfth.percentage ??
                    null,

                board:
                    req.body.twelfth.board ??
                    "",

                stream:
                    req.body.twelfth.stream ??
                    "",

                passingYear:
                    req.body.twelfth.passingYear ??
                    null,

            };

        }


        // =========================
        // GRADUATION
        // =========================

        if (req.body.graduation !== undefined) {

            allowedUpdates.graduation = {

                college:
                    req.body.graduation.college ??
                    "",

                degree:
                    req.body.graduation.degree ??
                    "",

                branch:
                    req.body.graduation.branch

                        ? formatBranches([
                              req.body.graduation.branch,
                          ])[0]

                        : "",

                cgpa:
                    req.body.graduation.cgpa ??
                    null,

                graduationYear:
                    req.body.graduation.graduationYear ??
                    null,

                currentSemester:
                    req.body.graduation.currentSemester ??
                    null,

            };

        }


        // =========================
        // PROFESSIONAL / TECHNICAL
        // =========================

        if (req.body.skills !== undefined) {

            allowedUpdates.skills =
                req.body.skills;

        }

        if (
            req.body.programmingLanguages !==
            undefined
        ) {

            allowedUpdates.programmingLanguages =
                req.body.programmingLanguages;

        }

        if (
            req.body.frameworksLibraries !==
            undefined
        ) {

            allowedUpdates.frameworksLibraries =
                req.body.frameworksLibraries;

        }

        if (req.body.databases !== undefined) {

            allowedUpdates.databases =
                req.body.databases;

        }

        if (req.body.cloudTools !== undefined) {

            allowedUpdates.cloudTools =
                req.body.cloudTools;

        }


        // =========================
        // DEVELOPER PROFILES
        // =========================

        if (
            req.body.developerProfiles !==
            undefined
        ) {

            allowedUpdates.developerProfiles = {

                linkedin:
                    req.body.developerProfiles.linkedin ??
                    "",

                github:
                    req.body.developerProfiles.github ??
                    "",

                leetcode:
                    req.body.developerProfiles.leetcode ??
                    "",

                portfolio:
                    req.body.developerProfiles.portfolio ??
                    "",

            };

        }


        // =========================
        // EXPERIENCE & ACHIEVEMENTS
        // =========================

        if (req.body.internships !== undefined) {

            allowedUpdates.internships =
                req.body.internships;

        }

        if (req.body.certifications !== undefined) {

            allowedUpdates.certifications =
                req.body.certifications;

        }

        if (req.body.achievements !== undefined) {

            allowedUpdates.achievements =
                req.body.achievements;

        }

        if (req.body.hackathons !== undefined) {

            allowedUpdates.hackathons =
                req.body.hackathons;

        }

        if (req.body.projects !== undefined) {

            allowedUpdates.projects =
                req.body.projects;

        }

        if (
            req.body.codingAchievements !==
            undefined
        ) {

            allowedUpdates.codingAchievements =
                req.body.codingAchievements;

        }


        // =========================
        // VERIFICATION
        // =========================

        if (req.body.isVerified !== undefined) {

            allowedUpdates.isVerified =
                req.body.isVerified;

        }


        // =========================
        // UPDATE
        // =========================

        const updatedStudent =
            await Student.findByIdAndUpdate(

                req.params.id,

                allowedUpdates,

                {
                    new: true,
                    runValidators: true,
                }

            );


        if (!updatedStudent) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found",

            });

        }


        res.status(200).json(
            updatedStudent
        );


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// DELETE STUDENT - ADMIN
// =====================================================

const deleteStudent = async (req, res) => {

    try {

        const deletedStudent =
            await Student.findByIdAndDelete(
                req.params.id
            );

        res.status(200).json({

            message:
                "Student deleted successfully",

            deletedStudent,

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// CREATE PROFILE UPDATE REQUEST
// =====================================================

const createProfileUpdateRequest = async (
    req,
    res
) => {

    try {

        const student =
            await Student.findOne({
                user: req.user._id,
            });

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student profile not found",

            });

        }

        if (!student.isVerified) {

            return res.status(400).json({

                success: false,

                message:
                    "Profile update request is only available after verification",

            });

        }

        const now = new Date();

        const accessActive =
            student.profileEditAccess?.enabled ===
                true &&
            student.profileEditAccess?.expiresAt &&
            new Date(
                student.profileEditAccess.expiresAt
            ) > now;

        if (accessActive) {

            return res.status(400).json({

                success: false,

                message:
                    "Temporary profile edit access is already active",

            });

        }

        const reason =
            String(
                req.body.reason || ""
            ).trim();

        if (!reason) {

            return res.status(400).json({

                success: false,

                message:
                    "Reason is required",

            });

        }

        const existingRequest =
            await ProfileUpdateRequest.findOne({

                student:
                    student._id,

                status:
                    "Pending",

            });

        if (existingRequest) {

            return res.status(400).json({

                success: false,

                message:
                    "You already have a pending profile update request",

            });

        }

        const request =
            await ProfileUpdateRequest.create({

                student:
                    student._id,

                reason,

            });

        return res.status(201).json({

            success: true,

            message:
                "Profile update request submitted successfully",

            request,

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// GET MY PROFILE UPDATE REQUESTS
// =====================================================

const getMyProfileUpdateRequests = async (
    req,
    res
) => {

    try {

        const student =
            await Student.findOne({
                user: req.user._id,
            });

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student profile not found",

            });

        }

        const requests =
            await ProfileUpdateRequest.find({

                student:
                    student._id,

            })
                .populate(
                    "reviewedBy",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({

            success: true,

            requests,

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// GET ALL PROFILE UPDATE REQUESTS - ADMIN
// =====================================================

const getAllProfileUpdateRequests = async (
    req,
    res
) => {

    try {

        const requests =
            await ProfileUpdateRequest.find()

                .populate({

                    path:
                        "student",

                    select:
                        "name email branch isVerified profileEditAccess",

                })

                .populate(
                    "reviewedBy",
                    "name email"
                )

                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            requests,

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// APPROVE PROFILE UPDATE REQUEST - ADMIN
// =====================================================

const approveProfileUpdateRequest = async (
    req,
    res
) => {

    try {

        const request =
            await ProfileUpdateRequest.findById(
                req.params.id
            );

        if (!request) {

            return res.status(404).json({

                success: false,

                message:
                    "Profile update request not found",

            });

        }

        if (request.status !== "Pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending requests can be approved",

            });

        }

        const student =
            await Student.findById(
                request.student
            );

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student profile not found",

            });

        }

        if (!student.isVerified) {

            return res.status(400).json({

                success: false,

                message:
                    "Student profile is not verified",

            });

        }

        const durationMinutes =
            Number(
                req.body.durationMinutes ??
                30
            );

        if (
            !Number.isFinite(
                durationMinutes
            ) ||
            durationMinutes < 5 ||
            durationMinutes > 120
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Duration must be between 5 and 120 minutes",

            });

        }

        const expiresAt =
            new Date(
                Date.now() +
                durationMinutes *
                60 *
                1000
            );


        request.status =
            "Approved";

        request.reviewedBy =
            req.user._id;

        request.reviewedAt =
            new Date();

        request.expiresAt =
            expiresAt;


        await request.save();


        student.profileEditAccess = {

            enabled: true,

            expiresAt,

            approvedBy:
                req.user._id,

        };


        await student.save();


        await Notification.create({

            user:
                student.user,

            title:
                "Profile Edit Access Approved",

            message:
                `Your profile edit request has been approved. You can edit your profile for ${durationMinutes} minutes.`,

            type:
                "success",

        });


        return res.status(200).json({

            success: true,

            message:
                "Profile edit access approved",

            expiresAt,

            durationMinutes,

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// REJECT PROFILE UPDATE REQUEST - ADMIN
// =====================================================

const rejectProfileUpdateRequest = async (
    req,
    res
) => {

    try {

        const request =
            await ProfileUpdateRequest.findById(
                req.params.id
            );

        if (!request) {

            return res.status(404).json({

                success: false,

                message:
                    "Profile update request not found",

            });

        }

        if (request.status !== "Pending") {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending requests can be rejected",

            });

        }

        const rejectionReason =
            String(
                req.body.rejectionReason ||
                ""
            ).trim();

        if (!rejectionReason) {

            return res.status(400).json({

                success: false,

                message:
                    "Rejection reason is required",

            });

        }

        request.status =
            "Rejected";

        request.reviewedBy =
            req.user._id;

        request.reviewedAt =
            new Date();

        request.rejectionReason =
            rejectionReason;


        await request.save();


        const student =
            await Student.findById(
                request.student
            );

        if (student) {

            await Notification.create({

                user:
                    student.user,

                title:
                    "Profile Update Request Rejected",

                message:
                    `Your profile update request was rejected. Reason: ${rejectionReason}`,

                type:
                    "error",

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Profile update request rejected",

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// REVOKE PROFILE EDIT ACCESS - ADMIN
// =====================================================

const revokeProfileEditAccess = async (
    req,
    res
) => {

    try {

        const student =
            await Student.findById(
                req.params.id
            );

        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student profile not found",

            });

        }

        student.profileEditAccess = {

            enabled:
                false,

            expiresAt:
                null,

            approvedBy:
                null,

        };


        await student.save();


        return res.status(200).json({

            success:
                true,

            message:
                "Profile edit access revoked",

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success:
                false,

            message:
                "Internal server error",

        });

    }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    createStudent,

    getMyProfile,

    updateMyProfile,

    uploadResume,

    getMyResume,

    getStudentResume,

    verifyStudent,

    getAllStudents,

    getStudentById,

    updateStudent,

    deleteStudent,

    createProfileUpdateRequest,

    getMyProfileUpdateRequests,

    getAllProfileUpdateRequests,

    approveProfileUpdateRequest,

    rejectProfileUpdateRequest,

    revokeProfileEditAccess,

};