const express = require("express");
const router = express.Router();
const WorkoutSession = require("../models/WorkoutSession");
const { verifyToken } = require("../middleware/auth");

// Apply authentication middleware to all analytics routes
router.use(verifyToken);

// Helper function to get week number
function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// GET /analytics/muscles - Aggregate muscle usage across history
router.get("/muscles", async (req, res) => {
    try {
        const userId = req.userId;

        // Get all sessions for the user
        const sessions = await WorkoutSession.find({ userId });

        // Aggregate muscle loads
        const muscleStats = {};

        sessions.forEach(session => {
            // muscleLoad is a Map in MongoDB
            const muscleLoad = session.muscleLoad;

            if (muscleLoad) {
                // Convert Map to object if needed
                const loadObj = muscleLoad instanceof Map ? Object.fromEntries(muscleLoad) : muscleLoad;

                Object.entries(loadObj).forEach(([muscle, load]) => {
                    if (!muscleStats[muscle]) {
                        muscleStats[muscle] = {
                            totalLoad: 0,
                            sessions: 0
                        };
                    }
                    muscleStats[muscle].totalLoad += load;
                    muscleStats[muscle].sessions += 1;
                });
            }
        });

        res.json(muscleStats);
    } catch (error) {
        console.error("Error fetching muscle analytics:", error);
        res.status(500).json({ error: "Failed to fetch muscle analytics" });
    }
});

// GET /analytics/weekly - Show weekly workout frequency
router.get("/weekly", async (req, res) => {
    try {
        const userId = req.userId;

        const sessions = await WorkoutSession.find({ userId }).sort({ startedAt: 1 });

        // Group by week
        const weeklyStats = {};

        sessions.forEach(session => {
            const week = getWeekNumber(session.startedAt);

            if (!weeklyStats[week]) {
                weeklyStats[week] = {
                    week: week,
                    sessions: 0,
                    totalMinutes: 0
                };
            }

            weeklyStats[week].sessions += 1;
            weeklyStats[week].totalMinutes += Math.round(session.durationSeconds / 60);
        });

        // Convert to array and sort
        const weeklyArray = Object.values(weeklyStats).sort((a, b) =>
            a.week.localeCompare(b.week)
        );

        res.json(weeklyArray);
    } catch (error) {
        console.error("Error fetching weekly analytics:", error);
        res.status(500).json({ error: "Failed to fetch weekly analytics" });
    }
});

// GET /analytics/exercises/top - Most used exercises
router.get("/exercises/top", async (req, res) => {
    try {
        const userId = req.userId;

        // Use MongoDB aggregation pipeline
        const topExercises = await WorkoutSession.aggregate([
            // Match user's sessions
            { $match: { userId: userId } },
            // Unwind exercises array
            { $unwind: "$exercises" },
            // Group by exercise and count
            {
                $group: {
                    _id: "$exercises",
                    count: { $sum: 1 }
                }
            },
            // Sort by count descending
            { $sort: { count: -1 } },
            // Limit to top 10
            { $limit: 10 },
            // Format output
            {
                $project: {
                    _id: 0,
                    exerciseId: "$_id",
                    count: 1
                }
            }
        ]);

        res.json(topExercises);
    } catch (error) {
        console.error("Error fetching top exercises:", error);
        res.status(500).json({ error: "Failed to fetch top exercises" });
    }
});

// GET /analytics/streak - Calculate workout streak
router.get("/streak", async (req, res) => {
    try {
        const userId = req.userId;

        // Get all sessions sorted by date
        const sessions = await WorkoutSession.find({ userId })
            .sort({ startedAt: -1 })
            .select('startedAt');

        if (sessions.length === 0) {
            return res.json({ currentStreak: 0, longestStreak: 0 });
        }

        // Extract unique dates (normalized to day)
        const uniqueDates = [...new Set(
            sessions.map(s => {
                const d = new Date(s.startedAt);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            })
        )].sort((a, b) => b - a); // Sort descending (newest first)

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 1;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if current streak is active (workout today or yesterday)
        const mostRecentDate = uniqueDates[0];
        const isStreakActive = mostRecentDate === today.getTime() ||
            mostRecentDate === yesterday.getTime();

        if (isStreakActive) {
            currentStreak = 1;

            // Calculate current streak
            for (let i = 1; i < uniqueDates.length; i++) {
                const dayDiff = (uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24);

                if (dayDiff === 1) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }

        // Calculate longest streak
        for (let i = 1; i < uniqueDates.length; i++) {
            const dayDiff = (uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24);

            if (dayDiff === 1) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 1;
            }
        }

        longestStreak = Math.max(longestStreak, currentStreak, tempStreak);

        res.json({
            currentStreak,
            longestStreak
        });
    } catch (error) {
        console.error("Error calculating streak:", error);
        res.status(500).json({ error: "Failed to calculate streak" });
    }
});

// GET /analytics/summary - Overall statistics
router.get("/summary", async (req, res) => {
    try {
        const userId = req.userId;

        // Use aggregation pipeline for efficiency
        const summaryStats = await WorkoutSession.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalMinutes: { $sum: { $divide: ["$durationSeconds", 60] } },
                    firstWorkout: { $min: "$startedAt" },
                    lastWorkout: { $max: "$startedAt" },
                    allExercises: { $push: "$exercises" }
                }
            }
        ]);

        if (summaryStats.length === 0) {
            return res.json({
                totalWorkouts: 0,
                totalMinutes: 0,
                avgMinutesPerWorkout: 0,
                uniqueExercisesUsed: 0,
                firstWorkoutDate: null,
                lastWorkoutDate: null
            });
        }

        const stats = summaryStats[0];

        // Flatten and get unique exercises
        const allExercises = stats.allExercises.flat();
        const uniqueExercises = new Set(allExercises);

        const summary = {
            totalWorkouts: stats.totalWorkouts,
            totalMinutes: Math.round(stats.totalMinutes),
            avgMinutesPerWorkout: Math.round(stats.totalMinutes / stats.totalWorkouts),
            uniqueExercisesUsed: uniqueExercises.size,
            firstWorkoutDate: stats.firstWorkout,
            lastWorkoutDate: stats.lastWorkout
        };

        res.json(summary);
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
});

module.exports = router;
