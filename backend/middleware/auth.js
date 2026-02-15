const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/jwt");

function verifyToken(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "No authorization header provided" });
        }

        // Expected format: "Bearer <token>"
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ error: "Invalid authorization format. Use: Bearer <token>" });
        }

        const token = parts[1];

        // Verify the token
        const decoded = jwt.verify(token, SECRET);

        // Attach userId to request object
        req.userId = decoded.userId;
        req.username = decoded.username;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(401).json({ error: "Authentication failed" });
    }
}

module.exports = { verifyToken };
