const formatText = (text = "") => {
    return text
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
};

const formatName = formatText;

const formatCompanyName = (companyName = "") => {
    return formatText(companyName);
};

const formatLocation = (location = "") => {
    return formatText(location);
};

const formatRole = (role = "") => {
    return formatText(role)
        .split(" ")
        .map(word => (word === "Sde" ? "SDE" : word))
        .join(" ");
};

const formatBranches = (branches = []) => {
    const branchMap = {
        IT: "IT",
        CSE: "CSE",
        CSAI: "CSAI",
        AIDS: "AIDS",
        ECE: "ECE",
        EE: "EE",
        CE: "CE",
        ME: "ME",
    };

    return branches
        .map(branch => branch.trim().toUpperCase())
        .filter(Boolean)
        .map(branch => branchMap[branch] || branch);
};

module.exports = {
    formatName,
    formatCompanyName,
    formatLocation,
    formatText,
    formatRole,
    formatBranches,
};