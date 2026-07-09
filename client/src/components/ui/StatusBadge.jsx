function StatusBadge({ verified }) {
    return verified ? (
        <span className="badge badge-success">
            ✅ Verified
        </span>
    ) : (
        <span className="badge badge-warning">
            ⏳ Pending Verification
        </span>
    );
}

export default StatusBadge;