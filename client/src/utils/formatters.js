// Remove leading/trailing spaces and convert multiple spaces into one
export const normalizeSpaces = (value = "") => {
    return value.trim().replace(/\s+/g, " ");
};

// Name Formatter
export const formatName = (name = "") => {
    return normalizeSpaces(name)
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
};

// Company Formatter
export const formatCompanyName = (company = "") => {
    return normalizeSpaces(company);
};

// Location Formatter
export const formatLocation = (location = "") => {
    return normalizeSpaces(location)
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
};

// Role Formatter
export const formatRole = (role = "") => {
    return normalizeSpaces(role)
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
};

// Skills Formatter
export const formatSkills = (skills = "") => {
    return skills
        .split(",")
        .map(skill => normalizeSpaces(skill))
        .filter(Boolean)
        .join(", ");
};