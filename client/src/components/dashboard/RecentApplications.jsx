function RecentApplications({

    applications,

}) {

    return (

        <div className="dashboard-card">

            <h3>

                🕒 Recent Applications

            </h3>

            {

                applications.length === 0 ?

                (

                    <p>

                        No applications yet.

                    </p>

                )

                :

                applications
                    .slice(0,5)
                    .map((app)=>(

                        <div
                            key={app._id}
                            className="recent-item"
                        >

                            <strong>

                                {
                                    app.company
                                        ?.companyName
                                }

                            </strong>

                            <span>

                                {
                                    app.status
                                }

                            </span>

                        </div>

                    ))

            }

        </div>

    );

}

export default RecentApplications;