import "./ScoreBreakdown.css";

function ScoreBreakdown({ analysis }) {

    const breakdown = analysis.scoreBreakdown;

    const scoreItems = [
        {
            label: "Technical Skills",
            value: breakdown.technicalSkills,
            max: 20,
        },
        {
            label: "Projects",
            value: breakdown.projects,
            max: 20,
        },
        {
            label: "Education",
            value: breakdown.education,
            max: 15,
        },
        {
            label: "Experience",
            value: breakdown.experience,
            max: 20,
        },
        {
            label: "ATS Optimization",
            value: breakdown.atsOptimization,
            max: 15,
        },
        {
            label: "Resume Formatting",
            value: breakdown.resumeFormatting,
            max: 10,
        },
    ];

    return (
        <div className="score-breakdown-card">

            <h3>Score Breakdown</h3>

            {scoreItems.map((item) => {

                const percentage = (item.value / item.max) * 100;

                return (
                    <div
                        className="score-item"
                        key={item.label}
                    >

                        <div className="score-item-header">

                            <span>
                                {item.label}
                            </span>

                            <strong>
                                {item.value}/{item.max}
                            </strong>

                        </div>

                        <div className="score-progress">

                            <div
                                className="score-progress-bar"
                                style={{
                                    width: `${percentage}%`,
                                }}
                            ></div>

                        </div>

                    </div>
                );
            })}

        </div>
    );
}

export default ScoreBreakdown;