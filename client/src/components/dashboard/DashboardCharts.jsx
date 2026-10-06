import StatusPieChart from "./StatusPieChart";
import ApplicationsBarChart from "./ApplicationsBarChart";

function DashboardCharts({ stats }) {

    return (

        <div className="charts-grid">

            <StatusPieChart
                stats={stats}
            />

            <ApplicationsBarChart
                stats={stats}
            />

        </div>

    );

}

export default DashboardCharts;