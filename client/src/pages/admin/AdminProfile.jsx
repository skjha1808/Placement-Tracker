import { useEffect, useState } from "react";

import api from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import "./AdminProfile.css";


function AdminProfile() {

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // FETCH ADMIN PROFILE
    // =====================================================

    useEffect(() => {

        const fetchAdminProfile = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get("/auth/me");

                const user = response.data?.user;

                if (!user || user.role !== "admin") {
                    throw new Error(
                        "Admin profile could not be loaded."
                    );
                }

                setAdmin(user);

            } catch (error) {

                console.error(
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load admin profile."
                );

            } finally {

                setLoading(false);

            }
        };


        fetchAdminProfile();

    }, []);


    // =====================================================
    // DATE FORMATTER
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =====================================================
    // INITIAL
    // =====================================================

    const getInitial = () => {

        return (
            admin?.name ||
            "A"
        )
            .charAt(0)
            .toUpperCase();
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return <LoadingSpinner />;
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !admin) {

        return (
            <div className="admin-profile-page">

                <div className="admin-profile-error">

                    <div className="admin-profile-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load profile
                    </h2>

                    <p>
                        {error ||
                            "Admin profile information is unavailable."}
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="admin-profile-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="admin-profile-page-header">

                <div>

                    <span className="admin-profile-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1 className="admin-profile-title">
                        Admin Profile
                    </h1>

                    <p className="admin-profile-subtitle">
                        View your administrator account information
                        and profile details.
                    </p>

                </div>

            </div>


            {/* =================================================
                PROFILE HERO
            ================================================= */}

            <section className="admin-profile-hero">

                <div className="admin-profile-avatar">
                    {getInitial()}
                </div>

                <div className="admin-profile-hero-info">

                    <h2>
                        {admin.name}
                    </h2>

                    <p>
                        {admin.email}
                    </p>

                    <div className="admin-profile-hero-meta">

                        <span className="admin-profile-role">
                            Administrator
                        </span>

                        <span className="admin-profile-active">
                            <span className="admin-profile-status-dot" />
                            Active
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================================
                PERSONAL INFORMATION
            ================================================= */}

            <section className="admin-profile-section">

                <div className="admin-profile-section-heading">

                    <div>

                        <span className="admin-profile-section-eyebrow">
                            PROFILE
                        </span>

                        <h2>
                            Personal Information
                        </h2>

                    </div>

                </div>


                <div className="admin-profile-info-grid">

                    <div className="admin-profile-info-card">

                        <span className="admin-profile-info-label">
                            Full Name
                        </span>

                        <strong>
                            {admin.name}
                        </strong>

                    </div>


                    <div className="admin-profile-info-card">

                        <span className="admin-profile-info-label">
                            Email Address
                        </span>

                        <strong>
                            {admin.email}
                        </strong>

                    </div>


                    <div className="admin-profile-info-card">

                        <span className="admin-profile-info-label">
                            Account Role
                        </span>

                        <strong>
                            Administrator
                        </strong>

                    </div>


                    <div className="admin-profile-info-card">

                        <span className="admin-profile-info-label">
                            Account Status
                        </span>

                        <strong className="admin-profile-status-text">
                            Active
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <section className="admin-profile-section">

                <div className="admin-profile-section-heading">

                    <div>

                        <span className="admin-profile-section-eyebrow">
                            ACCOUNT
                        </span>

                        <h2>
                            Account Information
                        </h2>

                    </div>

                </div>


                <div className="admin-profile-account-grid">

                    <div className="admin-profile-account-card">

                        <div className="admin-profile-account-icon">
                            ID
                        </div>

                        <div>

                            <span>
                                Account ID
                            </span>

                            <strong>
                                {admin.id}
                            </strong>

                        </div>

                    </div>


                    <div className="admin-profile-account-card">

                        <div className="admin-profile-account-icon">
                            +
                        </div>

                        <div>

                            <span>
                                Account Created
                            </span>

                            <strong>
                                {formatDate(admin.createdAt)}
                            </strong>

                        </div>

                    </div>


                    <div className="admin-profile-account-card">

                        <div className="admin-profile-account-icon">
                            ↻
                        </div>

                        <div>

                            <span>
                                Last Updated
                            </span>

                            <strong>
                                {formatDate(admin.updatedAt)}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                SECURITY
            ================================================= */}

            <section className="admin-profile-section">

                <div className="admin-profile-section-heading">

                    <div>

                        <span className="admin-profile-section-eyebrow">
                            SECURITY
                        </span>

                        <h2>
                            Account Security
                        </h2>

                    </div>

                </div>


                <div className="admin-profile-security-card">

                    <div className="admin-profile-security-icon">
                        🔒
                    </div>

                    <div className="admin-profile-security-copy">

                        <strong>
                            Password Protection
                        </strong>

                        <p>
                            Your password is securely stored using
                            bcrypt hashing and is never displayed here.
                        </p>

                    </div>

                    <span className="admin-profile-security-badge">
                        Protected
                    </span>

                </div>

            </section>

        </div>
    );
}


export default AdminProfile;