import "./ApplicationStats.css";

function ApplicationStats({

    applications,

}) {

    const total =
        applications.length;

    const oaCleared =
        applications.filter(
            app =>
                app.status ===
                "OA Cleared"
        ).length;

    const selected =
        applications.filter(
            app =>
                app.status ===
                "Selected"
        ).length;

    const rejected =
        applications.filter(
            app =>
                app.status ===
                "Rejected"
        ).length;

    const stats = [

        {
            icon: "📄",
            title: "Applications",
            value: total,
            color: "#2563eb",
        },

        {
            icon: "🟡",
            title: "OA Cleared",
            value: oaCleared,
            color: "#f59e0b",
        },

        {
            icon: "🟢",
            title: "Selected",
            value: selected,
            color: "#22c55e",
        },

        {
            icon: "🔴",
            title: "Rejected",
            value: rejected,
            color: "#ef4444",
        },

    ];

    return (

        <div className="admin-stats">

            {stats.map((stat) => (

                <div
                    key={stat.title}
                    className="card admin-stat-card"
                >

                    <div
                        className="admin-stat-icon"
                        style={{
                            background:
                                stat.color,
                        }}
                    >

                        {stat.icon}

                    </div>

                    <h2>

                        {stat.value}

                    </h2>

                    <p>

                        {stat.title}

                    </p>

                </div>

            ))}

        </div>

    );

}

export default ApplicationStats;