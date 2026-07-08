import { useEffect, useState } from "react";
import api from "../../services/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);

    const fetchApplications = async () => {
        try {
            const response = await api.get(
                "/applications/my",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setApplications(response.data);

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div>
            <h1>My Applications</h1>

            {applications.map((application) => (
                <div
                    key={application._id}
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        marginBottom: "15px",
                    }}
                >
                    <h2>
                        {application.company.companyName}
                    </h2>

                    <p>
                        <strong>Role:</strong>{" "}
                        {application.company.role}
                    </p>

                    <p>
                        <strong>Package:</strong>{" "}
                        {application.company.package} LPA
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {application.status}
                    </p>

                    <p>
                        <strong>Applied On:</strong>{" "}
                        {new Date(
                            application.appliedDate
                        ).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default MyApplications;