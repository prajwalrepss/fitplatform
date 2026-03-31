const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboard");

// All routes require authentication
router.use(verifyToken);

// Get aggregated dashboard metrics
router.get("/metrics", dashboardController.getMetrics);

module.exports = router;
