/**
 * Muscle Data Controller
 *
 * Aggregates workout muscle activation data for the heatmap.
 * Returns BOTH raw loads and intensity levels.
 */

const WorkoutSession = require("../models/WorkoutSession");
const { calculateMuscleLoad, toIntensityLevels } = require("../utils/muscleEngine");

/**
 * Parse a range string into a Date.
 *   "today"  → start of today
 *   "7d"     → 7 days ago
 *   "30d"    → 30 days ago
 *   "all"    → epoch
 */
function parseRange(range) {
    const now = new Date();

    if (range === "today") {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        return start;
    }

    if (range === "all") {
        return new Date(0);
    }

    // Parse "Nd" format (default 7d)
    const match = (range || "7d").match(/^(\d+)d$/);
    const days = match ? parseInt(match[1], 10) : 7;

    const start = new Date(now);
    start.setDate(start.getDate() - days);
    return start;
}

/**
 * GET /muscle?range=7d
 * GET /muscle?range=today
 * GET /muscle?range=30d
 * GET /muscle?range=all
 *
 * Unified muscle data endpoint.
 */
exports.getMuscleData = async (req, res, next) => {
    try {
        const range = req.query.range || "7d";
        const since = parseRange(range);

        const workouts = await WorkoutSession.find({
            userId: req.userId,
            startedAt: { $gte: since },
        }).sort({ startedAt: -1 });

        // Aggregate raw loads across all workouts
        const raw = {};

        workouts.forEach((workout) => {
            const sessionLoad = calculateMuscleLoad(workout.exercises);
            Object.entries(sessionLoad).forEach(([muscle, load]) => {
                raw[muscle] = (raw[muscle] || 0) + load;
            });
        });

        const intensity = toIntensityLevels(raw);

        res.json({
            success: true,
            data: {
                raw,
                intensity,
                workoutCount: workouts.length,
                range,
                since: since.toISOString(),
            },
        });
    } catch (error) {
        next(error);
    }
};
