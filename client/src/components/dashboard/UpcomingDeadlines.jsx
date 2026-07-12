function UpcomingDeadlines({

    companies,

}) {

    return (

        <div className="dashboard-card">

            <h3>

                📅 Upcoming Deadlines

            </h3>

            {

                companies
                    .slice(0,5)
                    .map((company)=>(

                        <div
                            key={company._id}
                            className="recent-item"
                        >

                            <strong>

                                {
                                    company.companyName
                                }

                            </strong>

                            <span>

                                {

                                    new Date(
                                        company.applicationDeadline
                                    ).toLocaleDateString()

                                }

                            </span>

                        </div>

                    ))

            }

        </div>

    );

}

export default UpcomingDeadlines;