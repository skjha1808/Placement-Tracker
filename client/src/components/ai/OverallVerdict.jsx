import "./OverallVerdict.css";

function OverallVerdict({ analysis }) {

    const { level, recommendation } = analysis.overallVerdict;

    const getVerdictClass = () => {
        switch (level) {
            case "Excellent":
                return "excellent";

            case "Very Good":
                return "very-good";

            case "Good":
                return "good";

            case "Average":
                return "average";

            case "Needs Improvement":
                return "needs-improvement";

            default:
                return "good";
        }
    };

    return (
        <div className="overall-verdict-card">

            <h3>Overall Verdict</h3>

            <div className={`verdict-badge ${getVerdictClass()}`}>
                {level}
            </div>

            <p className="verdict-text">
                {recommendation}
            </p>

        </div>
    );
}

export default OverallVerdict;