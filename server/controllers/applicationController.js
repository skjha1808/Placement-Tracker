const Application = require("../models/Application");
const Student = require("../models/Student");

const {
    checkStudentEligibility,
} = require("../services/eligibilityService");


// =====================================================
// CREATE APPLICATION
// =====================================================

const createApplication = async (req, res) => {
    try {
        const { company, notes } = req.body;

        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found",
            });
        }

        const eligibility =
            await checkStudentEligibility(
                student,
                company
            );

        if (!eligibility.eligible) {
            return res.status(
                eligibility.status
            ).json({
                success: false,
                message: eligibility.reason,
            });
        }

        const application =
            await Application.create({
                student: student._id,
                company,
                notes,
            });

        res.status(201).json({
            success: true,
            message:
                "Application submitted successfully.",
            application,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// =====================================================
// GET MY APPLICATIONS
// =====================================================

const getMyApplications = async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user._id,
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message:
                    "Student profile not found",
            });
        }

        const applications =
            await Application.find({
                student: student._id,
            })
                .sort({ createdAt: -1 })
                .populate("company");

        res.status(200).json(
            applications
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// =====================================================
// GET ALL APPLICATIONS
// =====================================================

const getAllApplications = async (req, res) => {
    try {
        const applications =
            await Application.find()
                .sort({ createdAt: -1 })
                .populate("student")
                .populate("company");

        res.status(200).json(
            applications
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// =====================================================
// GET APPLICATION BY ID
// =====================================================

const getApplicationById = async (req, res) => {
    try {
        const application =
            await Application.findById(
                req.params.id
            )
                .populate("student")
                .populate("company");

        if (!application) {
            return res.status(404).json({
                success: false,
                message:
                    "Application not found",
            });
        }

        res.status(200).json(
            application
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// =====================================================
// UPDATE APPLICATION
// =====================================================

const updateApplication = async (req, res) => {
    try {
        const {
            status,
            interviewStage,
        } = req.body;

        const application =
            await Application.findById(
                req.params.id
            );

        if (!application) {
            return res.status(404).json({
                success: false,
                message:
                    "Application not found",
            });
        }


        // =================================================
        // BASIC STATUS VALIDATION
        // =================================================

        const validStatuses = [
            "Applied",
            "OA Cleared",
            "Interview",
            "Selected",
            "Rejected",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid application status.",
            });
        }

        const currentStatus =
            application.status;


        // =================================================
        // INTERVIEW STAGE
        // =================================================

        /*
         * IMPORTANT:
         *
         * Older Interview records may have
         * interviewStage = null.
         *
         * We treat such an Interview record as
         * Technical.
         *
         * This allows:
         *
         * null → HR
         *
         * to work correctly.
         *
         * It also prevents:
         *
         * HR → Technical
         */

        const currentInterviewStage =
            application.interviewStage ||
            "Technical";


        // =================================================
        // REJECTED APPLICATION
        // =================================================

        if (status === "Rejected") {

            /*
             * If rejection happens during an interview,
             * remember the exact interview stage.
             */

            if (currentStatus === "Interview") {
                application.rejectedAtStage =
                    currentInterviewStage ||
                    "Technical";
            } else {
                application.rejectedAtStage =
                    currentStatus;
            }

            application.status =
                "Rejected";

            /*
             * Rejected application is no longer
             * in an active interview stage.
             */

            application.interviewStage =
                null;

            await application.save();

            await application.populate(
                "student"
            );

            await application.populate(
                "company"
            );

            return res.status(200).json({
                success: true,
                message:
                    "Application rejected successfully.",
                application,
            });
        }


        // =================================================
        // MOVING OUT OF REJECTED
        // =================================================

        if (currentStatus === "Rejected") {
            application.rejectedAtStage =
                null;
        }


        // =================================================
        // INTERVIEW
        // =================================================

        if (status === "Interview") {

            /*
             * Interview stage must be either
             * Technical or HR.
             */

            if (
                !["Technical", "HR"].includes(
                    interviewStage
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Interview stage must be Technical or HR.",
                });
            }


            // =============================================
            // ENTERING INTERVIEW
            // =============================================

            if (currentStatus !== "Interview") {

                /*
                 * Every new interview must start
                 * with Technical.
                 */

                if (
                    interviewStage !==
                    "Technical"
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "An application must enter the Technical interview before the HR interview.",
                    });
                }

                application.interviewStage =
                    "Technical";
            }


            // =============================================
            // ALREADY IN INTERVIEW
            // =============================================

            else {

                /*
                 * Technical → Technical
                 */

                if (
                    currentInterviewStage ===
                        "Technical" &&
                    interviewStage ===
                        "Technical"
                ) {
                    application.interviewStage =
                        "Technical";
                }


                /*
                 * Technical → HR
                 *
                 * THIS IS THE IMPORTANT FIX
                 *
                 * If old database value was null,
                 * currentInterviewStage is treated
                 * as Technical above.
                 */

                else if (
                    currentInterviewStage ===
                        "Technical" &&
                    interviewStage ===
                        "HR"
                ) {
                    application.interviewStage =
                        "HR";
                }


                /*
                 * HR → HR
                 */

                else if (
                    currentInterviewStage ===
                        "HR" &&
                    interviewStage ===
                        "HR"
                ) {
                    application.interviewStage =
                        "HR";
                }


                /*
                 * HR → Technical
                 *
                 * Not allowed.
                 */

                else if (
                    currentInterviewStage ===
                        "HR" &&
                    interviewStage ===
                        "Technical"
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "The HR interview is already in progress. You cannot move the application back to Technical.",
                    });
                }
            }

            application.status =
                "Interview";

            application.rejectedAtStage =
                null;
        }


        // =================================================
        // SELECTED
        // =================================================

        else if (status === "Selected") {

            /*
             * Student can be Selected only after
             * Technical + HR.
             */

            if (
                currentStatus !==
                    "Interview" ||
                currentInterviewStage !==
                    "HR"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "The application must clear both Technical and HR interviews before being marked as Selected.",
                });
            }

            application.status =
                "Selected";

            /*
             * Selected is a final state.
             * Therefore there is no active
             * interview stage.
             */

            application.interviewStage =
                null;

            application.rejectedAtStage =
                null;
        }


        // =================================================
        // APPLIED / OA CLEARED
        // =================================================

        else if (
            status === "Applied" ||
            status === "OA Cleared"
        ) {

            application.status =
                status;

            /*
             * These statuses don't have
             * an interview stage.
             */

            application.interviewStage =
                null;

            application.rejectedAtStage =
                null;
        }


        // =================================================
        // SAVE APPLICATION
        // =================================================

        await application.save();

        await application.populate(
            "student"
        );

        await application.populate(
            "company"
        );

        res.status(200).json({
            success: true,
            message:
                "Application updated successfully.",
            application,
        });

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
// DELETE APPLICATION
// =====================================================

const deleteApplication = async (req, res) => {
    try {
        const deletedApplication =
            await Application.findByIdAndDelete(
                req.params.id
            );

        if (!deletedApplication) {
            return res.status(404).json({
                success: false,
                message:
                    "Application not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Application deleted successfully.",
            deletedApplication,
        });
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
// EXPORTS
// =====================================================

module.exports = {
    createApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
};