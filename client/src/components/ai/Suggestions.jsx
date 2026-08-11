import "./Suggestions.css";

function Suggestions({ analysis }) {

    const suggestions = analysis?.suggestions || {};

    const sections = [
        {
            key: "highPriority",
            title: "High Priority",
            className: "high-priority",
        },
        {
            key: "mediumPriority",
            title: "Medium Priority",
            className: "medium-priority",
        },
        {
            key: "lowPriority",
            title: "Low Priority",
            className: "low-priority",
        },
    ];

    return (
        <div className="suggestions-card">

            <h3>Improvement Suggestions</h3>

            <p className="suggestions-description">
                Practical recommendations to improve your resume,
                technical profile, and job readiness.
            </p>

            <div className="suggestions-list">

                {sections.map((section) => {

                    const items = suggestions[section.key] || [];

                    return (
                        <div
                            className={`suggestion-section ${section.className}`}
                            key={section.key}
                        >

                            <div className="suggestion-section-header">

                                <span className="suggestion-indicator"></span>

                                <h4>{section.title}</h4>

                            </div>

                            <ul>
                                {items.map((item, index) => (
                                    <li key={index}>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}

export default Suggestions;