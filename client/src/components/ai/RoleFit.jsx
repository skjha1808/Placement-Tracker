import "./RoleFit.css";

function RoleFit({ analysis }) {

    const roleFit = analysis?.roleFit || [];

    return (
        <div className="role-fit-card">

            <h3>Role Fit</h3>

            <p className="role-fit-description">
                AI-powered recommendations showing how well your resume
                matches different software engineering roles.
            </p>

            <div className="role-fit-list">

                {roleFit.map((item) => (

                    <div
                        className="role-fit-item"
                        key={item.role}
                    >

                        <div className="role-fit-header">

                            <span className="role-fit-role">
                                {item.role}
                            </span>

                            <strong className="role-fit-match">
                                {item.match}%
                            </strong>

                        </div>

                        <div className="role-fit-progress">

                            <div
                                className="role-fit-progress-bar"
                                style={{
                                    width: `${item.match}%`,
                                }}
                            ></div>

                        </div>

                        <p className="role-fit-reason">
                            {item.reason}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default RoleFit;