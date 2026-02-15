const express = require("express");
const router = express.Router();
const ExerciseSet = require("../models/ExerciseSet");
const { verifyToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(verifyToken);

// POST /sets/add - Log a new set with PR detection
router.post("/add", async (req, res) => {
    try {
        const userId = req.userId;
        const { exerciseId, weight, reps, sets } = req.body;

        // Validate input
        if (!exerciseId || weight == null || !reps || !sets) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Calculate volume and 1RM estimate (Epley formula)
        const volume = weight * reps * sets;
        const oneRepMaxEstimate = weight * (1 + reps / 30);

        // Get previous bests for this exercise
        const previousSets = await ExerciseSet.find({ userId, exerciseId });

        let bestWeight = 0;
        let bestVolume = 0;
        let best1RM = 0;

        if (previousSets.length > 0) {
            bestWeight = Math.max(...previousSets.map(s => s.weight));
            bestVolume = Math.max(...previousSets.map(s => s.volume));
            best1RM = Math.max(...previousSets.map(s => s.oneRepMaxEstimate));
        }

        // Check if this is a PR
        const isPR = weight > bestWeight || volume > bestVolume || oneRepMaxEstimate > best1RM;

        // Save the new set
        const exerciseSet = new ExerciseSet({
            userId,
            exerciseId,
            weight,
            reps,
            sets,
            volume,
            oneRepMaxEstimate,
        });

        await exerciseSet.save();

        // Calculate new records
        const newRecords = {
            bestWeight: Math.max(bestWeight, weight),
            bestVolume: Math.max(bestVolume, volume),
            best1RM: Math.max(best1RM, oneRepMaxEstimate),
        };

        res.status(201).json({
            message: isPR ? "New personal record! 🎉" : "Set logged successfully",
            isPR,
            newRecords,
            set: exerciseSet,
        });
    } catch (error) {
        console.error("Error adding set:", error);
        res.status(500).json({ error: "Failed to add set" });
    }
});

// GET /sets/history/:exerciseId - Get all sets for an exercise
router.get("/history/:exerciseId", async (req, res) => {
    try {
        const userId = req.userId;
        const { exerciseId } = req.params;

        const sets = await ExerciseSet.find({ userId, exerciseId }).sort({ createdAt: 1 });

        res.json({
            count: sets.length,
            sets,
        });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// GET /sets/best/:exerciseId - Get best records for an exercise
router.get("/best/:exerciseId", async (req, res) => {
    try {
        const userId = req.userId;
        const { exerciseId } = req.params;

        const sets = await ExerciseSet.find({ userId, exerciseId });

        if (sets.length === 0) {
            return res.json({
                bestWeight: 0,
                bestVolume: 0,
                best1RM: 0,
            });
        }

        const bestWeight = Math.max(...sets.map(s => s.weight));
        const bestVolume = Math.max(...sets.map(s => s.volume));
        const best1RM = Math.max(...sets.map(s => s.oneRepMaxEstimate));

        res.json({
            bestWeight,
            bestVolume,
            best1RM,
        });
    } catch (error) {
        console.error("Error fetching best records:", error);
        res.status(500).json({ error: "Failed to fetch best records" });
    }
});

// GET /sets/progress/:exerciseId - Get volume progress over time
router.get("/progress/:exerciseId", async (req, res) => {
    try {
        const userId = req.userId;
        const { exerciseId } = req.params;

        const sets = await ExerciseSet.find({ userId, exerciseId }).sort({ createdAt: 1 });

        const chartData = sets.map(set => ({
            date: set.createdAt,
            volume: set.volume,
            weight: set.weight,
            oneRepMax: set.oneRepMaxEstimate,
        }));

        res.json(chartData);
    } catch (error) {
        console.error("Error fetching progress:", error);
        res.status(500).json({ error: "Failed to fetch progress" });
    }
});

module.exports = router;
