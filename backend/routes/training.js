const express = require("express");
const router = express.Router();
const TrainingProfile = require("../models/TrainingProfile");
const { buildUpdateAfterWorkout, computeWeeklyCompletion, generateInsight } = require("../utils/progressEngine");
const { verifyToken } = require("../middleware/auth");
const { SECRET } = require("../config/jwt");
const jwt = require("jsonwebtoken");

// ---------------------------------------------------------------------------
// Auth middleware (optional — accepts token if present, continues if not)
// ---------------------------------------------------------------------------
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(header.slice(7), SECRET);
      req.userId = decoded.userId;
    } catch (_) {}
  }
  next();
}

const requireAuth = verifyToken;

// ---------------------------------------------------------------------------
// Helper: get or auto-create profile for a user
// ---------------------------------------------------------------------------
async function getOrCreateProfile(userId) {
  let profile = await TrainingProfile.findOne({ userId });
  if (!profile) {
    profile = await TrainingProfile.create({
      userId,
      currentWeek: 1,
      currentDay: 1,
      currentCycleIndex: 0,
      dayStreak: 0,
      weeklyCompletion: 0,
      completedWorkouts: 0,
      recoveryStatus: "Ready",
      consecutiveHeavyDays: 0,
      trainingHistory: [],
    });
  }
  return profile;
}

// ---------------------------------------------------------------------------
// GET /api/training/profile
// Returns the full training profile, auto-creating for new users.
// ---------------------------------------------------------------------------
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.userId);
    res.json({
      ...profile.toJSON(),
      programProgress: profile.programProgress,
      weeklyCompletion: computeWeeklyCompletion(profile),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/training/today
// Returns today scheduled workout entry + computed stats.
// ---------------------------------------------------------------------------
router.get("/today", requireAuth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.userId);
    const schedule = (profile.selectedSplit && profile.selectedSplit.weeklySchedule) || [];

    const jsDay = new Date().getDay();
    const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
    const todayEntry = schedule[todayIdx] || null;

    res.json({
      todayEntry,
      currentWeek: profile.currentWeek,
      currentDay: profile.currentDay,
      dayStreak: profile.dayStreak,
      weeklyCompletion: computeWeeklyCompletion(profile),
      completedWorkouts: profile.completedWorkouts,
      recoveryStatus: profile.recoveryStatus,
      programProgress: profile.programProgress,
      selectedSplit: profile.selectedSplit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/training/week
// Returns the full week schedule with completion flags.
// ---------------------------------------------------------------------------
router.get("/week", requireAuth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.userId);
    const schedule = (profile.selectedSplit && profile.selectedSplit.weeklySchedule) || [];

    // Which days this week were completed?
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const thisWeekEntries = (profile.trainingHistory || []).filter((h) => {
      const d = new Date(h.completedAt || h.date);
      return d >= monday && d <= sunday;
    });

    const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    const weekData = schedule.map((entry, idx) => ({
      dayLabel: days[idx] || `D${idx + 1}`,
      target: entry.target,
      status: idx < todayIdx ? "past" : idx === todayIdx ? "today" : "future",
      completed: thisWeekEntries.some((h) => h.dayIndex === idx),
    }));

    res.json({ week: weekData, currentWeek: profile.currentWeek });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/training/complete
// Mark a workout as completed and update all stats.
// ---------------------------------------------------------------------------
router.post("/complete", requireAuth, async (req, res) => {
  try {
    const { target, musclesTrained = [], durationMin = 0 } = req.body;
    if (!target) return res.status(400).json({ error: "target is required" });

    const profile = await getOrCreateProfile(req.userId);
    const updates = buildUpdateAfterWorkout(profile, { target, musclesTrained, durationMin });

    const { $push, ...setFields } = updates;
    await TrainingProfile.findByIdAndUpdate(profile._id, {
      $set: setFields,
      ...(setFields.startedProgramAt === undefined && profile.startedProgramAt === null
        ? { $setOnInsert: { startedProgramAt: new Date() } }
        : {}),
      ...($push ? { $push } : {}),
    });

    // If startedProgramAt was never set, set it now
    if (!profile.startedProgramAt) {
      await TrainingProfile.findByIdAndUpdate(profile._id, {
        $set: { startedProgramAt: new Date() },
      });
    }

    const updated = await TrainingProfile.findById(profile._id);
    res.json({
      message: "Workout recorded",
      dayStreak: updated.dayStreak,
      completedWorkouts: updated.completedWorkouts,
      weeklyCompletion: computeWeeklyCompletion(updated),
      currentWeek: updated.currentWeek,
      currentDay: updated.currentDay,
      recoveryStatus: updated.recoveryStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/training/split
// Change selected split — resets week/day counters.
// ---------------------------------------------------------------------------
router.patch("/split", requireAuth, async (req, res) => {
  try {
    const { split } = req.body;
    if (!split || !split.weeklySchedule) {
      return res.status(400).json({ error: "split with weeklySchedule is required" });
    }

    const profile = await getOrCreateProfile(req.userId);
    await TrainingProfile.findByIdAndUpdate(profile._id, {
      $set: {
        selectedSplit: split,
        currentWeek: 1,
        currentDay: 1,
        currentCycleIndex: 0,
        weeklyCompletion: 0,
        startedProgramAt: new Date(),
      },
    });

    res.json({ message: "Split updated", currentWeek: 1, currentDay: 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/training/history?page=1&limit=20
// Paginated training history, newest first.
// ---------------------------------------------------------------------------
router.get("/history", requireAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);

    const profile = await getOrCreateProfile(req.userId);
    const history = [...(profile.trainingHistory || [])].reverse();
    const total = history.length;
    const paged = history.slice((page - 1) * limit, page * limit);

    res.json({ history: paged, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /api/training/insight?target=push&recovery=Ready&prev=pull
// Returns a contextual workout insight string.
// ---------------------------------------------------------------------------
router.get("/insight", optionalAuth, async (req, res) => {
  try {
    const { target, recovery = "Ready", prev } = req.query;
    const insight = generateInsight({
      target: target || "work",
      recovery,
      previousTarget: prev,
    });
    res.json({ insight });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
