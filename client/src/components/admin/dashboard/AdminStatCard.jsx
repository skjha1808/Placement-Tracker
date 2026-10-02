import "./AdminStatCard.css";

function AdminStatCard({

    icon,

    value,

    label,

    color,

}) {

    return (

        <div className="card admin-stat-card">

            <div
                className="admin-stat-icon"
                style={{
                    background: color,
                }}
            >

                {icon}

            </div>

            <h2>

                {value}

            </h2>

            <p>

                {label}

            </p>

        </div>

    );

}

export default AdminStatCard;