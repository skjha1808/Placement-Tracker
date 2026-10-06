import "./ApplicationCard.css";

import ApplicationTimeline from "./ApplicationTimeline";

function ApplicationCard({

    application,

    getStatusClass,

}) {

    return (

        <div className="card application-card">

            <div className="application-header">

                <div className="application-title">

                    <div className="application-avatar">

                        {application.company.companyName.charAt(0)}

                    </div>

                    <div>

                        <h2>

                            {application.company.companyName}

                        </h2>

                        <p className="application-role">

                            {application.company.role}

                        </p>

                    </div>

                </div>

                <span
                    className={getStatusClass(
                        application.status
                    )}
                >
                    {application.status}
                </span>

            </div>

            <ApplicationTimeline
                status={application.status}
            />

            <div className="application-highlights">

                <span className="package-badge">

                    💰 ₹{application.company.package} LPA

                </span>

                <span className="date-badge">

                    📅 {new Date(
                        application.appliedDate
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

            <button
                className="btn btn-primary application-btn"
            >
                View Company
            </button>

        </div>

    );

}

export default ApplicationCard;