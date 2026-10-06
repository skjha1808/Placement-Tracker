const mongoose = require("mongoose");

const profileUpdateRequestSchema = new mongoose.Schema(

    {

        // =========================
        // STUDENT
        // =========================

        student: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Student",

            required: true,

        },



        // =========================
        // REQUEST DETAILS
        // =========================

        reason: {

            type: String,

            required: [true, "Reason is required"],

            trim: true,

            maxlength: [

                500,

                "Reason cannot exceed 500 characters",

            ],

        },



        // =========================
        // REQUEST STATUS
        // =========================

        status: {

            type: String,

            enum: [

                "Pending",

                "Approved",

                "Rejected",

            ],

            default: "Pending",

        },



        // =========================
        // ADMIN REVIEW
        // =========================

        reviewedBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null,

        },



        reviewedAt: {

            type: Date,

            default: null,

        },



        // =========================
        // TEMPORARY EDIT ACCESS
        // =========================

        expiresAt: {

            type: Date,

            default: null,

        },



        // =========================
        // REJECTION DETAILS
        // =========================

        rejectionReason: {

            type: String,

            trim: true,

            maxlength: [

                500,

                "Rejection reason cannot exceed 500 characters",

            ],

            default: "",

        },

    },



    {

        timestamps: true,

    }

);



// =========================
// INDEXES
// =========================

// Quickly find requests belonging to a student.

profileUpdateRequestSchema.index({

    student: 1,

    createdAt: -1,

});



// Quickly find pending requests for the admin panel.

profileUpdateRequestSchema.index({

    status: 1,

    createdAt: -1,

});



const ProfileUpdateRequest = mongoose.model(

    "ProfileUpdateRequest",

    profileUpdateRequestSchema

);

module.exports = ProfileUpdateRequest;