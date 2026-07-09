import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Applications.css";
import ApplicationForm from "../../components/forms/ApplicationForm";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const fetchApplications = async () => {
        setLoading(true);

        try {
            const response = await api.get("/applications");
            setApplications(response.data);
        } catch (error) {
            console.log(error.response?.data || error.message);
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
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this application?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/applications/${id}`);

            alert("Application deleted successfully!");

            fetchApplications();

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="applications-container">
            <h1 className="applications-title">
                Manage Applications
            </h1>

            {loading ? (
                <h3 className="no-applications">
                    Loading...
                </h3>
            ) : applications.length === 0 ? (
                <h3 className="no-applications">
                    No Applications Found
                </h3>
            ) : (
                <table className="applications-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Student</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {applications.map((application, index) => (
                            <tr key={application._id}>
                                <td>{index + 1}</td>

                                <td>{application.student.name}</td>

                                <td>{application.company?.companyName}</td>

                                <td>{application.status}</td>

                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEdit(application)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(application._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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