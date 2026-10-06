import { NavLink, useNavigate } from "react-router-dom";
import NotificationBell from "../components/notifications/NotificationBell";
import "./Navbar.css";

const studentLinks = [
    ["⌂", "Home", "/home"],
    ["◈", "Overview", "/overview"],
    ["▤", "Applications", "/applications"],
    ["◉", "Interviews", "/interviews"],
    ["✦", "AI Resume", "/ai-resume"],
];

const adminLinks = [
    ["⌂", "Dashboard", "/admin"],
    ["◈", "Students", "/admin/students"],
    ["▣", "Companies", "/admin/companies"],
    ["▤", "Applications", "/admin/applications"],
];

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const student =
        token && user?.role === "student";

    const admin =
        token && user?.role === "admin";


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    /*
     * Public landing page:
     * No public navbar.
     * Branding and authentication actions are handled
     * by the landing page itself.
     */

    if (!token) {
        return null;
    }


    /*
     * =====================================================
     * ADMIN WORKSPACE
     * =====================================================
     */

    if (admin) {
        return (
            <div className="admin-layout">

                {/* =================================================
                    ADMIN SIDEBAR
                ================================================= */}

                <aside className="admin-sidebar">

                    {/* =============================================
                        BRAND
                    ============================================= */}

                    <div className="admin-sidebar-brand">

                        <button
                            className="admin-brand-mark"
                            onClick={() =>
                                navigate("/admin")
                            }
                            aria-label="Go to admin dashboard"
                        >
                            PT
                        </button>

                        <div className="admin-brand-copy">

                            <strong>
                                Placement
                            </strong>

                            <span>
                                Tracker
                            </span>

                        </div>

                    </div>


                    {/* =============================================
                        WORKSPACE
                    ============================================= */}

                    <div className="admin-sidebar-label">
                        Workspace
                    </div>


                    <nav className="admin-sidebar-nav">

                        {adminLinks.map(
                            ([icon, label, to]) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={
                                        to === "/admin"
                                    }
                                    className={({
                                        isActive,
                                    }) =>
                                        isActive
                                            ? "admin-nav-link active"
                                            : "admin-nav-link"
                                    }
                                >

                                    <span className="admin-nav-icon">
                                        {icon}
                                    </span>

                                    <span>
                                        {label}
                                    </span>

                                </NavLink>
                            )
                        )}

                    </nav>


                    {/* =============================================
                        FLEXIBLE SPACE
                    ============================================= */}

                    <div className="admin-sidebar-spacer" />


                    {/* =============================================
                        ADMINISTRATION
                    ============================================= */}

                    <div className="admin-sidebar-label">
                        Administration
                    </div>


                    {/* PLACEMENT CELL */}

                    <div className="admin-info-card">

                        <div className="admin-info-icon">
                            ✓
                        </div>

                        <div>

                            <strong>
                                Placement Cell
                            </strong>

                            <span>
                                Admin Workspace
                            </span>

                        </div>

                    </div>


                    {/* =============================================
                        ADMIN ACCOUNT
                    ============================================= */}

                    <div className="admin-sidebar-label">
                        Admin Account
                    </div>


                    <button
                        type="button"
                        className="admin-sidebar-user"
                        onClick={() =>
                            navigate("/admin/profile")
                        }
                        aria-label="Open admin profile"
                    >

                        <div className="admin-user-avatar">
                            {(user?.name || "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="admin-user-copy">

                            <strong>
                                {user?.name || "Admin"}
                            </strong>

                            <span>
                                Administrator
                            </span>

                        </div>

                    </button>


                    {/* =============================================
                        SIGN OUT
                    ============================================= */}

                    <button
                        className="admin-sidebar-logout"
                        onClick={logout}
                    >

                        <span>
                            ↪
                        </span>

                        <span>
                            Sign out
                        </span>

                    </button>

                </aside>


                {/* =================================================
                    ADMIN TOP BAR
                ================================================= */}

                <header className="admin-topbar">

                    <div className="admin-topbar-title">

                        <span className="admin-topbar-eyebrow">
                            ADMINISTRATION
                        </span>

                        <strong>
                            Placement Management
                        </strong>

                    </div>


                    <div className="admin-topbar-actions">

                        <NotificationBell />

                    </div>

                </header>

            </div>
        );
    }


    /*
     * =====================================================
     * STUDENT WORKSPACE
     * =====================================================
     */

    if (student) {
        return (
            <aside className="student-sidebar">

                {/* =============================================
                    BRAND
                ============================================= */}

                <div className="sidebar-brand">

                    <button
                        className="brand-mark"
                        onClick={() =>
                            navigate("/home")
                        }
                    >
                        PT
                    </button>

                    <div>

                        <strong>
                            Placement
                        </strong>

                        <span>
                            Tracker
                        </span>

                    </div>

                </div>


                {/* =============================================
                    WORKSPACE
                ============================================= */}

                <div className="sidebar-label">
                    Workspace
                </div>


                <nav className="student-nav">

                    {studentLinks.map(
                        ([icon, label, to]) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({
                                    isActive,
                                }) =>
                                    isActive
                                        ? "student-link active"
                                        : "student-link"
                                }
                            >

                                <span className="nav-icon">
                                    {icon}
                                </span>

                                <span>
                                    {label}
                                </span>

                            </NavLink>
                        )
                    )}

                </nav>


                {/* =============================================
                    FLEXIBLE SPACE
                ============================================= */}

                <div className="sidebar-spacer" />


                {/* =============================================
                    ACCOUNT
                ============================================= */}

                <div className="sidebar-label">
                    Account
                </div>


                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive
                            ? "student-link active"
                            : "student-link"
                    }
                >

                    <span className="nav-icon">
                        ◌
                    </span>

                    <span>
                        Profile
                    </span>

                </NavLink>


                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive
                            ? "student-link active"
                            : "student-link"
                    }
                >

                    <span className="nav-icon">
                        ⚙
                    </span>

                    <span>
                        Settings
                    </span>

                </NavLink>


                {/* =============================================
                    STUDENT USER
                ============================================= */}

                <div className="sidebar-user">

                    <div className="user-avatar">
                        {(user?.name || "S")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="user-copy">

                        <strong>
                            {user?.name || "Student"}
                        </strong>

                        <span>
                            Student
                        </span>

                    </div>

                    <NotificationBell />

                </div>


                {/* =============================================
                    SIGN OUT
                ============================================= */}

                <button
                    className="sidebar-logout"
                    onClick={logout}
                >
                    ↪

                    <span>
                        Sign out
                    </span>

                </button>

            </aside>
        );
    }

    return null;
}

export default Navbar;