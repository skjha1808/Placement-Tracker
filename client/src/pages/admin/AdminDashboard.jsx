import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import "./AdminDashboard.css";

import AdminStatCard from "../../components/admin/dashboard/AdminStatCard";
import AdminCharts from "../../components/admin/dashboard/AdminCharts";
import RecentActivities from "../../components/admin/dashboard/RecentActivities";

function AdminDashboard() {

    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response =
                    await api.get(
                        "/dashboard/admin"
                    );

                setDashboard(response.data);

            } catch (error) {

                console.log(
                    error.response?.data ||
                    error.message
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboard();

    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!dashboard) {
        return <h2>Failed to load dashboard.</h2>;
    }

    return (

        <div className="page">

            <h1 className="page-title">
                Admin Dashboard
            </h1>

            <p className="dashboard-subtitle">
                Manage students, companies and placement activities.
            </p>

            <div className="dashboard-stats">

                <div
                    onClick={() =>
                        navigate("/admin/students")
                    }
                >

                    <AdminStatCard
                        icon="👨‍🎓"
                        value={dashboard.stats.students}
                        label="Students"
                        color="#2563eb"
                    />

                </div>

                <div
                    onClick={() =>
                        navigate("/admin/companies")
                    }
                >

                    <AdminStatCard
                        icon="🏢"
                        value={dashboard.stats.companies}
                        label="Companies"
                        color="#16a34a"
                    />

                </div>

                <div
                    onClick={() =>
                        navigate("/admin/applications")
                    }
                >

                    <AdminStatCard
                        icon="📄"
                        value={dashboard.stats.applications}
                        label="Applications"
                        color="#f59e0b"
                    />

                </div>

                <div
                    onClick={() =>
                        navigate("/admin/applications")
                    }
                >

                    <AdminStatCard
                        icon="🎉"
                        value={dashboard.stats.selected}
                        label="Selected"
                        color="#22c55e"
                    />

                </div>

            </div>

            <AdminCharts
                statusData={dashboard.statusData}
                branchData={dashboard.branchData}
            />

            <RecentActivities
                activities={dashboard.recentActivities}
            />

        </div>

    );

}

export default AdminDashboard;