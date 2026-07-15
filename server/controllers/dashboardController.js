const Student = require("../models/Student");
const Company = require("../models/Company");
const Application = require("../models/Application");

const getAdminDashboard = async (req, res) => {

    try {

        const totalStudents =
            await Student.countDocuments();

        const totalCompanies =
            await Company.countDocuments();

        const applications = (
            await Application.find()
                .populate("student")
                .populate("company")
                .sort({ createdAt: -1 })
        ).filter(app => app.company);

        const stats = {

            students: totalStudents,

            companies: totalCompanies,

            applications: applications.length,

            selected: applications.filter(
                app => app.status === "Selected"
            ).length,

        };

        const statusData = [

            {
                name: "Applied",
                value: applications.filter(
                    app => app.status === "Applied"
                ).length,
            },

            {
                name: "OA Cleared",
                value: applications.filter(
                    app => app.status === "OA Cleared"
                ).length,
            },

            {
                name: "Interview",
                value: applications.filter(
                    app => app.status === "Interview"
                ).length,
            },

            {
                name: "Selected",
                value: applications.filter(
                    app => app.status === "Selected"
                ).length,
            },

            {
                name: "Rejected",
                value: applications.filter(
                    app => app.status === "Rejected"
                ).length,
            },

        ];

        const branchMap = {};

        applications.forEach(app => {

            const branch = app.student.branch;

            branchMap[branch] =
                (branchMap[branch] || 0) + 1;

        });

        const branchData =
            Object.keys(branchMap).map(

                branch => ({

                    branch,

                    count: branchMap[branch],

                })

            );

        const recentActivities =
            applications.slice(0, 5);

        res.status(200).json({

            stats,

            statusData,

            branchData,

            recentActivities,

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};

module.exports = {

    getAdminDashboard,

};