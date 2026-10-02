import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { validateRegister } from "../../utils/validation";
import "./Auth.css";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
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

        // Clear field error while typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        // Clear backend error
        setServerError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setServerError("");

        const validationErrors = validateRegister(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/register", {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            // Reset form
            setFormData({
                name: "",
                email: "",
                password: "",
            });

            navigate("/login");

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
            <h1 className="register-title">Register</h1>

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
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    autoFocus
                />

                {errors.name && (
                    <p className="error">
                        {errors.name}
                    </p>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
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
                        ? "Registering..."
                        : "Register"}
                </button>
            </form>
        </div>
    );
}

export default Register;