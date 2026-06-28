/**
 * Centralized Muscle Constants
 *
 * Single source of truth for muscle name → heatmap SVG ID mapping.
 * Used by muscleEngine, routes, and any future analytics.
 */

const MUSCLE_MAP = {
    // Upper body — Front
    chest:      ["chest_upper", "chest_mid", "chest_lower", "serratus_anterior"],
    shoulders:  ["delts_front", "delts_side", "delts_rear", "rotator_cuff"],
    biceps:     ["biceps_long", "biceps_short", "brachialis", "brachioradialis"],
    triceps:    ["triceps_long", "triceps_lateral", "triceps_medial"],
    forearms:   ["forearm_flexors", "forearm_extensors"],

    // Upper body — Back
    back:       ["lats", "teres_major", "rhomboids", "traps_upper", "traps_middle", "traps_lower", "erector_spinae"],
    lats:       ["lats", "teres_major"],
    traps:      ["traps_upper", "traps_middle", "traps_lower"],
    rear_delts: ["delts_rear"],

    // Core
    core:       ["abs", "obliques_internal", "obliques_external", "transverse_abs", "iliopsoas"],
    abs:        ["abs", "transverse_abs"],
    obliques:   ["obliques_internal", "obliques_external"],

    // Lower body
    quads:      ["quad_rectus", "quad_vastus_lateral", "quad_vastus_medial", "quad_vastus_inter"],
    hamstrings: ["ham_biceps", "ham_semitendinosus", "ham_semimembranosus"],
    glutes:     ["glute_max", "glute_med", "glute_min"],
    calves:     ["calf_gastro", "calf_soleus"],

    // Compound
    lower_back: ["erector_spinae"],
};

/**
 * All valid heatmap muscle IDs (flat list).
 * Useful for validation and initializing empty load maps.
 */
const ALL_HEATMAP_IDS = [
    "chest_upper", "chest_mid", "chest_lower", "serratus_anterior",
    "delts_front", "delts_side", "delts_rear", "rotator_cuff",
    "biceps_long", "biceps_short", "brachialis", "brachioradialis",
    "triceps_long", "triceps_lateral", "triceps_medial",
    "forearm_flexors", "forearm_extensors",
    "lats", "teres_major", "rhomboids", "traps_upper", "traps_middle", "traps_lower", "erector_spinae",
    "abs", "obliques_internal", "obliques_external", "transverse_abs", "iliopsoas",
    "glute_max", "glute_med", "glute_min",
    "quad_rectus", "quad_vastus_lateral", "quad_vastus_medial", "quad_vastus_inter",
    "ham_biceps", "ham_semitendinosus", "ham_semimembranosus",
    "adductor_magnus", "gracilis", "pectineus", "tfl",
    "calf_gastro", "calf_soleus",
    "neck_scm", "neck_posterior",
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
