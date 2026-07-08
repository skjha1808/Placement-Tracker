
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <br />

            <button
                onClick={() => navigate("/admin/students")}
            >
                Manage Students
            </button>

            <br /><br />

            <button
                onClick={() => navigate("/admin/companies")}
            >
                Manage Companies
            </button>

            <br /><br />

            <button
                onClick={() => navigate("/admin/applications")}
            >
                Manage Applications
            </button>
        </div>
    );
}

export default AdminDashboard;