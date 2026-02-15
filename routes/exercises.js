const express = require("express");
const router = express.Router();
const exercises = require("../data/exercises");

console.log("Exercises route loaded");

router.get("/", (req, res) => {
  console.log("GET /exercises hit");
  try {
    return res.json(exercises);
  } catch (err) {
    console.error("Error in /exercises:", err);
    return res.status(500).json({ error: "Internal error" });
  }
});

router.get("/muscle/:muscle", (req, res) => {
  console.log("GET /exercises/muscle hit");
  const { muscle } = req.params;

  const VALID = [
    "chest", "back", "shoulders", "biceps", "triceps",
    "forearms", "quads", "hamstrings", "glutes",
    "calves", "core"
  ];

  if (!VALID.includes(muscle)) {
    return res.status(400).json({ error: "Invalid muscle group" });
  }

  const filtered = exercises.filter(
    ex => ex.primaryMuscle === muscle
  );

  return res.json(filtered || []);
});

module.exports = router;