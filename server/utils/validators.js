const isPositiveNumber = (value) => {
    return typeof value === "number" && value >= 0;
};

const isValidCGPA = (cgpa) => {
    return typeof cgpa === "number" && cgpa >= 0 && cgpa <= 10;
};

const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return new Date(date) >= today;
};

module.exports = {
    isPositiveNumber,
    isValidCGPA,
    isFutureDate,
};