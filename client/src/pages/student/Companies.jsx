import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Companies.css";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {
        setLoading(true);

        try {
            const response = await api.get("/companies");
            setCompanies(response.data);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
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
                }
            );

            alert("Applied Successfully!");

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to apply."
            );
        }
    };

    return (
        <div className="companies-container">

            <h1 className="companies-title">
                Available Companies
            </h1>

            {loading ? (
                <h3 className="loading-text">
                    Loading...
                </h3>
            ) : companies.length === 0 ? (
                <h3 className="no-companies">
                    No Companies Available
                </h3>
            ) : (
                companies.map((company) => (
                    <div
                        key={company._id}
                        className="company-card"
                    >
                        <h2 className="company-name">
                            {company.companyName}
                        </h2>

                        <p>
                            <strong>Role:</strong>{" "}
                            {company.role}
                        </p>

                        <p>
                            <strong>Package:</strong>{" "}
                            ₹{company.package} LPA
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
                            <strong>Status:</strong>{" "}
                            <span className="status-open">
                                {company.status}
                            </span>
                        </p>

                        <p>
                            <strong>Deadline:</strong>{" "}
                            {new Date(
                                company.applicationDeadline
                            ).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        </p>

                        <button
                            className="apply-btn"
                            onClick={() =>
                                handleApply(company._id)
                            }
                        >
                            Apply
                        </button>
                    </div>
                ))
            )}

        </div>
    );
}

export default Companies;