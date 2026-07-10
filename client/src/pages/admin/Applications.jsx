import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import ApplicationForm from "../../components/forms/ApplicationForm";

import "./Applications.css";

function Applications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const fetchApplications = async () => {

        setLoading(true);

        try {

            const response = await api.get("/applications");

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

    const handleEdit = (application) => {

        setSelectedApplication(application);

        setIsModalOpen(true);

    };

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this application?"
            )
        ) return;

        try {

            await api.delete(`/applications/${id}`);

            alert("Application deleted successfully!");

            fetchApplications();

        } catch (error) {

            console.log(
                error.response?.data ||
                error.message
            );

        }

    };

    const getStatusClass = (status) => {

        switch (status) {

            case "Applied":
                return "badge badge-primary";

            case "OA Cleared":
                return "badge badge-info";

            case "Interview":
                return "badge badge-warning";

            case "Selected":
                return "badge badge-success";

            case "Rejected":
                return "badge badge-danger";

            default:
                return "badge";

        }

    };

    const filteredApplications =
        applications.filter((application) => {

            const keyword =
                search.toLowerCase();

            return (

                application.student.name
                    .toLowerCase()
                    .includes(keyword)

                ||

                application.company?.companyName
                    ?.toLowerCase()
                    .includes(keyword)

            );

        });

    if (loading) {

        return <LoadingSpinner />;

    }

    return (

        <div className="page">

            <h1 className="page-title">
                Manage Applications
            </h1>

            <div className="applications-toolbar">

                <input
                    className="input search-input"
                    type="text"
                    placeholder="🔍 Search..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            {filteredApplications.length === 0 ? (

                <EmptyState
                    message="No Applications Found"
                />

            ) : (

                <div className="table-container">

                    <table className="applications-table">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Student</th>

                                <th>Company</th>

                                <th>Status</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredApplications.map(
                                (
                                    application,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            application._id
                                        }
                                    >

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {
                                                application.student.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                application.company
                                                    ?.companyName
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={getStatusClass(
                                                    application.status
                                                )}
                                            >
                                                {
                                                    application.status
                                                }
                                            </span>

                                        </td>

                                        <td className="action-buttons">

                                            <button
                                                className="btn btn-warning"
                                                onClick={() =>
                                                    handleEdit(
                                                        application
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    handleDelete(
                                                        application._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

            <ApplicationForm
                isOpen={isModalOpen}
                onClose={() => {

                    setIsModalOpen(false);

                    setSelectedApplication(null);

                }}
                selectedApplication={selectedApplication}
                fetchApplications={fetchApplications}
            />

        </div>

    );

}

export default Applications;