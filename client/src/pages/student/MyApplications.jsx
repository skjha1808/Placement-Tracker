import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MyApplications.css";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

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
                return "badge badge-primary";

            case "OA Cleared":
                return "badge badge-warning";

            case "Interview":
                return "badge badge-info";

            case "Selected":
                return "badge badge-success";

            case "Rejected":
                return "badge badge-danger";

            default:
                return "badge";
        }

    };

    if (loading) {

        return <LoadingSpinner />;

    }

    return (

        <div className="page">

            <h1 className="page-title">
                My Applications
            </h1>

            {applications.length === 0 ? (

                <EmptyState
                    message="No Applications Found"
                />

            ) : (

                <div className="applications-grid">

                    {applications.map((application) => (

                        <div
                            key={application._id}
                            className="card application-card"
                        >

                            <div className="application-header">

                                <h2>
                                    {application.company.companyName}
                                </h2>

                                <span
                                    className={getStatusClass(
                                        application.status
                                    )}
                                >
                                    {application.status}
                                </span>

                            </div>

                            <div className="application-info">

                                <p>
                                    💼 <strong>Role:</strong>{" "}
                                    {application.company.role}
                                </p>

                                <p>
                                    💰 <strong>Package:</strong>{" "}
                                    ₹{application.company.package} LPA
                                </p>

                                <p>
                                    📅 <strong>Applied On:</strong>{" "}
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

                            <button
                                className="btn btn-primary application-btn"
                            >
                                View Company
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default MyApplications;