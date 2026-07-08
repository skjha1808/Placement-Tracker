import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Students.css";

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = async () => {
        setLoading(true);

        try {
            const response = await api.get(
                "/students",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setStudents(response.data);
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
            await api.put(
                `/students/${id}/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Student verified successfully!");

            fetchStudents();
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="students-container">
            <h1 className="students-title">
                Manage Students
            </h1>

            {loading ? (
                <h3 className="no-students">
                    Loading...
                </h3>
            ) : students.length === 0 ? (
                <h3 className="no-students">
                    No Students Found
                </h3>
            ) : (
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Branch</th>
                            <th>CGPA</th>
                            <th>Verified</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student._id}>
                                <td>{index + 1}</td>

                                <td>{student.name}</td>

                                <td>{student.email}</td>

                                <td>{student.branch}</td>

                                <td>{student.cgpa}</td>

                                <td>
                                    {student.isVerified ? (
                                        <span className="verified-text">
                                            ✅ Verified
                                        </span>
                                    ) : (
                                        <span className="pending-text">
                                            ❌ Pending
                                        </span>
                                    )}
                                </td>

                                <td>
                                    {!student.isVerified ? (
                                        <button
                                            className="verify-btn"
                                            onClick={() =>
                                                handleVerify(student._id)
                                            }
                                        >
                                            Verify
                                        </button>
                                    ) : (
                                        <button
                                            className="verified-btn"
                                            disabled
                                        >
                                            Verified
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Students;