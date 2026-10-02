const isValidPDF = (buffer) => {
    if (!buffer || buffer.length < 5) {
        return false;
    }

    return buffer.subarray(0, 5).toString() === "%PDF-";
};

module.exports = isValidPDF;