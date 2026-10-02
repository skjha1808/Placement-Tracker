import "./DashboardComponents.css";

function ProfileProgress({ profile }) {

    const profileItems = [
        {
            label: "Phone",
            completed: !!profile?.phone,
        },
        {
            label: "Branch",
            completed: !!profile?.branch,
        },
        {
            label: "Education",
            completed: !!profile?.education,
        },
        {
            label: "CGPA",
            completed: !!profile?.cgpa,
        },
        {
            label: "Skills",
            completed:
                profile?.skills?.length > 0,
        },
        {
            label: "Resume",
            completed:
                !!profile?.resume?.fileName,
        },
    ];

    const completedFields =
        profileItems.filter(
            item => item.completed
        ).length;

    const percentage =
        profile
            ? Math.round(
                  (completedFields /
                      profileItems.length) *
                      100
              )
            : 0;

    return (

        <div className="card profile-progress-card">

            <h2>
                👤 Profile Completion
            </h2>

            <div className="profile-progress-track">

                <div
                    className="profile-progress-fill"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

            <h3>
                {percentage}% Completed
            </h3>

            <div className="profile-checklist">

                {profileItems.map(item => (

                    <div
                        key={item.label}
                        className="check-item"
                    >

                        <span>

                            {item.completed
                                ? "✅"
                                : "⭕"}

                        </span>

                        <span>

                            {item.label}

                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default ProfileProgress;