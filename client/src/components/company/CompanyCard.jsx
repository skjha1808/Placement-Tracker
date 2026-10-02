import "./CompanyCard.css";

import StatusBadge from "./StatusBadge";
import EligibilityBox from "./EligibilityBox";

function CompanyCard({
    company,
    profile,
    eligibility,
    onApply,

}) {

    const getButtonText = () => {

        if (!eligibility)
            return "Checking...";

        if (eligibility.eligible)
            return "Apply Now";

        if (
            eligibility.reason ===
            "Already Applied"
        )
            return "Applied";

        if (
            eligibility.reason ===
            "Applications are closed"
        )
            return "Closed";

        return "Not Eligible";
    };

    return (

        <div className="card company-card">

            <div className="company-header">

                <div className="company-title">

                    <div className="company-avatar">

                        {company.companyName.charAt(0)}

                    </div>

                    <div>

                        <h2>
                            {company.companyName}
                        </h2>

                        <p className="company-role">
                            💼{" "}
                            {company.role
                                ?.split(" ")
                                .map(word =>
                                    word.toUpperCase() === "SDE"
                                        ? "SDE"
                                        : word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                        </p>

                    </div>

                </div>

                <StatusBadge
                    eligibility={eligibility}
                />

            </div>

            <div className="company-info">

                <p>
                    📍 <strong>Location:</strong>{" "}
                    {company.location
                        .split(" ")
                        .map(
                            word =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                </p>

                <p>
                    🎓 <strong>Minimum CGPA:</strong>{" "}
                    {company.minimumCGPA}
                </p>

                <p>
                    🏢 <strong>Branches:</strong>{" "}
                    {company.eligibleBranches
                        .map(branch => branch.toUpperCase())
                        .join(", ")}
                </p>

                <div className="company-highlights">

                    <span className="package-badge">
                        💰 ₹{company.package} LPA
                    </span>

                    <span className="deadline-badge">
                        📅 {new Date(
                            company.applicationDeadline
                        ).toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }
                        )}
                    </span>

                </div>

            </div>

            <EligibilityBox
                company={company}
                profile={profile}
                eligibility={eligibility}
            />

            <button
                className="btn btn-primary company-btn"

                disabled={
                    !eligibility ||
                    !eligibility.eligible
                }

                onClick={() =>
                    onApply(company._id)
                }
            >

                {getButtonText()}

            </button>

        </div>

    );

}

export default CompanyCard;