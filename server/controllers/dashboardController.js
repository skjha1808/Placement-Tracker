const Student = require("../models/Student");
const Company = require("../models/Company");
const Application = require("../models/Application");

const getAdminDashboard = async (req, res) => {
    try {
        const [
            totalStudents,
            totalCompanies,
            applications,
        ] = await Promise.all([
            Student.countDocuments(),
            Company.countDocuments(),
            Application.find()
                .populate("student", "name branch")
                .populate("company", "companyName")
                .sort({ createdAt: -1 }),
        ]);

        const validApplications = applications.filter(
            app => app.company
        );

        const stats = {
            students: totalStudents,
            companies: totalCompanies,
            applications: validApplications.length,
            selected: validApplications.filter(
                app => app.status === "Selected"
            ).length,
        };

        const statusCount = {};

        validApplications.forEach(app => {
            statusCount[app.status] =
                (statusCount[app.status] || 0) + 1;
        });

        const statusData = [
            { name: "Applied", value: statusCount["Applied"] || 0 },
            { name: "OA Cleared", value: statusCount["OA Cleared"] || 0 },
            { name: "Interview", value: statusCount["Interview"] || 0 },
            { name: "Selected", value: statusCount["Selected"] || 0 },
            { name: "Rejected", value: statusCount["Rejected"] || 0 },
        ];

        const branchMap = {};

        validApplications.forEach(app => {
            if (!app.student) return;

            branchMap[app.student.branch] =
                (branchMap[app.student.branch] || 0) + 1;
        });

        const branchData = Object.keys(branchMap).map(branch => ({
            branch,
            count: branchMap[branch],
        }));

        const recentActivities =
            validApplications.slice(0, 5);

        return res.status(200).json({
            success: true,
            stats,
            statusData,
            branchData,
            recentActivities,
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard data.",
        });
    }
};

module.exports = {
    getAdminDashboard,
};