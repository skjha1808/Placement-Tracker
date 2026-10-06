import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./CompanyDetails.css";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

function CompanyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await api.get("/companies");

                const companies = response.data.companies || [];
                const found = companies.find((item) => item._id === id);

                if (!found) {
                    setMessage("Company opportunity not found.");
                    return;
                }

                setCompany(found);
            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                        "Unable to load company details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, [id]);

    if (loading) {
        return (
            <div className="company-details-page company-details-loading">
                Loading company details…
            </div>
        );
    }

    if (!company) {
        return (
            <div className="company-details-page">
                <button
                    className="company-back"
                    onClick={() => navigate("/applications")}
                >
                    ← Back to applications
                </button>

                <div className="company-details-empty">
                    <strong>{message || "Company not found."}</strong>
                    <span>
                        The opportunity may no longer be available.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="company-details-page">
            <button
                className="company-back"
                onClick={() => navigate("/applications")}
            >
                ← Back to applications
            </button>

            <header className="company-details-header">
                <div className="company-details-identity">
                    <div className="company-details-logo">
                        {company.companyName?.charAt(0)}
                    </div>

                    <div>
                        <span className="company-eyebrow">
                            PLACEMENT OPPORTUNITY
                        </span>

                        <h1>{company.companyName}</h1>

                        <p>
                            {company.role} · {company.location} ·{" "}
                            {company.jobType}
                        </p>
                    </div>
                </div>

                <div className="company-status">
                    {company.status}
                </div>
            </header>

            <section className="company-details-grid">
                <article className="company-details-card">
                    <span className="company-section-label">
                        ROLE DETAILS
                    </span>

                    <h2>{company.role}</h2>

                    <div className="company-detail-list">
                        <div>
                            <small>Package</small>
                            <strong>₹{company.package} LPA</strong>
                        </div>

                        <div>
                            <small>Location</small>
                            <strong>{company.location}</strong>
                        </div>

                        <div>
                            <small>Job type</small>
                            <strong>{company.jobType}</strong>
                        </div>

                        <div>
                            <small>Minimum CGPA</small>
                            <strong>{company.minimumCGPA}+</strong>
                        </div>
                    </div>
                </article>

                <article className="company-details-card">
                    <span className="company-section-label">
                        APPLICATION
                    </span>

                    <h2>Application details</h2>

                    <div className="company-detail-list">
                        <div>
                            <small>Application deadline</small>
                            <strong>
                                {formatDate(company.applicationDeadline)}
                            </strong>
                        </div>

                        <div>
                            <small>Eligible branches</small>
                            <strong>
                                {company.eligibleBranches?.join(", ") ||
                                    "Not specified"}
                            </strong>
                        </div>

                        <div>
                            <small>Status</small>
                            <strong>{company.status}</strong>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default CompanyDetails;