import "./Summary.css";

function Summary({ analysis }) {

    const summary = analysis?.summary || "";

    if (!summary) {
        return null;
    }

    return (
        <div className="summary-card">

            <div className="summary-icon">
                ✨
            </div>

            <div className="summary-content">

                <h3>Resume Summary</h3>

                <p>
                    {summary}
                </p>

            </div>

        </div>
    );
}

export default Summary;