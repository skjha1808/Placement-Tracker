import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { validateLogin } from "../../utils/validation";
import "./Auth.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setServerError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setServerError("");

        const validationErrors = validateLogin(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            // Save JWT
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/");

        } catch (error) {
            setServerError(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h1 className="register-title">
                Login
            </h1>

            {serverError && (
                <p className="server-error">
                    {serverError}
                </p>
            )}

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoFocus
                />

                {errors.email && (
                    <p className="error">
                        {errors.email}
                    </p>
                )}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                />

                {errors.password && (
                    <p className="error">
                        {errors.password}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;