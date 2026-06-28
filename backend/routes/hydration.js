const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const hydrationController = require("../controllers/hydration");

// All routes require authentication
router.use(verifyToken);

// Get today's hydration
router.get("/today", hydrationController.getTodayHydration);

// Add water
router.post("/add", hydrationController.addWater);

// Get hydration history (last 7 days)
router.get("/history", hydrationController.getHistory);

module.exports = router;
