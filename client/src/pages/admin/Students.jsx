import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import StudentDrawer from "../../components/admin/StudentDrawer";
import "./Students.css";

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const fetchStudents = async () => {
        setLoading(true);

        try {
            const response = await api.get("/students");
            setStudents(response.data || []);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleVerify = async (id) => {
        try {
            await api.put(`/students/${id}/verify`);

            await fetchStudents();

            alert("Student verified successfully!");
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setSelectedStudent(null);
        setIsDrawerOpen(false);
    };

    const searchText = search.trim().toLowerCase();

    const filteredStudents = students.filter((student) => {
        const name = (student.name || "").toLowerCase();
        const email = (student.email || "").toLowerCase();

        return (
            name.includes(searchText) ||
            email.includes(searchText)
        );
    });

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="students-page">

            {/* Page Header */}
            <div className="students-page-header">

                <div>
                    <span className="students-eyebrow">
                        STUDENT MANAGEMENT
                    </span>

                    <h1 className="students-page-title">
                        Students
                    </h1>

                    <p className="students-page-subtitle">
                        View, verify, and manage registered students.
                    </p>
                </div>

                <div className="students-summary">
                    <span className="students-summary-label">
                        Total Students
                    </span>

                    <strong className="students-summary-value">
                        {students.length}
                    </strong>
                </div>

            </div>

            {/* Toolbar */}
            <div className="students-toolbar">

                <div className="students-search-wrapper">

                    <span
                        className="students-search-icon"
                        aria-hidden="true"
                    >
                        🔍
                    </span>

                    <input
                        className="students-search-input"
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            className="students-search-clear"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}

                </div>

                <div className="students-result-count">
                    {filteredStudents.length}{" "}
                    {filteredStudents.length === 1
                        ? "student"
                        : "students"}
                </div>

            </div>

            {/* Students Table */}
            {filteredStudents.length === 0 ? (

                <div className="students-empty-card">
                    <EmptyState message="No Students Found" />
                </div>

            ) : (

                <div className="students-table-card">

                    <div className="students-table-wrapper">

                        <table className="students-table">

                            <thead>
                                <tr>
                                    <th className="student-index-column">
                                        #
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Branch
                                    </th>

                                    <th>
                                        CGPA
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th className="student-action-column">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredStudents.map(
                                    (student, index) => {

                                        const initials =
                                            student.name
                                                ?.trim()
                                                ?.charAt(0)
                                                ?.toUpperCase() || "?";

                                        return (
                                            <tr
                                                key={student._id}
                                            >

                                                <td className="student-index">
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <div className="student-name-cell">

                                                        <div className="student-table-avatar">
                                                            {initials}
                                                        </div>

                                                        <div className="student-name-details">

                                                            <strong>
                                                                {student.name ||
                                                                    "Unnamed Student"}
                                                            </strong>

                                                            <span>
                                                                Student
                                                            </span>

                                                        </div>

                                                    </div>
                                                </td>

                                                <td className="student-email">
                                                    {student.email || "—"}
                                                </td>

                                                <td>
                                                    {student.branch || "—"}
                                                </td>

                                                <td>
                                                    {student.cgpa !==
                                                        undefined &&
                                                    student.cgpa !==
                                                        null &&
                                                    student.cgpa !== ""
                                                        ? student.cgpa
                                                        : "—"}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`student-status-badge ${
                                                            student.isVerified
                                                                ? "verified"
                                                                : "pending"
                                                        }`}
                                                    >
                                                        <span className="student-status-dot" />

                                                        {student.isVerified
                                                            ? "Verified"
                                                            : "Pending"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="student-actions">

                                                        <button
                                                            type="button"
                                                            className="student-action-btn student-view-btn"
                                                            onClick={() =>
                                                                handleViewStudent(
                                                                    student
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        {!student.isVerified && (
                                                            <button
                                                                type="button"
                                                                className="student-action-btn student-verify-btn"
                                                                onClick={() =>
                                                                    handleVerify(
                                                                        student._id
                                                                    )
                                                                }
                                                            >
                                                                Verify
                                                            </button>
                                                        )}

                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

            {/* Student Drawer */}
            <StudentDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                student={selectedStudent}
            />

        </div>
    );
}

export default Students;