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

/** All front-view muscle group IDs */
export const MUSCLE_GROUPS_FRONT = [
  'chest_left',
  'chest_right',
  'shoulders_left',
  'shoulders_right',
  'biceps_left',
  'biceps_right',
  'forearms_left',
  'forearms_right',
  'abs_upper',
  'abs_lower',
  'obliques_left',
  'obliques_right',
  'quads_left',
  'quads_right',
  'calves_left',
  'calves_right',
];

/** All back-view muscle group IDs */
export const MUSCLE_GROUPS_BACK = [
  'traps',
  'rear_delts_left',
  'rear_delts_right',
  'lats_left',
  'lats_right',
  'triceps_left',
  'triceps_right',
  'lower_back',
  'glutes_left',
  'glutes_right',
  'hamstrings_left',
  'hamstrings_right',
  'calves_left',
  'calves_right',
];

/**
 * Exercise-to-muscle mapping for backend compatibility.
 * Values represent activation intensity (1-3).
 */
export const exerciseMuscleMap = {
  bench_press: {
    chest_left: 2,
    chest_right: 2,
    shoulders_left: 1,
    shoulders_right: 1,
    triceps_left: 1,
    triceps_right: 1,
  },
  squats: {
    quads_left: 2,
    quads_right: 2,
    glutes_left: 2,
    glutes_right: 2,
    hamstrings_left: 1,
    hamstrings_right: 1,
  },
  deadlift: {
    lower_back: 3,
    hamstrings_left: 2,
    hamstrings_right: 2,
    glutes_left: 2,
    glutes_right: 2,
    traps: 1,
    lats_left: 1,
    lats_right: 1,
    forearms_left: 1,
    forearms_right: 1,
  },
  overhead_press: {
    shoulders_left: 3,
    shoulders_right: 3,
    triceps_left: 1,
    triceps_right: 1,
  },
  barbell_row: {
    lats_left: 2,
    lats_right: 2,
    rear_delts_left: 1,
    rear_delts_right: 1,
    biceps_left: 1,
    biceps_right: 1,
    traps: 1,
  },
  bicep_curl: {
    biceps_left: 3,
    biceps_right: 3,
    forearms_left: 1,
    forearms_right: 1,
  },
  tricep_pushdown: {
    triceps_left: 3,
    triceps_right: 3,
  },
  leg_press: {
    quads_left: 3,
    quads_right: 3,
    glutes_left: 1,
    glutes_right: 1,
  },
  calf_raise: {
    calves_left: 3,
    calves_right: 3,
  },
  lat_pulldown: {
    lats_left: 3,
    lats_right: 3,
    biceps_left: 1,
    biceps_right: 1,
  },
  crunches: {
    abs_upper: 3,
    abs_lower: 2,
    obliques_left: 1,
    obliques_right: 1,
  },
};
