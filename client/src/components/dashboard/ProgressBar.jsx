function ProgressBar({
    label,
    value,
    max,
    color,
}) {

    const percentage =
        max === 0
            ? 0
            : (value / max) * 100;
    return (

        <div className="progress-item">

            <div className="progress-header">
                <span>{label}</span>
                <span>{value}</span>
            </div>

            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{
                        width: `${percentage}%`,
                        background: color,
                    }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;