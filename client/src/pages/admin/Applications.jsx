import { useEffect, useState } from "react";
import api from "../../services/api";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import ApplicationRow from "../../components/admin/ApplicationRow";
import ApplicationStats from "../../components/admin/ApplicationStats";
import StudentDrawer from "../../components/admin/StudentDrawer";

import "./Applications.css";

function Applications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    
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

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this application?"
            )
        ) return;

        try {

            await api.delete(`/applications/${id}`);

            alert(
                "Application deleted successfully!"
            );

            fetchApplications();

        } catch (error) {

            console.log(
                error.response?.data ||
                error.message
            );

        }

    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setDrawerOpen(true);
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

        const keyword = search.toLowerCase();

        const matchesSearch =

            application.student.name
                .toLowerCase()
                .includes(keyword)

            ||

            application.company?.companyName
                ?.toLowerCase()
                .includes(keyword);

        const matchesStatus =

            statusFilter === "All"

            ||

            application.status === statusFilter;

        return matchesSearch && matchesStatus;

    });

    if (loading) {
        return <LoadingSpinner />;
    }

    return (

        <div className="page">

            <h1 className="page-title">
                Manage Applications
            </h1>

            <ApplicationStats
                applications={applications}
            />

            <div className="status-filters">

                {[
                    "All",
                    "Applied",
                    "OA Cleared",
                    "Interview",
                    "Selected",
                    "Rejected",
                ].map((status) => (

                    <button

                        key={status}

                        className={
                            statusFilter === status
                                ? "filter-btn active"
                                : "filter-btn"
                        }

                        onClick={() =>
                            setStatusFilter(status)
                        }

                    >

                        {status}

                    </button>

                ))}

            </div>

            <div className="applications-toolbar">

                <input

                    className="input search-input"

                    type="text"

                    placeholder="🔍 Search Student or Company..."

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

                <div className="applications-grid">

                    {filteredApplications.map(
                        (application) => (

                            <ApplicationRow

                                key={
                                    application._id
                                }

                                application={
                                    application
                                }

                                getStatusClass={
                                    getStatusClass
                                }

                                fetchApplications={
                                    fetchApplications
                                }

                                onDelete={
                                    handleDelete
                                }

                                onViewStudent={
                                    handleViewStudent
                                }

                            />

                        )
                    )}

                </div>

            )}

            <StudentDrawer

                isOpen={drawerOpen}

                onClose={() => {

                    setDrawerOpen(false);

                    setSelectedStudent(null);

                }}

                student={selectedStudent}

            />

        </div>

    );

}

export default Applications;