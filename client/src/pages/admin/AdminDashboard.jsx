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

        return (
            <div className="page admin-dashboard-page">

                <div className="admin-dashboard-error">

                    <div className="admin-error-icon">
                        !
                    </div>

                    <h2>
                        Failed to load dashboard
                    </h2>

                    <p>
                        We couldn't load the placement
                        dashboard data. Please try again.
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="page admin-dashboard-page">

            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}

            <div className="admin-dashboard-header">

                <div>

                    <span className="admin-dashboard-eyebrow">
                        OVERVIEW
                    </span>

                    <h1 className="admin-dashboard-title">
                        Admin Dashboard
                    </h1>

                    <p className="dashboard-subtitle">
                        Manage students, companies and
                        placement activities.
                    </p>

                </div>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <section
                className="dashboard-stats"
                aria-label="Placement statistics"
            >

                <button
                    type="button"
                    className="dashboard-stat-link"
                    onClick={() =>
                        navigate("/admin/students")
                    }
                >

                    <AdminStatCard
                        icon="👨‍🎓"
                        value={dashboard.stats.students}
                        label="Students"
                        color="#3157d5"
                    />

                </button>


                <button
                    type="button"
                    className="dashboard-stat-link"
                    onClick={() =>
                        navigate("/admin/companies")
                    }
                >

                    <AdminStatCard
                        icon="🏢"
                        value={dashboard.stats.companies}
                        label="Companies"
                        color="#138a5b"
                    />

                </button>


                <button
                    type="button"
                    className="dashboard-stat-link"
                    onClick={() =>
                        navigate("/admin/applications")
                    }
                >

                    <AdminStatCard
                        icon="📄"
                        value={dashboard.stats.applications}
                        label="Applications"
                        color="#b56a00"
                    />

                </button>


                <button
                    type="button"
                    className="dashboard-stat-link"
                    onClick={() =>
                        navigate("/admin/applications")
                    }
                >

                    <AdminStatCard
                        icon="🎉"
                        value={dashboard.stats.selected}
                        label="Selected"
                        color="#138a5b"
                    />

                </button>

            </section>


            {/* =================================================
                ANALYTICS
            ================================================= */}

            <AdminCharts
                statusData={dashboard.statusData}
                branchData={dashboard.branchData}
            />


            {/* =================================================
                RECENT ACTIVITIES
            ================================================= */}

            <RecentActivities
                activities={dashboard.recentActivities}
            />

        </div>

    );

}

export default AdminDashboard;