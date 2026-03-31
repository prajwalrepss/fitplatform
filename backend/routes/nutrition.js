const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const nutritionController = require("../controllers/nutrition");

// All routes require authentication
router.use(verifyToken);

// Get user's nutrition plan
router.get("/plan", nutritionController.getNutritionPlan);

// Update nutrition plan
router.put("/plan", nutritionController.updateNutritionPlan);

// Get today's nutrition log
router.get("/today", nutritionController.getTodayLog);

// Log a meal
router.post("/log-meal", nutritionController.logMeal);

// Get nutrition history (last 7 days)
router.get("/history", nutritionController.getHistory);

// Delete a meal
router.delete("/meal/:mealId", nutritionController.deleteMeal);

module.exports = router;
