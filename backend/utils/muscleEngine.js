/**
 * Muscle Activation Engine
 *
 * Maps exercises → heatmap-compatible muscle IDs and computes
 * per-muscle activation loads from workout session data.
 *
 * Scoring:  primary muscle  → +2 per completed set
 *           secondary muscle → +1 per completed set
 *
 * Returns BOTH raw totals AND intensity levels (0–3).
 */

const exercises = require("../data/exercises");
const { MUSCLE_MAP, INTENSITY_THRESHOLDS } = require("../constants/muscles");

// ---------------------------------------------------------------------------
// Resolve generic muscle name → heatmap SVG IDs
// ---------------------------------------------------------------------------
function resolveToHeatmapIds(muscleName) {
    if (MUSCLE_MAP[muscleName]) {
        return MUSCLE_MAP[muscleName];
    }
    // Already a heatmap-level ID — pass through
    return [muscleName];
}

/**
 * Look up an exercise by its id or name (case-insensitive).
 */
function findExercise(exerciseIdOrName) {
    const lower = (exerciseIdOrName || "").toLowerCase();
    return exercises.find(
        (e) => e.id === exerciseIdOrName || e.name.toLowerCase() === lower
    );
}

/**
 * Calculate raw muscle load from an array of workout exercises.
 *
 * @param {Array} workoutExercises — [{ exerciseId, exerciseName, sets: [{ reps, weight, completed }] }]
 * @returns {Object} raw muscle load — { chest_left: 12, ... }
 */
function calculateMuscleLoad(workoutExercises) {
    const load = {};

    if (!Array.isArray(workoutExercises)) return load;

    workoutExercises.forEach((wEx) => {
        const ex = findExercise(wEx.exerciseId) || findExercise(wEx.exerciseName);
        if (!ex) return;

        // Count completed sets
        const setCount = Array.isArray(wEx.sets)
            ? wEx.sets.filter((s) => s.completed !== false).length
            : 1;

        // Use heatmap arrays if available, otherwise fall back to generic
        const primaryIds =
            ex.primary && ex.primary.length > 0
                ? ex.primary
                : resolveToHeatmapIds(ex.primaryMuscle);

        const secondaryIds =
            ex.secondary && ex.secondary.length > 0
                ? ex.secondary
                : (ex.secondaryMuscles || []).flatMap(resolveToHeatmapIds);

        // Primary = +2 per set
        primaryIds.forEach((id) => {
            load[id] = (load[id] || 0) + 2 * setCount;
        });

        // Secondary = +1 per set
        secondaryIds.forEach((id) => {
            load[id] = (load[id] || 0) + 1 * setCount;
        });
    });

    return load;
}

/**
 * Convert raw muscle loads to intensity levels (0–3).
 *
 * @param {Object} rawLoad — { chest_left: 12, ... }
 * @returns {Object} intensities — { chest_left: 3, ... }
 */
function toIntensityLevels(rawLoad) {
    const levels = {};

    Object.entries(rawLoad).forEach(([muscle, value]) => {
        if (value <= 0) levels[muscle] = 0;
        else if (value <= INTENSITY_THRESHOLDS.LOW) levels[muscle] = 1;
        else if (value <= INTENSITY_THRESHOLDS.MEDIUM) levels[muscle] = 2;
        else levels[muscle] = 3;
    });

    return levels;
}

/**
 * Full computation — returns BOTH raw data and intensity levels.
 *
 * @param {Array} workoutExercises
 * @returns {{ raw: Object, intensity: Object }}
 */
function computeMuscleData(workoutExercises) {
    const raw = calculateMuscleLoad(workoutExercises);
    const intensity = toIntensityLevels(raw);
    return { raw, intensity };
}

module.exports = {
    resolveToHeatmapIds,
    findExercise,
    calculateMuscleLoad,
    toIntensityLevels,
    computeMuscleData,
};
