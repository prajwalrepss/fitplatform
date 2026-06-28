/**
 * Centralized Muscle Constants
 *
 * Single source of truth for muscle name → heatmap SVG ID mapping.
 * Used by muscleEngine, routes, and any future analytics.
 */

const MUSCLE_MAP = {
    // Upper body — Front
    chest:      ["chest_left", "chest_right"],
    shoulders:  ["shoulders_left", "shoulders_right"],
    biceps:     ["biceps_left", "biceps_right"],
    triceps:    ["triceps_left", "triceps_right"],
    forearms:   ["forearms_left", "forearms_right"],

    // Upper body — Back
    back:       ["lats_left", "lats_right"],
    lats:       ["lats_left", "lats_right"],
    traps:      ["traps"],
    rear_delts: ["rear_delts_left", "rear_delts_right"],

    // Core
    core:       ["abs_upper", "abs_lower", "obliques_left", "obliques_right"],
    abs:        ["abs_upper", "abs_lower"],
    obliques:   ["obliques_left", "obliques_right"],

    // Lower body
    quads:      ["quads_left", "quads_right"],
    hamstrings: ["hamstrings_left", "hamstrings_right"],
    glutes:     ["glutes_left", "glutes_right"],
    calves:     ["calves_left", "calves_right"],

    // Compound
    lower_back: ["lower_back"],
};

/**
 * All valid heatmap muscle IDs (flat list).
 * Useful for validation and initializing empty load maps.
 */
const ALL_HEATMAP_IDS = [
    "chest_left", "chest_right",
    "shoulders_left", "shoulders_right",
    "biceps_left", "biceps_right",
    "triceps_left", "triceps_right",
    "forearms_left", "forearms_right",
    "lats_left", "lats_right",
    "traps",
    "rear_delts_left", "rear_delts_right",
    "abs_upper", "abs_lower",
    "obliques_left", "obliques_right",
    "quads_left", "quads_right",
    "hamstrings_left", "hamstrings_right",
    "glutes_left", "glutes_right",
    "calves_left", "calves_right",
    "lower_back",
];

/**
 * Intensity thresholds for converting raw load → 0–3 level.
 */
const INTENSITY_THRESHOLDS = {
    LOW: 4,     // 1–4   → level 1
    MEDIUM: 8,  // 5–8   → level 2
    //  9+      → level 3
};

module.exports = { MUSCLE_MAP, ALL_HEATMAP_IDS, INTENSITY_THRESHOLDS };
