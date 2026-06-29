export const TRACKED_EXERCISES = [
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    targetReps: 12,
    targetSets: 3,
    jointAngles: [
      { landmarks: [12, 14, 16], minAngle: 30, maxAngle: 160, label: 'Right Elbow' },
      { landmarks: [11, 13, 15], minAngle: 30, maxAngle: 160, label: 'Left Elbow' },
    ],
    phases: {
      down: { angle: 85, direction: 'below' },
      up: { angle: 135, direction: 'above' },
    },
    primaryAngleLandmarks: [[11, 13, 15], [12, 14, 16]],
    compensationRules: [
      {
        id: 'elbow-flare',
        message: 'Keep your elbows tucked into your sides',
        check: (lm) => {
          if (!lm[14] || !lm[24]) return false;
          const leftMove = Math.abs((lm[13]?.y ?? 0) - (lm[15]?.y ?? 0));
          const rightMove = Math.abs((lm[14]?.y ?? 0) - (lm[16]?.y ?? 0));
          if (rightMove > leftMove) return Math.abs(lm[14].x - lm[24].x) > 0.14;
          return Math.abs((lm[13]?.x ?? 0) - (lm[23]?.x ?? 0)) > 0.14;
        },
      },
      {
        id: 'shoulder-swing',
        message: 'Avoid swinging your shoulders',
        check: (lm) => {
          if (!lm[12] || !lm[24]) return false;
          return Math.abs(lm[12].y - lm[24].y) < 0.15;
        },
      },
    ],
  },
  {
    id: 'squats',
    name: 'Squats',
    targetReps: 12,
    targetSets: 3,
    jointAngles: [
      { landmarks: [24, 26, 28], minAngle: 70, maxAngle: 175, label: 'Right Knee' },
      { landmarks: [23, 25, 27], minAngle: 70, maxAngle: 175, label: 'Left Knee' },
    ],
    phases: {
      down: { angle: 120, direction: 'below' },
      up: { angle: 145, direction: 'above' },
    },
    primaryAngleLandmarks: [[23, 25, 27], [24, 26, 28]],
    compensationRules: [
      {
        id: 'knee-cave',
        message: 'Push your knees outward',
        check: (lm) => {
          if (!lm[25] || !lm[26] || !lm[23] || !lm[24]) return false;
          const kneeWidth = Math.abs(lm[25].x - lm[26].x);
          const hipWidth = Math.abs(lm[23].x - lm[24].x);
          return kneeWidth < hipWidth * 0.65;
        },
      },
      {
        id: 'forward-lean',
        message: 'Keep your chest upright',
        check: (lm) => {
          if (!lm[12] || !lm[24]) return false;
          return lm[12].x - lm[24].x > 0.08;
        },
      },
    ],
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    targetReps: 12,
    targetSets: 3,
    jointAngles: [
      { landmarks: [24, 12, 14], minAngle: 60, maxAngle: 170, label: 'Right Shoulder' },
      { landmarks: [23, 11, 13], minAngle: 60, maxAngle: 170, label: 'Left Shoulder' },
    ],
    phases: {
      down: { angle: 150, direction: 'above' },
      up: { angle: 110, direction: 'below' },
    },
    primaryAngleLandmarks: [[23, 11, 13], [24, 12, 14]],
    compensationRules: [
      {
        id: 'trunk-lean',
        message: 'Keep your torso straight',
        check: (lm) => {
          if (!lm[11] || !lm[12] || !lm[23] || !lm[24]) return false;
          const shoulderMidX = (lm[11].x + lm[12].x) / 2;
          const hipMidX = (lm[23].x + lm[24].x) / 2;
          return Math.abs(shoulderMidX - hipMidX) > 0.06;
        },
      },
    ],
  },
  {
    id: 'lunges',
    name: 'Lunges',
    targetReps: 12,
    targetSets: 3,
    jointAngles: [
      { landmarks: [24, 26, 28], minAngle: 70, maxAngle: 175, label: 'Right Knee' },
      { landmarks: [23, 25, 27], minAngle: 70, maxAngle: 175, label: 'Left Knee' },
    ],
    phases: {
      down: { angle: 120, direction: 'below' },
      up: { angle: 145, direction: 'above' },
    },
    primaryAngleLandmarks: [[23, 25, 27], [24, 26, 28]],
    compensationRules: [
      {
        id: 'knee-over-toe',
        message: 'Keep your knee stacked over your foot',
        check: (lm) => {
          if (!lm[26] || !lm[28]) return false;
          return lm[26].x > lm[28].x + 0.05;
        },
      },
    ],
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    targetReps: 12,
    targetSets: 3,
    jointAngles: [
      { landmarks: [24, 12, 16], minAngle: 10, maxAngle: 100, label: 'Right Shoulder' },
      { landmarks: [23, 11, 15], minAngle: 10, maxAngle: 100, label: 'Left Shoulder' },
    ],
    phases: {
      down: { angle: 65, direction: 'above' },
      up: { angle: 35, direction: 'below' },
    },
    primaryAngleLandmarks: [[23, 11, 15], [24, 12, 16]],
    compensationRules: [
      {
        id: 'shrug',
        message: 'Relax your shoulders',
        check: (lm) => {
          if (!lm[11] || !lm[12]) return false;
          return lm[12].y < lm[11].y - 0.03;
        },
      },
    ],
  },
];

export function resolveTrackingExercise(nameOrId) {
  const normalized = String(nameOrId || '').toLowerCase();
  if (normalized.includes('squat')) return TRACKED_EXERCISES.find((exercise) => exercise.id === 'squats');
  if (normalized.includes('lunge')) return TRACKED_EXERCISES.find((exercise) => exercise.id === 'lunges');
  if (normalized.includes('shoulder') || normalized.includes('overhead')) return TRACKED_EXERCISES.find((exercise) => exercise.id === 'shoulder-press');
  if (normalized.includes('lateral')) return TRACKED_EXERCISES.find((exercise) => exercise.id === 'lateral-raises');
  if (normalized.includes('curl') || normalized.includes('bicep')) return TRACKED_EXERCISES.find((exercise) => exercise.id === 'bicep-curls');
  return TRACKED_EXERCISES[0];
}
