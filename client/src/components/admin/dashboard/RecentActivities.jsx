import "./RecentActivities.css";

function RecentActivities({ activities }) {

    return (

        <div className="card recent-activities">

            <h2>
                Recent Activities
            </h2>

            {activities.length === 0 ? (

                <p>
                    No recent activities.
                </p>

            ) : (

                activities.map((activity) => (

                    <div
                        key={activity._id}
                        className="activity-item"
                    >

                        <div className="activity-avatar">

                            {activity.student?.name
                                ?.charAt(0)
                                .toUpperCase()}

                        </div>

                        <div className="activity-details">

                            <strong>
                                {activity.student?.name}
                            </strong>

                            <p>
                                🏢 {activity.company?.companyName || "Company Deleted"}
                            </p>

                            <small>
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
                            </small>

                        </div>

                        <span
                            className={`badge ${
                                activity.status === "Selected"
                                    ? "badge-success"
                                    : activity.status === "Rejected"
                                    ? "badge-danger"
                                    : activity.status === "Interview"
                                    ? "badge-warning"
                                    : activity.status === "OA Cleared"
                                    ? "badge-info"
                                    : "badge-primary"
                            }`}
                        >
                            {activity.status}
                        </span>

                    </div>

                ))

            )}

        </div>

    );

}

export default RecentActivities;