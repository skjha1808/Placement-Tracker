import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [profile, setProfile] = useState(null);

    const navigate = useNavigate();

    const handleProfile = () => {
        navigate("/profile");
    };

    const fetchProfile = async () => {
        try {
            const response = await api.get(
                "/students/me",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setProfile(response.data);

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div>
            <h1>Welcome {user?.name}</h1>

            <p>
                Profile Status:{" "}
                {profile
                    ? "Profile Created"
                    : "Not Created"}
            </p>

            {!profile && (
                <button onClick={handleProfile}>
                    Complete Profile
                </button>
            )}

            {profile && (
                <button onClick={handleProfile}>
                    View / Edit Profile
                </button>
            )}
        </div>
    );
}

export default Dashboard;