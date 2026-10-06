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

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [interviewStageFilter, setInterviewStageFilter] =
        useState("All");

    const [selectedStudent, setSelectedStudent] =
        useState(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);


    // =====================================================
    // FETCH APPLICATIONS
    // =====================================================

    const fetchApplications = async () => {
        setLoading(true);

        try {
            const response =
                await api.get("/applications");

            setApplications(
                response.data || []
            );
        } catch (error) {
            console.log(
                error.response?.data ||
                error.message
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchApplications();
    }, []);


    // =====================================================
    // DELETE APPLICATION
    // =====================================================

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Delete this application?"
            )
        ) {
            return;
        }

        try {
            await api.delete(
                `/applications/${id}`
            );

            await fetchApplications();

            alert(
                "Application deleted successfully!"
            );
        } catch (error) {
            console.log(
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete application."
            );
        }
    };


    // =====================================================
    // VIEW STUDENT
    // =====================================================

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setDrawerOpen(true);
    };


    // =====================================================
    // STATUS BADGE
    // =====================================================

    const getStatusClass = (status) => {

        switch (status) {

            case "Applied":
                return "application-status-badge applied";

            case "OA Cleared":
                return "application-status-badge oa-cleared";

            case "Interview":
                return "application-status-badge interview";

            case "Selected":
                return "application-status-badge selected";

            case "Rejected":
                return "application-status-badge rejected";

            default:
                return "application-status-badge";
        }
    };


    // =====================================================
    // FILTER APPLICATIONS
    // =====================================================

    const filteredApplications =
        applications.filter(
            (application) => {

                const keyword =
                    search
                        .trim()
                        .toLowerCase();


                // -----------------------------------------
                // SEARCH
                // -----------------------------------------

                const matchesSearch =
                    (
                        application.student?.name ||
                        ""
                    )
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    (
                        application.company?.companyName ||
                        ""
                    )
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    (
                        application.student?.email ||
                        ""
                    )
                        .toLowerCase()
                        .includes(keyword);


                // -----------------------------------------
                // STATUS FILTER
                // -----------------------------------------

                const matchesStatus =
                    statusFilter === "All" ||
                    application.status ===
                        statusFilter;


                // -----------------------------------------
                // INTERVIEW STAGE FILTER
                // -----------------------------------------

                const matchesInterviewStage =
                    statusFilter !== "Interview" ||

                    interviewStageFilter === "All" ||

                    application.interviewStage ===
                        interviewStageFilter;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesInterviewStage
                );
            }
        );


    // =====================================================
    // STATUS FILTER CHANGE
    // =====================================================

    const handleStatusFilterChange = (
        status
    ) => {

        setStatusFilter(status);

        /*
         * Interview stage filter only makes
         * sense while viewing Interview
         * applications.
         *
         * Reset it whenever another status
         * is selected.
         */

        if (status !== "Interview") {
            setInterviewStageFilter("All");
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return <LoadingSpinner />;
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="applications-page">

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="applications-page-header">

                <div>

                    <span className="applications-eyebrow">
                        APPLICATION MANAGEMENT
                    </span>

                    <h1 className="applications-page-title">
                        Applications
                    </h1>

                    <p className="applications-page-subtitle">
                        Manage student placement applications,
                        track progress, and update interview stages.
                    </p>

                </div>

            </div>


            {/* =====================================
                APPLICATION STATS
            ===================================== */}

            <ApplicationStats
                applications={applications}
            />


            {/* =====================================
                SEARCH + RESULT COUNT
            ===================================== */}

            <div className="applications-toolbar">

                <div className="applications-search-wrapper">

                    <span
                        className="applications-search-icon"
                        aria-hidden="true"
                    >
                        🔍
                    </span>

                    <input
                        className="applications-search-input"
                        type="text"
                        placeholder="Search student, company, or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    {search && (

                        <button
                            type="button"
                            className="applications-search-clear"
                            onClick={() =>
                                setSearch("")
                            }
                            aria-label="Clear search"
                        >
                            ×
                        </button>

                    )}

                </div>


                <div className="applications-result-count">

                    {filteredApplications.length}{" "}

                    {filteredApplications.length === 1
                        ? "application"
                        : "applications"}

                </div>

            </div>


            {/* =====================================
                STATUS FILTERS
            ===================================== */}

            <div className="applications-filter-bar">

                <div className="applications-filter-list">

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
                            type="button"
                            className={
                                statusFilter === status
                                    ? "application-filter-btn active"
                                    : "application-filter-btn"
                            }
                            onClick={() =>
                                handleStatusFilterChange(
                                    status
                                )
                            }
                        >
                            {status}
                        </button>

                    ))}

                </div>


                {/* =================================
                    INTERVIEW STAGE FILTER
                ================================= */}

                {statusFilter === "Interview" && (

                    <div className="applications-interview-filter">

                        <span className="applications-interview-filter-label">
                            Interview Stage
                        </span>


                        <div className="applications-interview-filter-list">

                            {[
                                "All",
                                "Technical",
                                "HR",
                            ].map(
                                (stage) => (

                                    <button
                                        key={stage}
                                        type="button"
                                        className={
                                            interviewStageFilter ===
                                            stage
                                                ? "application-stage-filter-btn active"
                                                : "application-stage-filter-btn"
                                        }
                                        onClick={() =>
                                            setInterviewStageFilter(
                                                stage
                                            )
                                        }
                                    >
                                        {stage}
                                    </button>

                                )
                            )}

                        </div>

                    </div>

                )}

            </div>


            {/* =====================================
                APPLICATION LIST
            ===================================== */}

            {filteredApplications.length === 0 ? (

                <div className="applications-empty-card">

                    <EmptyState
                        message={
                            statusFilter ===
                                "Interview" &&
                            interviewStageFilter !==
                                "All"
                                ? `No ${interviewStageFilter} interview applications found`
                                : "No Applications Found"
                        }
                    />

                </div>

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


            {/* =====================================
                STUDENT DRAWER
            ===================================== */}

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