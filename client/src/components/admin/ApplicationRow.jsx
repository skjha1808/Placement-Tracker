import { useEffect, useState } from "react";
import "./ApplicationRow.css";
import api from "../../services/api";

function ApplicationRow({
    application,
    getStatusClass,
    fetchApplications,
    onDelete,
    onViewStudent,
}) {
    const [status, setStatus] = useState(
        application.status
    );

    const [interviewStage, setInterviewStage] =
        useState(
            application.interviewStage ||
            (
                application.status === "Interview"
                    ? "Technical"
                    : ""
            )
        );

    const [updating, setUpdating] =
        useState(false);


    /*
     * Keep local state synchronized with the
     * latest application received from the backend.
     *
     * This is important after:
     *
     * Technical → HR → Update
     *
     * because fetchApplications() refreshes the
     * application object without remounting this row.
     */
    useEffect(() => {
        setStatus(application.status);

        setInterviewStage(
            application.interviewStage ||
            (
                application.status === "Interview"
                    ? "Technical"
                    : ""
            )
        );
    }, [
        application._id,
        application.status,
        application.interviewStage,
    ]);


    /*
     * Compare the current local values with the
     * values received from the backend.
     */
    const originalInterviewStage =
        application.interviewStage ||
        (
            application.status === "Interview"
                ? "Technical"
                : ""
        );

    const hasChanges =
        status !== application.status ||
        interviewStage !== originalInterviewStage;


    /*
     * Handle status changes.
     */
    const handleStatusChange = (e) => {
        const nextStatus = e.target.value;

        setStatus(nextStatus);

        /*
         * Whenever an application enters Interview,
         * it must start from Technical.
         *
         * This prevents the UI from having an empty
         * interview stage.
         */
        if (nextStatus === "Interview") {
            if (
                !["Technical", "HR"].includes(
                    interviewStage
                )
            ) {
                setInterviewStage("Technical");
            }
        }
    };


    /*
     * Update application.
     */
    const handleUpdate = async () => {
        if (!hasChanges) {
            alert("No changes to update.");
            return;
        }

        try {
            setUpdating(true);

            await api.put(
                `/applications/${application._id}`,
                {
                    status,
                    interviewStage:
                        status === "Interview"
                            ? interviewStage
                            : undefined,
                }
            );

            alert(
                "Application updated successfully!"
            );

            /*
             * Fetch the latest application from
             * the backend.
             *
             * The useEffect above will then synchronize
             * the local status/interviewStage state
             * with the updated backend values.
             */
            await fetchApplications();

        } catch (error) {
            console.log(
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to update application."
            );

        } finally {
            setUpdating(false);
        }
    };


    return (
        <div className="admin-application-card">

            {/* =====================================
                APPLICATION HEADER
            ===================================== */}

            <div className="admin-application-header">

                <div className="admin-application-avatar">
                    {application.student?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "?"}
                </div>

                <div className="admin-application-student">

                    <button
                        type="button"
                        className="admin-application-student-name"
                        onClick={() =>
                            application.student &&
                            onViewStudent(
                                application.student
                            )
                        }
                    >
                        {application.student?.name ||
                            "Student Deleted"}
                    </button>

                    <div className="admin-application-email">
                        {application.student?.email ||
                            "Email unavailable"}
                    </div>

                    <div className="admin-application-company">
                        <span>
                            🏢
                        </span>

                        <span>
                            {application.company
                                ?.companyName ||
                                "Company Deleted"}
                        </span>
                    </div>

                </div>

                <div className="admin-application-status-area">

                    <span
                        className={getStatusClass(
                            status
                        )}
                    >
                        <span className="admin-application-status-dot" />

                        {status}
                    </span>

                </div>

            </div>


            {/* =====================================
                CONTROLS
            ===================================== */}

            <div className="admin-application-controls">

                {/* STATUS */}

                <div className="admin-application-control">

                    <label>
                        Current Status
                    </label>

                    <select
                        className="admin-application-select"
                        value={status}
                        disabled={updating}
                        onChange={
                            handleStatusChange
                        }
                    >
                        <option value="Applied">
                            Applied
                        </option>

                        <option value="OA Cleared">
                            OA Cleared
                        </option>

                        <option value="Interview">
                            Interview
                        </option>

                        <option value="Selected">
                            Selected
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>
                    </select>

                </div>


                {/* INTERVIEW STAGE */}

                <div className="admin-application-control">

                    <label>
                        Interview Stage
                    </label>

                    {status === "Interview" ? (

                        <select
                            className="admin-application-select"
                            value={
                                interviewStage ||
                                "Technical"
                            }
                            disabled={updating}
                            onChange={(e) =>
                                setInterviewStage(
                                    e.target.value
                                )
                            }
                        >
                            <option value="Technical">
                                Technical
                            </option>

                            <option value="HR">
                                HR
                            </option>

                        </select>

                    ) : (

                        <div className="admin-application-not-applicable">
                            Not applicable
                        </div>

                    )}

                </div>

            </div>


            {/* =====================================
                ACTIONS
            ===================================== */}

            <div className="admin-application-actions">

                <button
                    type="button"
                    className="admin-application-update"
                    disabled={
                        updating ||
                        !hasChanges
                    }
                    onClick={
                        handleUpdate
                    }
                >
                    {updating
                        ? "Updating..."
                        : "Update Application"}
                </button>

                <button
                    type="button"
                    className="admin-application-delete"
                    disabled={updating}
                    onClick={() =>
                        onDelete(
                            application._id
                        )
                    }
                >
                    Delete
                </button>

            </div>

        </div>
    );
}

export default ApplicationRow;