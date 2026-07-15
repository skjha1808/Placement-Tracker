import "./AdminCharts.css";
// import { Legend } from "recharts";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

function AdminCharts({

    statusData,

    branchData,

}) {

    const COLORS = [

        "#2563eb",

        "#f59e0b",

        "#06b6d4",

        "#22c55e",

        "#ef4444",

    ];

    return (

        <div className="admin-chart-grid">

            <div className="card chart-card">

                <h3>

                    Application Status

                </h3>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <PieChart>

                        <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={95}
                            label={({ value }) => value > 0 ? value : ""}
                        >

                            {statusData.map(
                                (_, index) => (

                                    <Cell

                                        key={index}

                                        fill={
                                            COLORS[index]
                                        }

                                    />

                                )
                            )}

                        </Pie>

                        <Tooltip
                            contentStyle={{
                                background: "#2a2a2e",
                                border: "1px solid #3b82f6",
                                borderRadius: "10px",
                            }}
                        />

                        <Legend verticalAlign="bottom" align="center" />

                    </PieChart>

                </ResponsiveContainer>

            </div>

            <div className="card chart-card">

                <h3>
                    Applications by Branch
                </h3>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <BarChart
                        data={branchData}
                    >

                        <CartesianGrid
                            stroke="#444"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="branch"
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="count"
                            fill="#2563eb"
                            radius={[8, 8, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default AdminCharts;