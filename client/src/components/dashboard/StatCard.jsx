function StatCard({
    icon,
    value,
    label,
    color,
}) {

    return (

        <div className="stat-card">

            <div
                className="stat-icon"
                style={{ color }}
            >
                {icon}
            </div>

            <h2>{value}</h2>

            <p>{label}</p>

        </div>

    );

}

export default StatCard;