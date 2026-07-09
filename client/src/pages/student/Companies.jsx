import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Companies.css";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

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

            await api.post("/applications", {
                company: companyId,
                notes: "",
            });

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

    if (loading) {

        return <LoadingSpinner />;

    }

    return (

        <div className="page">

            <h1 className="page-title">
                Available Companies
            </h1>

            {companies.length === 0 ? (

                <EmptyState
                    message="No Companies Available"
                />

            ) : (

                <div className="companies-grid">

                    {companies.map((company) => (

                        <div
                            key={company._id}
                            className="card company-card"
                        >

                            <div className="company-header">

                                <h2>
                                    {company.companyName}
                                </h2>

                                <span
                                    className={
                                        company.status === "Open"
                                            ? "badge badge-success"
                                            : "badge badge-danger"
                                    }
                                >
                                    {company.status}
                                </span>

                            </div>

                            <div className="company-info">

                                <p>
                                    💼 <strong>Role:</strong> {company.role}
                                </p>

                                <p>
                                    💰 <strong>Package:</strong> ₹{company.package} LPA
                                </p>

                                <p>
                                    📍 <strong>Location:</strong> {company.location}
                                </p>

                                <p>
                                    🎓 <strong>Min CGPA:</strong> {company.minimumCGPA}
                                </p>

                                <p>
                                    🏢 <strong>Branches:</strong>{" "}
                                    {company.eligibleBranches.join(", ")}
                                </p>

                                <p>
                                    📅 <strong>Deadline:</strong>{" "}
                                    {new Date(
                                        company.applicationDeadline
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>

                            </div>

                            <button
                                className="btn btn-primary company-btn"
                                onClick={() =>
                                    handleApply(company._id)
                                }
                            >
                                Apply Now
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Companies;