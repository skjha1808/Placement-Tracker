const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Student = require("../models/Student");

const {
    formatName,
    formatBranches,
} = require("../utils/formatters");

dotenv.config();

const formatExistingStudents = async () => {
    try {
        await connectDB();

        const students = await Student.find();

        let updatedCount = 0;

        for (const student of students) {
            const formattedName = formatName(student.name);

            const formattedBranch = student.branch
                ? formatBranches([student.branch])[0]
                : student.branch;

            let updated = false;

            if (student.name !== formattedName) {
                student.name = formattedName;
                updated = true;
            }

            if (student.branch !== formattedBranch) {
                student.branch = formattedBranch;
                updated = true;
            }

            if (updated) {
                await student.save();
                updatedCount++;
            }
        }

        console.log(`${updatedCount} student(s) updated successfully.`);
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

formatExistingStudents();