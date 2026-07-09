import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchProfile = async () => {
        setLoading(true);

        try {
            const response = await api.get("/students/me");

            console.log("Dashboard Response:", response.data);

            setProfile(response.data);

        } catch (error) {
            console.log("Dashboard Error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="dashboard-container">

            <h1 className="dashboard-title">
                Student Dashboard
            </h1>

            <h2 className="welcome-text">
                👋 Welcome, {user?.name}
            </h2>

            {loading ? (
                <p className="profile-status">
                    Loading...
                </p>
            ) : (
                <p className="profile-status">
                    Profile Status :{" "}
                    {profile ? (
                        <span className="profile-complete">
                            ✅ Completed
                        </span>
                    ) : (
                        <span className="profile-pending">
                            ❌ Not Completed
                        </span>
                    )}
                </p>
            )}

            <div className="dashboard-actions">

                <div
                    className="dashboard-card"
                    onClick={() => navigate("/profile")}
                >
                    👤 {profile
                        ? "View / Edit Profile"
                        : "Complete Profile"}
                </div>

                <div
                    className="dashboard-card"
                    onClick={() => navigate("/companies")}
                >
                    🏢 View Companies
                </div>

                <div
                    className="dashboard-card"
                    onClick={() => navigate("/applications")}
                >
                    📄 My Applications
                </div>

            </div>

        </div>
    );
}

export default Dashboard;