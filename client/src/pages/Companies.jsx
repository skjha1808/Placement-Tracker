import { useState, useEffect } from "react";
import api from "../services/api";

function Companies() {
    const [companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies");
            setCompanies(response.data);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleApply = async (companyId) => {
        try {
            await api.post(
                "/applications",
                {
                    company: companyId,
                    notes: "",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Applied Successfully!");

        } catch (error) {
            console.log(error.response?.data || error.message);
            alert(
                error.response?.data?.message ||
                "Failed to apply."
            );
        }
    };
    
    return (
        <div>
            <h1>Available Companies</h1>

            {companies.map((company) => (
                <div
                    key={company._id}
                    style={{
                        border: "1px solid black",
                        padding: "10px",
                        marginBottom: "15px",
                    }}
                >
                    <h2>{company.companyName}</h2>

                    <p>
                        <strong>Role:</strong>{" "}
                        {company.role}
                    </p>

                    <p>
                        <strong>Package:</strong>{" "}
                        {company.package} LPA
                    </p>

                    <p>
                        <strong>Location:</strong>{" "}
                        {company.location}
                    </p>

                    <p>
                        <strong>Eligible Branches:</strong>{" "}
                        {company.eligibleBranches.join(", ")}
                    </p>

                    <p>
                        <strong>Minimum CGPA:</strong>{" "}
                        {company.minimumCGPA}
                    </p>

                    <p>
                        <strong>Deadline:</strong>{" "}
                        {new Date(
                            company.applicationDeadline
                        ).toLocaleDateString()}
                    </p>

                    <button
                       onClick={() => handleApply(company._id)}
                    >
                       Apply
                    </button>

                </div>
            ))}
        </div>
    );
}

export default Companies;