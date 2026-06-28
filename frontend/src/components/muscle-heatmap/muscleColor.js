/**
 * Muscle Color Utility
 * Maps muscle activation intensity to display colors.
 * Structured for cross-platform reuse (React / React Native).
 */

const INTENSITY_COLORS = {
  0: '#2f2f2f', // inactive - dark grey
  1: '#facc15', // low - yellow
  2: '#22c55e', // medium - green
  3: '#ef4444', // high - red
};

/**
 * Returns a hex color string for a given muscle activation intensity.
 * @param {number} intensity - 0 (inactive), 1 (low), 2 (medium), 3 (high)
 * @returns {string} Hex color code
 */
export function getMuscleColor(intensity) {
  return INTENSITY_COLORS[intensity] || INTENSITY_COLORS[0];
}

/** Default fill for the body silhouette outline */
export const BODY_OUTLINE_COLOR = '#d1d5db';

/** Default fill for inactive/background body areas */
export const BODY_BASE_COLOR = '#2f2f2f';

/** Head silhouette fill */
export const HEAD_COLOR = '#4a4a4a';

export const MUSCLE_GROUPS_FRONT = [
  'chest_upper',
  'chest_mid',
  'chest_lower',
  'serratus_anterior',
  'delts_front',
  'delts_side',
  'biceps_long',
  'biceps_short',
  'brachialis',
  'brachioradialis',
  'forearm_flexors',
  'forearm_extensors',
  'abs',
  'transverse_abs',
  'obliques_internal',
  'obliques_external',
  'quad_rectus',
  'quad_vastus_lateral',
  'quad_vastus_medial',
  'quad_vastus_inter',
  'adductor_magnus',
  'gracilis',
  'pectineus',
  'tfl',
  'calf_gastro',
  'calf_soleus',
];

/** All back-view muscle group IDs */
export const MUSCLE_GROUPS_BACK = [
  'traps_upper',
  'traps_middle',
  'traps_lower',
  'delts_rear',
  'rotator_cuff',
  'lats',
  'teres_major',
  'rhomboids',
  'triceps_long',
  'triceps_lateral',
  'triceps_medial',
  'erector_spinae',
  'glute_max',
  'glute_med',
  'glute_min',
  'ham_biceps',
  'ham_semitendinosus',
  'ham_semimembranosus',
  'calf_gastro',
  'calf_soleus',
];

/**
 * Exercise-to-muscle mapping for backend compatibility.
 * Values represent activation intensity (1-3).
 */
export const exerciseMuscleMap = {
  bench_press: {
    chest_mid: 2,
    delts_front: 1,
    triceps_lateral: 1,
  },
  squats: {
    quad_rectus: 2,
    quad_vastus_lateral: 2,
    quad_vastus_medial: 2,
    glute_max: 2,
    ham_biceps: 1,
  },
  deadlift: {
    erector_spinae: 3,
    ham_biceps: 2,
    glute_max: 2,
    traps_middle: 1,
    lats: 1,
    forearm_flexors: 1,
  },
  overhead_press: {
    delts_front: 3,
    triceps_lateral: 1,
  },
  barbell_row: {
    lats: 2,
    delts_rear: 1,
    biceps_long: 1,
    biceps_short: 1,
    traps_middle: 1,
  },
  bicep_curl: {
    biceps_long: 3,
    biceps_short: 3,
    forearm_flexors: 1,
  },
  tricep_pushdown: {
    triceps_lateral: 3,
    triceps_medial: 3,
  },
  leg_press: {
    quad_rectus: 3,
    quad_vastus_lateral: 3,
    quad_vastus_medial: 3,
    glute_max: 1,
  },
  calf_raise: {
    calf_gastro: 3,
    calf_soleus: 3,
  },
  lat_pulldown: {
    lats: 3,
    biceps_long: 1,
    biceps_short: 1,
  },
  crunches: {
    abs: 3,
    obliques_external: 1,
  },
};
