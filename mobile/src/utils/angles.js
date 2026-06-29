export function calculateAngle(a, b, c) {
  if (!a || !b || !c) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

export function smoothAngle(angleBuffer) {
  if (!angleBuffer || angleBuffer.length === 0) return 0;
  const sorted = [...angleBuffer].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function getPrimaryAngle(landmarks, exercise) {
  if (!landmarks || !exercise?.primaryAngleLandmarks) return null;

  if (Array.isArray(exercise.primaryAngleLandmarks[0])) {
    const [leftSet, rightSet] = exercise.primaryAngleLandmarks;
    const leftVisibility = leftSet.reduce((sum, idx) => sum + (landmarks[idx]?.visibility || 0), 0);
    const rightVisibility = rightSet.reduce((sum, idx) => sum + (landmarks[idx]?.visibility || 0), 0);
    const selectedSet = rightVisibility > leftVisibility ? rightSet : leftSet;
    const [iA, iB, iC] = selectedSet;
    return calculateAngle(landmarks[iA], landmarks[iB], landmarks[iC]);
  }

  const [iA, iB, iC] = exercise.primaryAngleLandmarks;
  return calculateAngle(landmarks[iA], landmarks[iB], landmarks[iC]);
}

export function getFormScore(landmarks, exercise) {
  if (!landmarks || !exercise?.jointAngles) return 0;

  let totalScore = 0;
  let count = 0;

  for (const jointAngle of exercise.jointAngles) {
    const [iA, iB, iC] = jointAngle.landmarks;
    const a = landmarks[iA];
    const b = landmarks[iB];
    const c = landmarks[iC];
    if (!a || !b || !c) continue;

    const angle = calculateAngle(a, b, c);
    let score = 0;
    if (angle >= jointAngle.minAngle && angle <= jointAngle.maxAngle) {
      score = 100;
    } else if (angle < jointAngle.minAngle) {
      score = Math.max(0, 100 - ((jointAngle.minAngle - angle) / jointAngle.minAngle) * 120);
    } else {
      score = Math.max(0, 100 - ((angle - jointAngle.maxAngle) / (180 - jointAngle.maxAngle)) * 120);
    }

    totalScore += score;
    count += 1;
  }

  return count > 0 ? Math.round(totalScore / count) : 0;
}
