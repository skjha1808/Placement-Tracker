const pdfParse = require("pdf-parse");

const parseResume = async (pdfBuffer) => {
    try {
        const data = await pdfParse(pdfBuffer);

        const text = data.text
            .replace(/\r\n/g, "\n")
            .replace(/\n{2,}/g, "\n")
            .replace(/[ \t]{2,}/g, " ")
            .trim();

        return text;
    } catch (error) {
        console.error("PDF Parse Error:", error);
        throw new Error("Failed to parse resume PDF.");
    }
};

module.exports = {
    parseResume,
};