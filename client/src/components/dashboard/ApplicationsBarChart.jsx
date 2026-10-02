import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

function ApplicationsBarChart({ stats }) {

    const data = [

        {
            status: "Applied",
            count: stats.applied,
        },

        {
            status: "Interview",
            count: stats.interview,
        },

        {
            status: "Selected",
            count: stats.selected,
        },

        {
            status: "Rejected",
            count: stats.rejected,
        },

    ];

    return (

        <div className="chart-card">

            <h2>
                Status Overview
            </h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart data={data}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="status"
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="count"
                        fill="#2563eb"
                        radius={[6,6,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default ApplicationsBarChart;