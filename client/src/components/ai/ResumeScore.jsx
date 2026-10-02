import "./ResumeScore.css";

function ResumeScore({ analysis }) {

    const score = analysis?.resumeScore || 0;
    const level = analysis?.overallVerdict?.level || "";

    return (
        <div className="resume-score-card">

            <h3>
                Resume Score
            </h3>

            <div className="resume-score-circle">

                <div className="resume-score-value">
                    {score}
                </div>

                <div className="resume-score-total">
                    /100
                </div>

            </div>

            <div className="resume-score-level">
                {level}
            </div>

            <div className="resume-score-progress">

                <div
                    className="resume-score-progress-bar"
                    style={{
                        width: `${score}%`,
                    }}
                ></div>

            </div>

        </div>
    );
}

export default ResumeScore;