import "./ATSKeywords.css";

function ATSKeywords({ analysis }) {

    const matchedKeywords = analysis?.atsKeywords?.matched || [];
    const missingKeywords = analysis?.atsKeywords?.missing || [];
    const missingSkills = analysis?.missingSkills || [];

    return (
        <div className="ats-skills-grid">

            {/* ATS Keywords */}
            <div className="ats-keywords-card">

                <h3>ATS Keywords</h3>

                <p className="ats-card-description">
                    Keywords already present in your resume and important
                    keywords that are currently missing.
                </p>

                <div className="keyword-section">

                    <h4>Matched Keywords</h4>

                    <div className="keyword-list">

                        {matchedKeywords.map((keyword, index) => (
                            <span
                                className="keyword-tag matched"
                                key={index}
                            >
                                {keyword}
                            </span>
                        ))}

                    </div>

                </div>

                <div className="keyword-section">

                    <h4>Missing Keywords</h4>

                    <div className="keyword-list">

                        {missingKeywords.map((keyword, index) => (
                            <span
                                className="keyword-tag missing"
                                key={index}
                            >
                                {keyword}
                            </span>
                        ))}

                    </div>

                </div>

            </div>

            {/* Missing Skills */}
            <div className="missing-skills-card">

                <h3>Missing Skills</h3>

                <p className="ats-card-description">
                    Skills recommended by AI based on your current profile
                    and software engineering career path.
                </p>

                <div className="missing-skills-list">

                    {missingSkills.map((item, index) => (

                        <div
                            className="missing-skill-item"
                            key={index}
                        >

                            <div className="missing-skill-header">

                                <span className="missing-skill-name">
                                    {item.skill}
                                </span>

                                <span
                                    className={`importance-badge ${item.importance?.toLowerCase()}`}
                                >
                                    {item.importance}
                                </span>

                            </div>

                            <p>
                                {item.reason}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default ATSKeywords;