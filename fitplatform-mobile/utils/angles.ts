export interface Point2D {
  x: number;
  y: number;
  visibility?: number;
}

export interface JointAngleConfig {
  landmarks: [number, number, number];
  minAngle: number;
  maxAngle: number;
  label: string;
}

export interface PhaseConfig {
  angle: number;
  direction: 'above' | 'below';
}

export interface ExerciseConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetReps: number;
  targetSets: number;
  jointAngles: JointAngleConfig[];
  phases: {
    down: PhaseConfig;
    up: PhaseConfig;
  };
  primaryAngleLandmarks: [number, number, number] | [[number, number, number], [number, number, number]];
  compensationRules: {
    id: string;
    name: string;
    check: (landmarks: Point2D[]) => boolean;
    message: string;
  }[];
  side: 'both' | 'left' | 'right';
}

/**
 * Calculate angle at point B given three 2D points A, B, C.
 * Returns angle in degrees (0-180).
 */
export function calculateAngle(a: Point2D, b: Point2D, c: Point2D): number {
  if (!a || !b || !c) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

/**
 * Smooth angle using rolling median filter to reduce noise.
 * Takes an array of recent angles and returns the median.
 */
export function smoothAngle(angleBuffer: number[]): number {
  if (!angleBuffer || angleBuffer.length === 0) return 0;
  const sorted = [...angleBuffer].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Get the primary joint angle for rep counting.
 */
export function getPrimaryAngle(landmarks: Point2D[], exercise: ExerciseConfig): number | null {
  if (!landmarks || !exercise || !exercise.primaryAngleLandmarks) return null;

  // If dual-sided landmarks are provided [[L_A, L_B, L_C], [R_A, R_B, R_C]]
  if (Array.isArray(exercise.primaryAngleLandmarks[0])) {
    const [leftSet, rightSet] = exercise.primaryAngleLandmarks as [[number, number, number], [number, number, number]];
    const lVis = (landmarks[leftSet[0]]?.visibility || 0) + (landmarks[leftSet[1]]?.visibility || 0) + (landmarks[leftSet[2]]?.visibility || 0);
    const rVis = (landmarks[rightSet[0]]?.visibility || 0) + (landmarks[rightSet[1]]?.visibility || 0) + (landmarks[rightSet[2]]?.visibility || 0);

    const set = rVis > lVis ? rightSet : leftSet;
    const [iA, iB, iC] = set;
    return calculateAngle(landmarks[iA], landmarks[iB], landmarks[iC]);
  }

  // Fallback for legacy single-side [A, B, C]
  const [iA, iB, iC] = exercise.primaryAngleLandmarks as [number, number, number];
  return calculateAngle(landmarks[iA], landmarks[iB], landmarks[iC]);
}

/**
 * Compute overall form score (0-100) based on how well current joint angles
 * match the exercise configuration ranges.
 */
export function getFormScore(landmarks: Point2D[], exercise: ExerciseConfig): number {
  if (!landmarks || !exercise || !exercise.jointAngles) return 0;
  let totalScore = 0;
  let count = 0;

  for (const ja of exercise.jointAngles) {
    const [iA, iB, iC] = ja.landmarks;
    const a = landmarks[iA];
    const b = landmarks[iB];
    const c = landmarks[iC];
    if (!a || !b || !c) continue;

    const angle = calculateAngle(a, b, c);
    let score = 0;
    if (angle >= ja.minAngle && angle <= ja.maxAngle) {
      score = 100;
    } else if (angle < ja.minAngle) {
      score = Math.max(0, 100 - ((ja.minAngle - angle) / ja.minAngle) * 120);
    } else {
      score = Math.max(0, 100 - ((angle - ja.maxAngle) / (180 - ja.maxAngle)) * 120);
    }
    totalScore += score;
    count++;
  }

  return count > 0 ? Math.round(totalScore / count) : 0;
}
