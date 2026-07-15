import { useState } from "react";
import "./ApplicationRow.css";
import api from "../../services/api";

function ApplicationRow({

    application,

    getStatusClass,

    fetchApplications,

    onDelete,

    onViewStudent,

}) {

    const [status, setStatus] = useState(
        application.status
    );

    const [updating, setUpdating] =
        useState(false);

    const handleUpdate = async () => {

        try {

            setUpdating(true);

            await api.put(
                `/applications/${application._id}`,
                {
                    status,
                }
            );

            alert(
                "Application updated successfully!"
            );

            fetchApplications();

        } catch (error) {

            console.log(
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to update application."
            );

        } finally {

            setUpdating(false);

        }

    };

    return (

        <div className="card application-row">

            <div className="application-row-header">

                <div className="student-avatar">

                    {application.student.name
                        .charAt(0)
                        .toUpperCase()}

                </div>

                <div className="student-details">

                    <h3
                        className="student-name"
                        onClick={() =>
                            onViewStudent(
                                application.student
                            )
                        }
                    >

                        {application.student.name}

                    </h3>

                    <p>

                        🏢 {application.company?.companyName}

                    </p>

                </div>

            </div>

            <div className="application-row-body">

                <div>

                    <label>

                        Current Status

                    </label>

                    <select

                        className="input"

                        value={status}

                        onChange={(e) =>
                            setStatus(
                                e.target.value
                            )
                        }

                    >

                        <option>
                            Applied
                        </option>

                        <option>
                            OA Cleared
                        </option>

                        <option>
                            Interview
                        </option>

                        <option>
                            Selected
                        </option>

                        <option>
                            Rejected
                        </option>

                    </select>

                </div>

                <span
                    className={getStatusClass(
                        status
                    )}
                >
                    {status}
                </span>

            </div>

            <div className="application-row-actions">

                <button

                    className="btn btn-primary"

                    disabled={updating}

                    onClick={handleUpdate}

                >

                    {updating
                        ? "Updating..."
                        : "Update"}

                </button>

                <button

                    className="btn btn-danger"

                    onClick={() =>
                        onDelete(
                            application._id
                        )
                    }

                >

                    Delete

                </button>

            </div>

        </div>

    );

}

export default ApplicationRow;