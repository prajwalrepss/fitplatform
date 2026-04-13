const express = require("express");
const router = express.Router();

const splitEngine = require("../logic/splitEngine");
const WorkoutSession = require("../models/WorkoutSession");
const { verifyToken } = require("../middleware/auth");

// All workout routes require auth
router.use(verifyToken);

// start split
router.post("/start", (req, res, next) => {
  try {
    splitEngine.start();
    res.json({ success: true, data: { startedAt: splitEngine.startedAt }, message: "Split started" });
  } catch (error) {
    next(error);
  }
});

// end split and save session
router.post("/end", async (req, res, next) => {
  try {
    const savedSession = await splitEngine.end();

    if (!savedSession) {
      return res.status(400).json({ success: false, message: "No active workout to end" });
    }

    res.json({ success: true, data: savedSession, message: "Workout ended and saved" });
  } catch (error) {
    next(error);
  }
});

// add exercise
router.post("/exercise/:id", (req, res, next) => {
  try {
    const status = splitEngine.addExercise(req.params.id);

    if (!status) {
      return res.status(400).json({ success: false, message: "Invalid exercise or split not started" });
    }

    res.json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
});

// current muscle status
router.get("/status", (req, res, next) => {
  try {
    res.json({ success: true, data: splitEngine.getStatus() });
  } catch (error) {
    next(error);
  }
});

// get workout history
router.get("/history", async (req, res, next) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.userId })
      .sort({ startedAt: -1 })
      .limit(50);

    res.json({ success: true, data: { count: sessions.length, sessions } });
  } catch (error) {
    next(error);
  }
});

// ========================================
// AI EXERCISE TRACKING SESSION
// ========================================
router.post("/session", async (req, res, next) => {
  try {
    const { exercise, reps, duration, formScore, setsCompleted, setHistory, compensationCount } = req.body;

    if (!exercise || !reps) {
      return res.status(400).json({ success: false, message: "exercise and reps are required" });
    }

    const sessionData = {
      userId: req.userId,
      type: 'ai-tracking',
      exercise,
      reps: Number(reps),
      duration: Number(duration) || 0,
      formScore: Number(formScore) || 0,
      setsCompleted: Number(setsCompleted) || 0,
      setHistory: setHistory || [],
      compensationCount: Number(compensationCount) || 0,
      completedAt: new Date(),
    };

    // Save to WorkoutSession collection if available
    try {
      const session = new WorkoutSession(sessionData);
      await session.save();
      res.json({ success: true, data: session, message: "AI tracking session saved" });
    } catch (saveErr) {
      // If model doesn't have the right schema, just return the data
      console.warn("Could not save to DB, returning data:", saveErr.message);
      res.json({ success: true, data: sessionData, message: "Session recorded (not persisted to DB)" });
    }
  } catch (error) {
    next(error);
  }
});

// ========================================
// LIVE WORKOUT SESSION ENDPOINTS
// ========================================
const liveWorkoutController = require("../controllers/liveWorkout");

router.post("/live/start", liveWorkoutController.startLiveSession);
router.post("/live/add-exercise", liveWorkoutController.addExerciseToLive);
router.post("/live/add-set", liveWorkoutController.addSetToLive);
router.post("/live/end", liveWorkoutController.endLiveSession);
router.get("/live/status", liveWorkoutController.getLiveStatus);
router.delete("/live/cancel", liveWorkoutController.cancelLiveSession);
router.post("/log", liveWorkoutController.logWorkout);

module.exports = router;