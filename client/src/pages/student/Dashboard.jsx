import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Dashboard.css";

import StatCard from "../../components/dashboard/StatCard";
import ProfileProgress from "../../components/dashboard/ProfileProgress";
import RecentApplications from "../../components/dashboard/RecentApplications";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";
import DashboardCharts from "../../components/dashboard/DashboardCharts";

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

    const [applications, setApplications] = useState([]);
    const [companies, setCompanies] = useState([]);

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
            const [applicationsRes, companiesRes] =
                await Promise.all([
                    api.get("/applications/my"),
                    api.get("/companies"),
                ]);

            const apps = applicationsRes.data;
            const comps = companiesRes.data;

            setApplications(apps);
            setCompanies(comps);

            setStats({
                applied: apps.length,

                interview: apps.filter(
                    (app) => app.status === "Interview"
                ).length,

                selected: apps.filter(
                    (app) => app.status === "Selected"
                ).length,

                rejected: apps.filter(
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

                <StatCard
                    icon="📄"
                    value={stats.applied}
                    label="Applications"
                    color="#3b82f6"
                />

                <StatCard
                    icon="💼"
                    value={stats.interview}
                    label="Interview"
                    color="#f59e0b"
                />

                <StatCard
                    icon="🎉"
                    value={stats.selected}
                    label="Selected"
                    color="#22c55e"
                />

                <StatCard
                    icon="❌"
                    value={stats.rejected}
                    label="Rejected"
                    color="#ef4444"
                />

            </div>

            <DashboardCharts
                stats={stats}
            />

            <ProfileProgress
                profile={profile}
            />

            <div className="dashboard-grid">

                <RecentApplications
                    applications={applications}
                />

                <UpcomingDeadlines
                    companies={companies}
                />

            </div>

            <div className="dashboard-actions">

                <div
                    className="card dashboard-card"
                    onClick={() =>
                        navigate("/profile")
                    }
                >

                    <h3>
                        👤 Profile
                    </h3>

                    <p>
                        View or update your profile
                        information.
                    </p>

                </div>

                <div
                    className="card dashboard-card"
                    onClick={() =>
                        navigate("/companies")
                    }
                >

                    <h3>
                        🏢 Companies
                    </h3>

                    <p>
                        Browse all available
                        placement opportunities.
                    </p>

                </div>

                <div
                    className="card dashboard-card"
                    onClick={() =>
                        navigate("/applications")
                    }
                >

                    <h3>
                        📄 My Applications
                    </h3>

                    <p>
                        Track your application
                        status and progress.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;