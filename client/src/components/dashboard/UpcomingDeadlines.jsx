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
                    .filter((company) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const deadline = new Date(company.applicationDeadline);
                        deadline.setHours(0, 0, 0, 0);

                        return deadline >= today;
                    })
                    .sort((a, b) => {
                        const dateDiff =
                            new Date(a.applicationDeadline) -
                            new Date(b.applicationDeadline);

                        if (dateDiff !== 0) {
                            return dateDiff;
                        }

                        return a.companyName.localeCompare(b.companyName);
                    })
                    .slice(0, 5)
                    .map((company) => (

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