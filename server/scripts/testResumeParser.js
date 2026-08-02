// Development utility for testing PDF parsing.
// Not used by the application.

const dotenv = require("dotenv");
const path = require("path");

const { parseResume } = require("../utils/resumeParser");

dotenv.config();

const testParser = async () => {
    try {

        const resumePath = path.join(
            __dirname,
            "../uploads/resumes/1783689348003.pdf"
        );

        const text = await parseResume(resumePath);

        console.log(text);

    } catch (error) {
        console.error(error.message);
    }
};

testParser();