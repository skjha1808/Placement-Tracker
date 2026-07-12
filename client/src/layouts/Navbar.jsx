import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import NotificationBell from "../components/notifications/NotificationBell";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-logo">
                <NavLink to="/">
                    Placement Tracker
                </NavLink>
            </div>

            <div className="navbar-links">

                <NavLink to="/">
                    Home
                </NavLink>

                {token && user?.role === "student" && (
                    <>
                        <NavLink to="/dashboard">
                            Dashboard
                        </NavLink>

                        <NavLink to="/companies">
                            Companies
                        </NavLink>

                        <NavLink to="/applications">
                            Applications
                        </NavLink>
                    </>
                )}

                {token && user?.role === "admin" && (
                    <>
                        <NavLink to="/admin">
                            Dashboard
                        </NavLink>

                        <NavLink to="/admin/students">
                            Students
                        </NavLink>

                        <NavLink to="/admin/companies">
                            Companies
                        </NavLink>

                        <NavLink to="/admin/applications">
                            Applications
                        </NavLink>
                    </>
                )}

                {!token && (
                    <>
                        <NavLink to="/login">
                            Login
                        </NavLink>

                        <NavLink to="/register">
                            Register
                        </NavLink>
                    </>
                )}

            </div>

            {token && (
                <div className="navbar-user">
                    <NotificationBell />

                    <span>
                        👤 {user?.name}
                    </span>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}

        </nav>
    );
}

export default Navbar;