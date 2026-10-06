import "./ApplicationStats.css";

function ApplicationStats({
    applications,
}) {
    const total =
        applications.length;

    const oaCleared =
        applications.filter(
            (app) =>
                app.status ===
                "OA Cleared"
        ).length;

    const selected =
        applications.filter(
            (app) =>
                app.status ===
                "Selected"
        ).length;

    const rejected =
        applications.filter(
            (app) =>
                app.status ===
                "Rejected"
        ).length;

    // ============================================
    // INTERVIEW STAGE COUNTS
    // ============================================

    const technicalInterviews =
        applications.filter(
            (app) =>
                app.status === "Interview" &&
                app.interviewStage === "Technical"
        ).length;

    const hrInterviews =
        applications.filter(
            (app) =>
                app.status === "Interview" &&
                app.interviewStage === "HR"
        ).length;

    const stats = [
        {
            title: "Applications",
            value: total,
            className: "total",
        },

        {
            title: "OA Cleared",
            value: oaCleared,
            className: "oa-cleared",
        },

        {
            title: "Selected",
            value: selected,
            className: "selected",
        },

        {
            title: "Rejected",
            value: rejected,
            className: "rejected",
        },

        {
            title: "Technical Interviews",
            value: technicalInterviews,
            className: "technical",
        },

        {
            title: "HR Interviews",
            value: hrInterviews,
            className: "hr",
        },
    ];

    return (
        <div className="admin-stats">

            {stats.map((stat) => (
                <div
                    key={stat.title}
                    className={`admin-stat-card ${stat.className}`}
                >

                    <div className="admin-stat-label">
                        {stat.title}
                    </div>

                    <div className="admin-stat-value">
                        {stat.value}
                    </div>

                </div>
            ))}

        </div>
    );
}

export default ApplicationStats;