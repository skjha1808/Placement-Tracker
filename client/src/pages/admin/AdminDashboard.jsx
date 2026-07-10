import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import "./AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        students: 0,
        companies: 0,
        applications: 0,
        selected: 0,
    });

    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                const [
                    studentsRes,
                    companiesRes,
                    applicationsRes,
                ] = await Promise.all([
                    api.get("/students"),
                    api.get("/companies"),
                    api.get("/applications"),
                ]);

                const applications =
                    applicationsRes.data;

                setStats({

                    students:
                        studentsRes.data.length,

                    companies:
                        companiesRes.data.length,

                    applications:
                        applications.length,

                    selected:
                        applications.filter(
                            (app) =>
                                app.status ===
                                "Selected"
                        ).length,

                });

            } catch (error) {

                console.log(
                    error.response?.data ||
                    error.message
                );

            }

        };

        fetchDashboardStats();

    }, []);

    return (

        <div className="page">

            <h1 className="page-title">
                Admin Dashboard
            </h1>

            <p className="dashboard-subtitle">
                Manage students, companies and placement activities.
            </p>

            <div className="dashboard-stats">

                <div className="stat-card">
                    <h2>👨‍🎓</h2>
                    <h3>{stats.students}</h3>
                    <p>Students</p>
                </div>

                <div className="stat-card">
                    <h2>🏢</h2>
                    <h3>{stats.companies}</h3>
                    <p>Companies</p>
                </div>

                <div className="stat-card">
                    <h2>📄</h2>
                    <h3>{stats.applications}</h3>
                    <p>Applications</p>
                </div>

                <div className="stat-card">
                    <h2>🎉</h2>
                    <h3>{stats.selected}</h3>
                    <p>Selected</p>
                </div>

            </div>

            <div className="admin-actions">

                <div
                    className="dashboard-card"
                    onClick={() =>
                        navigate("/admin/students")
                    }
                >
                    <h3>
                        👨‍🎓 Students
                    </h3>

                    <p>
                        View, verify and manage student profiles.
                    </p>
                </div>

                <div
                    className="dashboard-card"
                    onClick={() =>
                        navigate("/admin/companies")
                    }
                >
                    <h3>
                        🏢 Companies
                    </h3>

                    <p>
                        Add, edit and manage placement drives.
                    </p>
                </div>

                <div
                    className="dashboard-card"
                    onClick={() =>
                        navigate("/admin/applications")
                    }
                >
                    <h3>
                        📄 Applications
                    </h3>

                    <p>
                        Track application status and update results.
                    </p>
                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;