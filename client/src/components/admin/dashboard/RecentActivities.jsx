import "./RecentActivities.css";

function RecentActivities({ activities = [] }) {
    const getStatusClass = (status) => {
        switch (status) {
            case "Selected":
                return "badge-success";

            case "Rejected":
                return "badge-danger";

            case "Interview":
                return "badge-warning";

            case "OA Cleared":
                return "badge-info";

            case "Applied":
            default:
                return "badge-primary";
        }
    };

    const getInterviewStage = (activity) => {
        if (
            activity.status !== "Interview" ||
            !activity.interviewStage
        ) {
            return null;
        }

        return activity.interviewStage;
    };

    return (
        <div className="card recent-activities">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="recent-activities-header">

                <div>
                    <h2>
                        Recent Activities
                    </h2>

                    <p>
                        Latest placement application updates
                    </p>
                </div>

                <span className="recent-activities-count">
                    {activities.length}
                </span>

            </div>


            {/* =====================================
                ACTIVITY LIST
            ===================================== */}

            {activities.length === 0 ? (

                <div className="recent-activities-empty">

                    <div className="recent-activities-empty-icon">
                        ✓
                    </div>

                    <p>
                        No recent activities.
                    </p>

                </div>

            ) : (

                <div className="activity-list">

                    {activities.map((activity) => {

                        const interviewStage =
                            getInterviewStage(activity);

                        return (
                            <div
                                key={activity._id}
                                className="activity-item"
                            >

                                {/* AVATAR */}

                                <div className="activity-avatar">
                                    {activity.student?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "?"}
                                </div>


                                {/* DETAILS */}

                                <div className="activity-details">

                                    <strong>
                                        {activity.student?.name ||
                                            "Student Deleted"}
                                    </strong>

                                    <p className="activity-company">
                                        🏢{" "}
                                        {activity.company
                                            ?.companyName ||
                                            "Company Deleted"}
                                    </p>

                                    <div className="activity-meta">

                                        <span>
                                            📅{" "}
                                            {new Date(
                                                activity.appliedDate
                                            ).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>

                                        {interviewStage && (
                                            <>
                                                <span className="activity-meta-dot">
                                                    •
                                                </span>

                                                <span className="activity-interview-stage">
                                                    {interviewStage} Interview
                                                </span>
                                            </>
                                        )}

                                    </div>

                                </div>


                                {/* STATUS */}

                                <span
                                    className={`badge ${getStatusClass(
                                        activity.status
                                    )}`}
                                >

                                    <span className="badge-dot" />

                                    {activity.status}

                                </span>

                            </div>
                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default RecentActivities;