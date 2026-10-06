import "./AdminCharts.css";

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
        "#3157d5",
        "#b56a00",
        "#13b3c9",
        "#138a5b",
        "#c83d4d",
    ];


    /*
     * Keep the chart safe even when an older student record
     * does not contain a branch value.
     */
    const safeBranchData = (branchData || []).map(item => {

    const branch =
        typeof item.branch === "string"
            ? item.branch.trim()
            : "";

    return {
        branch:
            !branch ||
            branch.toLowerCase() === "undefined" ||
            branch.toLowerCase() === "null"
                ? "Not Specified"
                : branch,

        count: Number(item.count) || 0,
    };
    });

    <BarChart data={safeBranchData}></BarChart>


    return (

        <div className="admin-chart-grid">

            {/* =====================================================
                APPLICATION STATUS
            ===================================================== */}

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
                            data={statusData || []}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={95}
                            label={({ value }) =>
                                value > 0
                                    ? value
                                    : ""
                            }
                        >

                            {(statusData || []).map(
                                (_, index) => (

                                    <Cell
                                        key={index}
                                        fill={
                                            COLORS[
                                                index %
                                                COLORS.length
                                            ]
                                        }
                                    />

                                )
                            )}

                        </Pie>


                        <Tooltip
                            contentStyle={{
                                background:
                                    "#ffffff",

                                border:
                                    "1px solid #e4e8f0",

                                borderRadius:
                                    "10px",

                                boxShadow:
                                    "0 8px 20px rgba(29, 42, 68, 0.12)",

                                color:
                                    "#172033",
                            }}

                            itemStyle={{
                                color:
                                    "#172033",
                            }}
                        />


                        <Legend
                            verticalAlign="bottom"
                            align="center"
                        />

                    </PieChart>

                </ResponsiveContainer>

            </div>


            {/* =====================================================
                APPLICATIONS BY BRANCH
            ===================================================== */}

            <div className="card chart-card">

                <h3>
                    Applications by Branch
                </h3>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <BarChart
                        data={safeBranchData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 10,
                        }}
                    >

                        <CartesianGrid
                            stroke="#e8ebf2"
                            strokeDasharray="3 3"
                            vertical={false}
                        />


                        <XAxis
                            dataKey="branch"
                            tick={{
                                fill: "#68738a",
                                fontSize: 12,
                            }}
                            axisLine={{
                                stroke: "#dfe4ed",
                            }}
                            tickLine={false}
                        />


                        <YAxis
                            allowDecimals={false}
                            tick={{
                                fill: "#68738a",
                                fontSize: 12,
                            }}
                            axisLine={false}
                            tickLine={false}
                        />


                        <Tooltip
                            cursor={{
                                fill:
                                    "rgba(49, 87, 213, 0.04)",
                            }}

                            contentStyle={{
                                background:
                                    "#ffffff",

                                border:
                                    "1px solid #e4e8f0",

                                borderRadius:
                                    "10px",

                                boxShadow:
                                    "0 8px 20px rgba(29, 42, 68, 0.12)",

                                color:
                                    "#172033",
                            }}

                            labelStyle={{
                                color:
                                    "#172033",

                                fontWeight:
                                    700,

                                marginBottom:
                                    "4px",
                            }}

                            itemStyle={{
                                color:
                                    "#3157d5",
                            }}
                        />


                        <Bar
                            dataKey="count"
                            name="Applications"
                            fill="#3157d5"
                            radius={[
                                8,
                                8,
                                0,
                                0,
                            ]}
                            maxBarSize={80}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}


export default AdminCharts;