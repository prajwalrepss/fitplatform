const WorkoutSession = require("../models/WorkoutSession");
const DailyNutritionLog = require("../models/DailyNutritionLog");
const NutritionPlan = require("../models/NutritionPlan");
const HydrationLog = require("../models/HydrationLog");
const ScheduledSession = require("../models/ScheduledSession");

// Get all dashboard metrics in one request
exports.getMetrics = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch all data in parallel
        const [nutritionLog, nutritionPlan, hydrationLog, todayWorkouts, allWorkouts, upcomingSessions] = await Promise.all([
            DailyNutritionLog.findOne({ userId, date: today }),
            NutritionPlan.findOne({ userId }),
            HydrationLog.findOne({ userId, date: today }),
            WorkoutSession.find({
                userId,
                startedAt: { $gte: today, $lt: tomorrow },
            }),
            WorkoutSession.find({ userId }).sort({ startedAt: -1 }).limit(30),
            ScheduledSession.find({
                userId,
                scheduledDate: { $gte: new Date() },
                completed: false,
            }).sort({ scheduledDate: 1 }).limit(3),
        ]);

        // Calculate calories
        const caloriesConsumed = nutritionLog?.caloriesConsumed || 0;
        const calorieTarget = nutritionPlan?.calorieTarget || 2500;

        // Calculate active minutes (today)
        const activeMinutes = todayWorkouts.reduce((sum, workout) => sum + (workout.activeMinutes || 0), 0);

        // Calculate workout streak
        const streak = calculateWorkoutStreak(allWorkouts);

        // Calculate hydration
        const currentWaterMl = hydrationLog?.totalWaterMl || 0;
        const hydrationGoalMl = 3000; // Could be made user-configurable

        const metrics = {
            calories: {
                consumed: caloriesConsumed,
                target: calorieTarget,
                percentage: Math.round((caloriesConsumed / calorieTarget) * 100),
            },
            activeMinutes: {
                today: activeMinutes,
                goal: 60,
                percentage: Math.round((activeMinutes / 60) * 100),
            },
            workoutStreak: {
                current: streak.current,
                best: streak.best,
            },
            hydration: {
                current: currentWaterMl,
                goal: hydrationGoalMl,
                percentage: Math.round((currentWaterMl / hydrationGoalMl) * 100),
            },
            upcomingSessions: upcomingSessions.map(session => ({
                id: session._id,
                title: session.title,
                scheduledDate: session.scheduledDate,
                duration: session.duration,
                type: session.type,
            })),
        };

        res.json(metrics);
    } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
        res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
};

// Helper function to calculate workout streak
function calculateWorkoutStreak(workouts) {
    if (!workouts || workouts.length === 0) {
        return { current: 0, best: 0 };
    }

    // Get unique workout dates (ignoring time)
    const workoutDates = workouts.map(w => {
        const date = new Date(w.startedAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    });

    const uniqueDates = [...new Set(workoutDates)].sort((a, b) => b - a);

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();

    // Check if there's a workout today or yesterday to start the streak
    if (uniqueDates[0] === todayTime || uniqueDates[0] === yesterdayTime) {
        currentStreak = 1;
        let expectedDate = uniqueDates[0] - (24 * 60 * 60 * 1000); // Previous day

        for (let i = 1; i < uniqueDates.length; i++) {
            if (uniqueDates[i] === expectedDate) {
                currentStreak++;
                expectedDate -= (24 * 60 * 60 * 1000);
            } else {
                break;
            }
        }
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
        const dayDiff = (uniqueDates[i - 1] - uniqueDates[i]) / (24 * 60 * 60 * 1000);

        if (dayDiff === 1) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
        } else {
            tempStreak = 1;
        }
    }

    bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

    return { current: currentStreak, best: bestStreak };
}
