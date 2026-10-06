import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = [
    "#3b82f6",
    "#f59e0b",
    "#22c55e",
    "#ef4444",
];

function StatusPieChart({ stats }) {

    const data = [

        {
            name: "Applied",
            value: stats.applied,
        },

        {
            name: "Interview",
            value: stats.interview,
        },

        {
            name: "Selected",
            value: stats.selected,
        },

        {
            name: "Rejected",
            value: stats.rejected,
        },

    ];

    return (

        <div className="chart-card">

            <h2>
                Applications Distribution
            </h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                        label
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={
                                    COLORS[
                                        index %
                                        COLORS.length
                                    ]
                                }
                            />

                        ))}

                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}

export default StatusPieChart;