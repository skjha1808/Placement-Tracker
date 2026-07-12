function StatusBadge({ eligibility }) {

    if (!eligibility) {
        return (
            <span className="status-badge status-loading">
                Checking...
            </span>
        );
    }

    if (eligibility.reason === "Already Applied") {
        return (
            <span className="status-badge status-applied">
                🟡 Applied
            </span>
        );
    }

    if (eligibility.reason === "Applications are closed") {
        return (
            <span className="status-badge status-closed">
                ⚫ Closed
            </span>
        );
    }

    if (eligibility.eligible) {
        return (
            <span className="status-badge status-eligible">
                🟢 Eligible
            </span>
        );
    }

    return (
        <span className="status-badge status-not-eligible">
            🔴 Not Eligible
        </span>
    );
}

export default StatusBadge;