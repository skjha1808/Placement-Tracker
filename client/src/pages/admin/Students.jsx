import { useEffect, useState } from "react";
import api from "../../services/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import "./Students.css";

function Students() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchStudents = async () => {

        setLoading(true);

        try {

            const response = await api.get("/students");

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

            await api.put(`/students/${id}/verify`);

            alert("Student verified successfully!");

            fetchStudents();

        } catch (error) {

            console.log(
                error.response?.data || error.message
            );

        }

    };

    const filteredStudents = students.filter((student) =>
        student.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {

        return <LoadingSpinner />;

    }

    return (

        <div className="page">

            <h1 className="page-title">
                Manage Students
            </h1>

            <div className="students-toolbar">

                <input
                    className="input search-input"
                    type="text"
                    placeholder="🔍 Search student..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            {filteredStudents.length === 0 ? (

                <EmptyState
                    message="No Students Found"
                />

            ) : (

                <div className="table-container">

                    <table className="students-table">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Branch</th>

                                <th>CGPA</th>

                                <th>Status</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredStudents.map(
                                (
                                    student,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            student._id
                                        }
                                    >

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {
                                                student.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.email
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.branch
                                            }
                                        </td>

                                        <td>
                                            {
                                                student.cgpa
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    student.isVerified
                                                        ? "badge badge-success"
                                                        : "badge badge-warning"
                                                }
                                            >

                                                {student.isVerified
                                                    ? "Verified"
                                                    : "Pending"}

                                            </span>

                                        </td>

                                        <td>

                                            {!student.isVerified ? (

                                                <button
                                                    className="btn btn-success"
                                                    onClick={() =>
                                                        handleVerify(
                                                            student._id
                                                        )
                                                    }
                                                >

                                                    Verify

                                                </button>

                                            ) : (

                                                <button
                                                    className="btn"
                                                    disabled
                                                >

                                                    Verified

                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}

export default Students;