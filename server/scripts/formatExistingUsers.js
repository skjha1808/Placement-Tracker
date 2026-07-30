const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const { formatName } = require("../utils/formatters");

dotenv.config();

const formatExistingUsers = async () => {
    try {
        await connectDB();

        const users = await User.find();

        let updatedCount = 0;

        for (const user of users) {
            const formattedName = formatName(user.name);

            let updated = false;

            if (user.name !== formattedName) {
                user.name = formattedName;
                updated = true;
            }

            if (updated) {
                await user.save();
                updatedCount++;
            }
        }

        console.log(`${updatedCount} user(s) updated successfully.`);
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

formatExistingUsers();