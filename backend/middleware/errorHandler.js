/**
 * Central Error Handler Middleware
 *
 * Catches unhandled errors and returns standardized JSON:
 *   { success: false, message: "..." }
 */

function errorHandler(err, req, res, _next) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            details: messages,
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            success: false,
            message: `Duplicate value for '${field}'`,
        });
    }

    // Mongoose cast error (invalid ObjectId etc.)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired" });
    }

    // Default server error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
    });
}

module.exports = errorHandler;
