import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        applied: 0,
        interview: 0,
        selected: 0,
        rejected: 0,
    });

    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const response = await api.get("/students/me");
            setProfile(response.data);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get("/applications/my");

            const applications = response.data;

            setStats({
                applied: applications.length,

                interview: applications.filter(
                    (app) => app.status === "Interview"
                ).length,

                selected: applications.filter(
                    (app) => app.status === "Selected"
                ).length,

                rejected: applications.filter(
                    (app) => app.status === "Rejected"
                ).length,
            });

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    return (
        <div className="page">

            <h1 className="page-title">
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

            <div className="dashboard-stats">

                <div className="stat-card">
                    <h2>📄 {stats.applied}</h2>
                    <p>Applications</p>
                </div>

                <div className="stat-card">
                    <h2>💼 {stats.interview}</h2>
                    <p>Interview</p>
                </div>

                <div className="stat-card">
                    <h2>🎉 {stats.selected}</h2>
                    <p>Selected</p>
                </div>

                <div className="stat-card">
                    <h2>❌ {stats.rejected}</h2>
                    <p>Rejected</p>
                </div>

            </div>

            <div className="dashboard-actions">

                <div
                    className="card dashboard-card"
                    onClick={() => navigate("/profile")}
                >
                    <h3>👤 Profile</h3>

                    <p>
                        View or update your profile information.
                    </p>
                </div>

                <div
                    className="card dashboard-card"
                    onClick={() => navigate("/companies")}
                >
                    <h3>🏢 Companies</h3>

                    <p>
                        Browse all available placement opportunities.
                    </p>
                </div>

                <div
                    className="card dashboard-card"
                    onClick={() => navigate("/applications")}
                >
                    <h3>📄 My Applications</h3>

                    <p>
                        Track your application status and progress.
                    </p>
                </div>

            </div>

        </div>
    );
}

export default Dashboard;