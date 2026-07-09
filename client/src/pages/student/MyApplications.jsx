import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MyApplications.css";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        setLoading(true);

        try {
            const response = await api.get("/applications/my");

            setApplications(response.data);

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "Applied":
                return "status-applied";

            case "OA Cleared":
                return "status-oa-cleared";

            case "Interview":
                return "status-interview";

            case "Selected":
                return "status-selected";

            case "Rejected":
                return "status-rejected";

            default:
                return "";
        }
    };

    return (
        <div className="my-applications-container">

            <h1 className="my-applications-title">
                My Applications
            </h1>

            {loading ? (
                <h3 className="loading-text">
                    Loading...
                </h3>
            ) : applications.length === 0 ? (
                <h3 className="no-applications">
                    No Applications Found
                </h3>
            ) : (
                applications.map((application) => (
                    <div
                        key={application._id}
                        className="application-card"
                    >
                        <h2 className="company-name">
                            {application.company.companyName}
                        </h2>

                        <p>
                            <strong>Role:</strong>{" "}
                            {application.company.role}
                        </p>

                        <p>
                            <strong>Package:</strong>{" "}
                            ₹{application.company.package} LPA
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                className={`status ${getStatusClass(
                                    application.status
                                )}`}
                            >
                                {application.status}
                            </span>
                        </p>

                        <p>
                            <strong>Applied On:</strong>{" "}
                            {new Date(
                                application.appliedDate
                            ).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>
                ))
            )}

        </div>
    );
}

export default MyApplications;