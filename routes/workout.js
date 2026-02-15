const express = require("express");
const router = express.Router();

const splitEngine = require("../logic/splitEngine");
const WorkoutSession = require("../models/WorkoutSession");
const { verifyToken } = require("../middleware/auth");

// Apply authentication middleware to all workout routes
router.use(verifyToken);

// start split
router.post("/start", (req, res) => {
  try {
    splitEngine.start();
    res.json({ message: "Split started", startedAt: splitEngine.startedAt });
  } catch (error) {
    res.status(500).json({ error: "Failed to start workout" });
  }
});

// end split and save session
router.post("/end", async (req, res) => {
  try {
    const savedSession = await splitEngine.end();

    if (!savedSession) {
      return res.status(400).json({ error: "No active workout to end" });
    }

    res.json({
      message: "Workout ended and saved",
      session: savedSession,
    });
  } catch (error) {
    console.error("Error ending workout:", error);
    res.status(500).json({ error: "Failed to end workout" });
  }
});

// add exercise
router.post("/exercise/:id", (req, res) => {
  try {
    const status = splitEngine.addExercise(req.params.id);

    if (!status) {
      return res.status(400).json({ error: "Invalid exercise or split not started" });
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to add exercise" });
  }
});

// current muscle status
router.get("/status", (req, res) => {
  try {
    res.json(splitEngine.getStatus());
  } catch (error) {
    res.status(500).json({ error: "Failed to get status" });
  }
});

// get workout history
router.get("/history", async (req, res) => {
  try {
    const sessions = await WorkoutSession.find()
      .sort({ startedAt: -1 })
      .limit(50);

    res.json({
      count: sessions.length,
      sessions: sessions,
    });
  } catch (error) {
    console.error("Error fetching workout history:", error);
    res.status(500).json({ error: "Failed to fetch workout history" });
  }
});

module.exports = router;