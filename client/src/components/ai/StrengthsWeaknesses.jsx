import "./StrengthsWeaknesses.css";

function StrengthsWeaknesses({ analysis }) {

    const strengths = analysis?.strengths || [];
    const weaknesses = analysis?.weaknesses || [];

    return (
        <div className="strengths-weaknesses-grid">

            <div className="strengths-card">

                <h3>
                    ✓ Strengths
                </h3>

                <ul>
                    {strengths.map((strength, index) => (
                        <li key={index}>
                            {strength}
                        </li>
                    ))}
                </ul>

            </div>

            <div className="weaknesses-card">

                <h3>
                    ⚠ Weaknesses
                </h3>

                <ul>
                    {weaknesses.map((weakness, index) => (
                        <li key={index}>
                            {weakness}
                        </li>
                    ))}
                </ul>

            </div>

        </div>
    );
}

export default StrengthsWeaknesses;