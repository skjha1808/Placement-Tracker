import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav>
            <Link to="/">Home</Link>

            {" | "}

            <Link to="/dashboard">
                Dashboard
            </Link>

            {" | "}

            <Link to="/login">
                Login
            </Link>

            {" | "}

            <Link to="/register">
                Register
            </Link>

            {" | "}

            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;