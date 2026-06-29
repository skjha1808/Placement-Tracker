const studentMiddleware = (req, res, next) => {

    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Access denied. Students only.",
        });
    }

    next();
};

module.exports = studentMiddleware;