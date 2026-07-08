import { Link, useNavigate } from "react-router-dom";

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
        <nav>
            <Link to="/">Home</Link>

            {" | "}

            {token && user?.role === "student" && (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    {" | "}
                </>
            )}

            {token && user?.role === "admin" && (
                <>
                    <Link to="/admin">Admin Dashboard</Link>
                    {" | "}
                </>
            )}

            {!token && (
                <>
                    <Link to="/login">Login</Link>
                    {" | "}
                    <Link to="/register">Register</Link>
                </>
            )}

            {token && (
                <button onClick={handleLogout}>
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Navbar;