const jwt = require("jsonwebtoken");
const User = require("../Models/Users");

const errorResponse = (res, status, message) => {
    return res.status(status).json({ message });
};

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse(res, 401, "Not authorized, no token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return errorResponse(res, 401, "Not authorized, token missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.user?.id) {
            return errorResponse(res, 401, "Invalid token payload");
        }

        const user = await User.findById(decoded.user.id).select("-password");

        if (!user) {
            return errorResponse(res, 401, "User not found, authorization failed");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);

        if (error.name === "TokenExpiredError") {
            return errorResponse(res, 401, "Token expired, please login again");
        }

        return errorResponse(res, 401, "Not authorized, invalid token");
    }
};

const admin = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return errorResponse(res, 403, "User not authenticated");
    }

    if (req.user.role !== "admin") {
        return errorResponse(res, 403, "Not authorized as an admin");
    }

    next();
};

module.exports = { protect, admin };
