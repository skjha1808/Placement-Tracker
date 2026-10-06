function EligibilityBox({

    company,
    profile,
    eligibility,

}) {

    if (!eligibility)
        return null;

    const cgpaEligible =
        profile?.cgpa >= company.minimumCGPA;

    const branchEligible =
        company.eligibleBranches.some(
            branch =>
                branch.toLowerCase() ===
                profile?.branch?.toLowerCase()
        );

    const resumeUploaded =
        !!profile?.resume;

    return (

        <div className="eligibility-box">

            <h4>
                Eligibility
            </h4>

            <div className="eligibility-status">

                {

                    eligibility.eligible ? (

                        <span className="eligible">

                            🟢 Eligible

                        </span>

                    ) :

                    eligibility.reason ===
                    "Already Applied" ? (

                        <span className="applied">

                            🟡 Already Applied

                        </span>

                    ) :

                    eligibility.reason ===
                    "Applications are closed" ? (

                        <span className="closed">

                            ⚫ Applications Closed

                        </span>

                    ) : (

                        <span className="not-eligible">

                            🔴 Not Eligible

                        </span>

                    )

                }

            </div>

            <p className="eligibility-reason">

                {eligibility.reason}

            </p>

            <div className="eligibility-checklist">

                <div>

                    {cgpaEligible ? "✅" : "❌"}

                    {" "}

                    CGPA Requirement

                </div>

                <div>

                    {branchEligible ? "✅" : "❌"}

                    {" "}

                    Branch Eligible

                </div>

                <div>

                    {resumeUploaded ? "✅" : "❌"}

                    {" "}

                    Resume Uploaded

                </div>

            </div>

        </div>

    );

}

export default EligibilityBox;