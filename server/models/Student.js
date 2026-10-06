const mongoose = require("mongoose");



const studentSchema = new mongoose.Schema(

    {

        // =========================
        // PERSONAL INFORMATION
        // =========================



        name: {

            type: String,

            required: true,

            trim: true,

        },



        gender: {

            type: String,

            enum: ["Male", "Female", "Other", "Prefer not to say"],

            default: "",

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



        city: {

            type: String,

            trim: true,

            default: "",

        },



        bio: {

            type: String,

            trim: true,

            maxlength: [

                500,

                "Bio cannot exceed 500 characters",

            ],

            default: "",

        },



        // =========================
        // ACADEMIC INFORMATION
        // =========================



        tenth: {

            schoolName: {

                type: String,

                trim: true,

                default: "",

            },



            percentage: {

                type: Number,

                min: [0, "10th percentage cannot be less than 0"],

                max: [100, "10th percentage cannot exceed 100"],

                default: null,

            },



            board: {

                type: String,

                trim: true,

                default: "",

            },



            passingYear: {

                type: Number,

                min: [1900, "Invalid 10th passing year"],

                max: [2100, "Invalid 10th passing year"],

                default: null,

            },

        },



        twelfth: {

            schoolName: {

                type: String,

                trim: true,

                default: "",

            },



            percentage: {

                type: Number,

                min: [0, "12th percentage cannot be less than 0"],

                max: [100, "12th percentage cannot exceed 100"],

                default: null,

            },



            board: {

                type: String,

                trim: true,

                default: "",

            },



            stream: {

                type: String,

                trim: true,

                default: "",

            },



            passingYear: {

                type: Number,

                min: [1900, "Invalid 12th passing year"],

                max: [2100, "Invalid 12th passing year"],

                default: null,

            },

        },



        graduation: {

            college: {

                type: String,

                trim: true,

                default: "",

            },



            degree: {

                type: String,

                trim: true,

                default: "",

            },



            branch: {

                type: String,

                trim: true,

                default: "",

            },



            cgpa: {

                type: Number,

                min: [0, "CGPA cannot be less than 0"],

                max: [10, "CGPA cannot exceed 10"],

                default: null,

            },



            graduationYear: {

                type: Number,

                min: [1900, "Invalid graduation year"],

                max: [2100, "Invalid graduation year"],

                default: null,

            },



            currentSemester: {

                type: Number,

                min: [1, "Semester cannot be less than 1"],

                max: [20, "Invalid semester"],

                default: null,

            },

        },



        // =========================
        // PROFESSIONAL / TECHNICAL
        // =========================



        skills: [

            {

                type: String,

                trim: true,

            },

        ],



        programmingLanguages: [

            {

                type: String,

                trim: true,

            },

        ],



        frameworksLibraries: [

            {

                type: String,

                trim: true,

            },

        ],



        databases: [

            {

                type: String,

                trim: true,

            },

        ],



        cloudTools: [

            {

                type: String,

                trim: true,

            },

        ],



        // =========================
        // DEVELOPER PROFILES
        // =========================



        developerProfiles: {

            linkedin: {

                type: String,

                trim: true,

                default: "",

            },



            github: {

                type: String,

                trim: true,

                default: "",

            },



            leetcode: {

                type: String,

                trim: true,

                default: "",

            },



            portfolio: {

                type: String,

                trim: true,

                default: "",

            },

        },



        // =========================
        // EXPERIENCE & ACHIEVEMENTS
        // =========================



        internships: [

            {

                company: {

                    type: String,

                    trim: true,

                    default: "",

                },



                role: {

                    type: String,

                    trim: true,

                    default: "",

                },



                duration: {

                    type: String,

                    trim: true,

                    default: "",

                },



                description: {

                    type: String,

                    trim: true,

                    maxlength: 1000,

                    default: "",

                },

            },

        ],



        certifications: [

            {

                name: {

                    type: String,

                    trim: true,

                    default: "",

                },



                issuer: {

                    type: String,

                    trim: true,

                    default: "",

                },



                year: {

                    type: Number,

                    default: null,

                },



                credentialUrl: {

                    type: String,

                    trim: true,

                    default: "",

                },

            },

        ],



        achievements: [

            {

                title: {

                    type: String,

                    trim: true,

                    default: "",

                },



                description: {

                    type: String,

                    trim: true,

                    maxlength: 1000,

                    default: "",

                },



                year: {

                    type: Number,

                    default: null,

                },

            },

        ],



        hackathons: [

            {

                name: {

                    type: String,

                    trim: true,

                    default: "",

                },



                position: {

                    type: String,

                    trim: true,

                    default: "",

                },



                description: {

                    type: String,

                    trim: true,

                    maxlength: 1000,

                    default: "",

                },



                year: {

                    type: Number,

                    default: null,

                },

            },

        ],



        projects: [

            {

                name: {

                    type: String,

                    trim: true,

                    default: "",

                },



                description: {

                    type: String,

                    trim: true,

                    maxlength: 1500,

                    default: "",

                },



                technologies: [

                    {

                        type: String,

                        trim: true,

                    },

                ],



                projectUrl: {

                    type: String,

                    trim: true,

                    default: "",

                },



                githubUrl: {

                    type: String,

                    trim: true,

                    default: "",

                },

            },

        ],



        codingAchievements: [

            {

                platform: {

                    type: String,

                    trim: true,

                    default: "",

                },



                achievement: {

                    type: String,

                    trim: true,

                    default: "",

                },



                count: {

                    type: Number,

                    default: null,

                },



                profileUrl: {

                    type: String,

                    trim: true,

                    default: "",

                },

            },

        ],



        // =========================
        // RESUME
        // =========================



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



        // =========================
        // USER / VERIFICATION
        // =========================



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



        // =========================
        // PROFILE EDIT ACCESS
        // =========================

        profileEditAccess: {

            enabled: {

                type: Boolean,

                default: false,

            },



            expiresAt: {

                type: Date,

                default: null,

            },



            approvedBy: {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User",

                default: null,

            },

        },

    },



    {

        timestamps: true,

    }

);

const Student = mongoose.model(

    "Student",

    studentSchema

);



module.exports = Student;