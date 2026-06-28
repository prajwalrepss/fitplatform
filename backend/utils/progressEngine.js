/**
 * progressEngine.js
 * All training progress calculations in one place.
 * Pure functions — no DB calls, easy to unit-test.
 */

const TOTAL_PROGRAM_WEEKS = 12;

// Day names for streak checking
const MS_PER_DAY = 86400000;

/**
 * Returns the canonical date string (YYYY-MM-DD) for a Date or undefined.
 */
function toDateStr(date) {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 10);
}

/**
 * Get today as YYYY-MM-DD in local-ish UTC terms.
 */
function todayStr() {
  return toDateStr(new Date());
}

/**
 * Determine recovery status based on consecutive heavy days.
 */
function computeRecoveryStatus(consecutiveHeavyDays) {
  if (consecutiveHeavyDays >= 4) return "Fatigued";
  if (consecutiveHeavyDays >= 2) return "Recovering";
  return "Ready";
}

/**
 * Compute weekly completion: % of non-rest scheduled days that were
 * completed in the current calendar week (Mon–Sun).
 */
function computeWeeklyCompletion(profile) {
  if (!profile.selectedSplit || !profile.trainingHistory) return 0;

  const schedule = profile.selectedSplit.weeklySchedule || [];
  const nonRestDays = schedule.filter(
    (d) => d.target.toLowerCase() !== "rest"
  ).length;

  if (nonRestDays === 0) return 100;

  // Find Mon of current week
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const thisWeekWorkouts = profile.trainingHistory.filter((h) => {
    const d = new Date(h.completedAt || h.date);
    return (
      d >= monday &&
      d <= sunday &&
      h.target.toLowerCase() !== "rest"
    );
  });

  return Math.min(
    100,
    Math.round((thisWeekWorkouts.length / nonRestDays) * 100)
  );
}

/**
 * Update profile state after a workout is completed.
 * Returns a plain object of fields to $set on the MongoDB document.
 * Does NOT mutate the profile.
 */
function buildUpdateAfterWorkout(profile, { target, musclesTrained = [], durationMin = 0 }) {
  const now = new Date();
  const todayDateStr = todayStr();
  const lastDateStr = toDateStr(profile.lastWorkoutDate);

  // --- Streak logic ---
  let newStreak = profile.dayStreak || 0;
  const schedule = (profile.selectedSplit && profile.selectedSplit.weeklySchedule) || [];

  if (lastDateStr === null) {
    // First ever workout
    newStreak = 1;
  } else {
    const lastDate = new Date(profile.lastWorkoutDate);
    const diffDays = Math.round((now - lastDate) / MS_PER_DAY);

    if (diffDays === 0) {
      // Same day — streak unchanged (already counted today)
    } else if (diffDays === 1) {
      // Consecutive day — extend streak
      newStreak = newStreak + 1;
    } else if (diffDays === 2) {
      // One day gap — check if that gap day was a rest day
      const gapDate = new Date(lastDate);
      gapDate.setDate(lastDate.getDate() + 1);
      const gapDayOfWeek = gapDate.getDay();
      const gapScheduleIdx = gapDayOfWeek === 0 ? 6 : gapDayOfWeek - 1;
      const gapEntry = schedule[gapScheduleIdx];
      if (gapEntry && gapEntry.target.toLowerCase() === "rest") {
        // Rest day in between — streak survives
        newStreak = newStreak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      // Broke streak
      newStreak = 1;
    }
  }

  // --- Advance cycle ---
  const cycleLength = schedule.length || 7;
  let newCycleIndex = profile.currentCycleIndex;
  let newCurrentDay = profile.currentDay;
  let newCurrentWeek = profile.currentWeek;

  // Only advance if this is a new day (not re-logging same day)
  if (lastDateStr !== todayDateStr) {
    newCycleIndex = (newCycleIndex + 1) % cycleLength;
    newCurrentDay = newCurrentDay + 1;
    // New week every 7 scheduled days
    if (newCurrentDay > 7) {
      newCurrentDay = 1;
      newCurrentWeek = newCurrentWeek + 1;
    }
  }

  // --- Consecutive heavy days ---
  const isRest = target.toLowerCase() === "rest";
  let newConsecutiveHeavyDays = isRest
    ? 0
    : (profile.consecutiveHeavyDays || 0) + 1;

  // --- Build history entry ---
  const historyEntry = {
    date: now,
    target,
    scheduledTarget: schedule[profile.currentCycleIndex]
      ? schedule[profile.currentCycleIndex].target
      : target,
    musclesTrained,
    durationMin,
    completedAt: now,
    weekNumber: newCurrentWeek,
    dayIndex: profile.currentCycleIndex,
  };

  // --- Weekly completion (estimate with +1 for this workout) ---
  const nonRestDays = schedule.filter(
    (d) => d.target.toLowerCase() !== "rest"
  ).length || 1;

  // Count this week's workouts including this one
  const now2 = new Date();
  const dayOfWeek2 = now2.getDay();
  const mondayOffset2 = dayOfWeek2 === 0 ? -6 : 1 - dayOfWeek2;
  const monday2 = new Date(now2);
  monday2.setDate(now2.getDate() + mondayOffset2);
  monday2.setHours(0, 0, 0, 0);

  const thisWeekCount = (profile.trainingHistory || []).filter((h) => {
    const d = new Date(h.completedAt || h.date);
    return d >= monday2 && h.target.toLowerCase() !== "rest";
  }).length + (isRest ? 0 : 1);

  const newWeeklyCompletion = Math.min(
    100,
    Math.round((thisWeekCount / nonRestDays) * 100)
  );

  return {
    currentCycleIndex: newCycleIndex,
    currentDay: newCurrentDay,
    currentWeek: newCurrentWeek,
    dayStreak: newStreak,
    lastWorkoutDate: now,
    consecutiveHeavyDays: newConsecutiveHeavyDays,
    recoveryStatus: computeRecoveryStatus(newConsecutiveHeavyDays),
    weeklyCompletion: newWeeklyCompletion,
    completedWorkouts: (profile.completedWorkouts || 0) + 1,
    $push: { trainingHistory: historyEntry },
  };
}

/**
 * Generate a contextual AI insight string based on workout context.
 * Rule-based placeholder — ready to swap in LLM call.
 */
function generateInsight({ target, recovery, previousTarget }) {
  const t = (target || "").toLowerCase().trim();
  const prev = (previousTarget || "").toLowerCase().trim();

  const recoveryNote =
    recovery === "Fatigued"
      ? " Consider reducing intensity today — your body needs recovery."
      : recovery === "Recovering"
      ? " You're in the active recovery zone. Keep good form and listen to your body."
      : "";

  const contextNote =
    prev === t
      ? " Repeating the same session — prioritize technique over load today."
      : prev === "legs" && (t === "push" || t === "upper")
      ? " Great sequencing after legs — your upper body is fully recovered."
      : prev === "push" && t === "pull"
      ? " Push-Pull sequencing is optimal — antagonist muscles are fully fresh."
      : prev === "pull" && t === "legs"
      ? " Full body rotation complete. Maximum muscle group freshness achieved."
      : "";

  const insights = {
    push: `Today's session targets chest, front delts, and triceps. Focus on progressive overload — add 2.5kg if your last push session felt moderate.${contextNote}${recoveryNote}`,
    pull: `Pull day activates lats, rhomboids, and biceps. Prioritize scapular retraction on rows for maximum upper-back recruitment.${contextNote}${recoveryNote}`,
    legs: `Leg day engages your largest muscle group. Activate glutes with hip circles before squatting to protect your lower back.${contextNote}${recoveryNote}`,
    upper: `Full upper body session — balance pushing and pulling volumes for optimal shoulder health and muscular symmetry.${contextNote}${recoveryNote}`,
    lower: `Lower body focus today. Posterior chain activation (glutes, hamstrings) before compound movements significantly reduces injury risk.${contextNote}${recoveryNote}`,
    "full body": `Full body session — pace yourself and maintain 60-90 second rest intervals to manage systemic fatigue across all muscle groups.${contextNote}${recoveryNote}`,
    work: `Full body session — pace yourself and maintain 60-90 second rest intervals to manage systemic fatigue across all muscle groups.${contextNote}${recoveryNote}`,
    chest: `Chest day — use full range of motion on all pressing movements. Controlled eccentrics build more muscle than fast reps.${contextNote}${recoveryNote}`,
    back: `Back day — initiate every pull with your lats, not your biceps, for maximum lat recruitment and reduced elbow strain.${contextNote}${recoveryNote}`,
    shoulders: `Shoulder day — warm up rotator cuff before pressing. Lateral raises with partial range outperform full swings for medial delt isolation.${contextNote}${recoveryNote}`,
    arms: `Arm isolation day — maximize the mind-muscle connection. Slow eccentrics on curls and extensions significantly increase hypertrophy stimulus.${contextNote}${recoveryNote}`,
    rest: `Rest day — prioritize sleep, hydration, and light mobility work. Recovery is when muscles grow. Aim for 8g of protein per kg today.${recoveryNote}`,
  };

  return (
    insights[t] ||
    `Today's ${target} workout is optimally programmed for hypertrophy and progressive overload.${recoveryNote}`
  );
}

module.exports = {
  buildUpdateAfterWorkout,
  computeWeeklyCompletion,
  computeRecoveryStatus,
  generateInsight,
  todayStr,
  toDateStr,
};
