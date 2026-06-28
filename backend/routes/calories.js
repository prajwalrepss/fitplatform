const express = require("express");
const router = express.Router();
const CalorieEntry = require("../models/CalorieEntry");
const { verifyToken } = require("../middleware/auth");

// Apply authentication middleware to all calorie routes
router.use(verifyToken);

// Helper function to normalize date to midnight (00:00:00)
function normalizeDate(date = new Date()) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
}

// POST /calories/add - Add or update today's entry
router.post("/add", async (req, res) => {
    try {
        const { calories = 0, protein = 0, carbs = 0, fats = 0, notes } = req.body;
        const userId = req.userId;
        const today = normalizeDate();

        // Try to find existing entry for today
        let entry = await CalorieEntry.findOne({ userId, date: today });

        if (entry) {
            // Entry exists - increment values
            entry.calories += calories;
            entry.protein += protein;
            entry.carbs += carbs;
            entry.fats += fats;
            if (notes) {
                entry.notes = entry.notes ? `${entry.notes}; ${notes}` : notes;
            }
            await entry.save();
        } else {
            // Create new entry
            entry = new CalorieEntry({
                userId,
                date: today,
                calories,
                protein,
                carbs,
                fats,
                notes,
            });
            await entry.save();
        }

        res.json({
            message: "Calorie entry updated successfully",
            entry,
        });
    } catch (error) {
        console.error("Error adding calorie entry:", error);
        res.status(500).json({ error: "Failed to add calorie entry" });
    }
});

// GET /calories/today - Get today's entry
router.get("/today", async (req, res) => {
    try {
        const userId = req.userId;
        const today = normalizeDate();

        const entry = await CalorieEntry.findOne({ userId, date: today });

        if (!entry) {
            // Return zeros if no entry exists
            return res.json({
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
                notes: "",
                date: today,
            });
        }

        res.json(entry);
    } catch (error) {
        console.error("Error fetching today's entry:", error);
        res.status(500).json({ error: "Failed to fetch today's entry" });
    }
});

// GET /calories/history - Get historical entries
router.get("/history", async (req, res) => {
    try {
        const userId = req.userId;
        let days = parseInt(req.query.days) || 30;

        // Limit max to 365 days
        if (days > 365) {
            days = 365;
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const entries = await CalorieEntry.find({
            userId,
            date: { $gte: startDate },
        })
            .sort({ date: -1 })
            .limit(days);

        res.json({
            count: entries.length,
            days: days,
            entries,
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// GET /calories/summary - Get summary statistics
router.get("/summary", async (req, res) => {
    try {
        const userId = req.userId;

        // Last 30 days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);

        const entries = await CalorieEntry.find({
            userId,
            date: { $gte: startDate },
        });

        // Calculate totals
        const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);
        const totalProtein = entries.reduce((sum, e) => sum + e.protein, 0);
        const totalCarbs = entries.reduce((sum, e) => sum + e.carbs, 0);
        const totalFats = entries.reduce((sum, e) => sum + e.fats, 0);

        // Calculate average per day
        const daysWithData = entries.length;
        const avgCaloriesPerDay = daysWithData > 0 ? totalCalories / daysWithData : 0;

        res.json({
            period: "Last 30 days",
            daysWithData,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFats,
            avgCaloriesPerDay: Math.round(avgCaloriesPerDay),
        });
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
});

// GET /calories/last7days - Get last 7 days of calorie data
router.get("/last7days", async (req, res) => {
    try {
        const userId = req.userId;
        const days = 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const entries = await CalorieEntry.find({
            userId,
            date: { $gte: startDate },
        })
            .sort({ date: 1 })
            .limit(days);

        res.json({
            count: entries.length,
            days: days,
            entries,
        });
    } catch (error) {
        console.error("Error fetching last 7 days:", error);
        res.status(500).json({ error: "Failed to fetch last 7 days data" });
    }
});

module.exports = router;

