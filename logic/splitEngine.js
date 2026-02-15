const muscles = require("../data/muscles");
const exercises = require("../data/exercises");
const WorkoutSession = require("../models/WorkoutSession");

class SplitEngine {
  constructor() {
    this.active = false;
    this.exerciseHistory = [];
    this.startedAt = null;

    // initialize all muscles to 0
    this.muscleLoad = {};
    muscles.forEach(m => {
      this.muscleLoad[m.id] = 0;
    });
  }

  start() {
    this.active = true;
    this.exerciseHistory = [];
    this.startedAt = new Date();

    Object.keys(this.muscleLoad).forEach(k => {
      this.muscleLoad[k] = 0;
    });
  }

  async end() {
    if (!this.active) {
      return null;
    }

    this.active = false;
    const endedAt = new Date();

    // Calculate duration in seconds
    const durationSeconds = Math.floor((endedAt - this.startedAt) / 1000);

    try {
      // Save workout session to database
      const session = new WorkoutSession({
        exercises: this.exerciseHistory,
        muscleLoad: this.muscleLoad,
        startedAt: this.startedAt,
        endedAt: endedAt,
        durationSeconds: durationSeconds,
      });

      const savedSession = await session.save();
      return savedSession.toJSON();
    } catch (error) {
      console.error("Error saving workout session:", error);
      throw error;
    }
  }

  addExercise(exerciseId) {
    if (!this.active) return null;

    const ex = exercises.find(e => e.id === exerciseId);
    if (!ex) {
      console.warn(`Exercise with id ${exerciseId} not found`);
      return null;
    }

    this.exerciseHistory.push(exerciseId);

    // NEW SCHEMA: primaryMuscle is a string, secondaryMuscles is an array
    // Add +2 to primary muscle
    if (ex.primaryMuscle && this.muscleLoad[ex.primaryMuscle] !== undefined) {
      this.muscleLoad[ex.primaryMuscle] += 2;
    }

    // Add +1 to each secondary muscle
    if (Array.isArray(ex.secondaryMuscles)) {
      ex.secondaryMuscles.forEach(muscle => {
        if (this.muscleLoad[muscle] !== undefined) {
          this.muscleLoad[muscle] += 1;
        }
      });
    }

    return this.getStatus();
  }

  getStatus() {
    const status = {};

    Object.entries(this.muscleLoad).forEach(([muscle, load]) => {
      let color = "grey";

      if (load === 1) color = "yellow";
      else if (load === 2) color = "green";
      else if (load >= 3) color = "red";

      status[muscle] = {
        load,
        color
      };
    });

    return status;
  }
}

module.exports = new SplitEngine();