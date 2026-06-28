const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/jwt");

function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No authorization header provided" });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ success: false, message: "Invalid authorization format. Use: Bearer <token>" });
        }

        const token = parts[1];
        const decoded = jwt.verify(token, SECRET);

        req.userId = decoded.userId;
        req.username = decoded.username;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        return res.status(401).json({ success: false, message: "Authentication failed" });
    }
}

module.exports = { verifyToken };
