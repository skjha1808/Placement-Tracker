const formatText = (text) => {
    return text
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
};

const formatRole = (role) => {
    return role
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word) =>
            word.toUpperCase() === "SDE"
                ? "SDE"
                : word.charAt(0).toUpperCase() +
                  word.slice(1).toLowerCase()
        )
        .join(" ");
};

const formatBranches = (branches) => {
    return branches.map((branch) =>
        branch.trim().toUpperCase()
    );
};

module.exports = {
    formatText,
    formatRole,
    formatBranches,
};