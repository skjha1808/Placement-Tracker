import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MyApplications.css";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import ApplicationCard from "../../components/applications/ApplicationCard";

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

                        <ApplicationCard
                            key={application._id}
                            application={application}
                            getStatusClass={getStatusClass}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}

export default MyApplications;