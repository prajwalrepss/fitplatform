const mongoose = require("mongoose");

// --- Embedded: one entry per completed workout ---
const historyEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    target: { type: String, required: true },
    scheduledTarget: { type: String },
    musclesTrained: [String],
    durationMin: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
    weekNumber: { type: Number },
    dayIndex: { type: Number },
  },
  { _id: false }
);

// --- Embedded: selected split snapshot ---
const splitSnapshotSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    difficulty: String,
    duration: String,
    weeklySchedule: [{ day: String, target: String, _id: false }],
  },
  { _id: false }
);

// --- Main Training Profile ---
const trainingProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    selectedSplit: { type: splitSnapshotSchema, default: null },

    currentWeek: { type: Number, default: 1, min: 1 },
    currentDay: { type: Number, default: 1, min: 1 },
    currentCycleIndex: { type: Number, default: 0, min: 0 },

    startedProgramAt: { type: Date, default: null },

    dayStreak: { type: Number, default: 0, min: 0 },
    lastWorkoutDate: { type: Date, default: null },

    weeklyCompletion: { type: Number, default: 0, min: 0, max: 100 },
    completedWorkouts: { type: Number, default: 0, min: 0 },

    recoveryStatus: {
      type: String,
      enum: ["Ready", "Recovering", "Fatigued"],
      default: "Ready",
    },
    consecutiveHeavyDays: { type: Number, default: 0, min: 0 },

    trainingHistory: { type: [historyEntrySchema], default: [] },

    achievements: { type: [String], default: [] },
    personalRecords: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

trainingProfileSchema.virtual("programProgress").get(function () {
  const totalWeeks = 12;
  const weeksElapsed = Math.max(0, this.currentWeek - 1);
  return Math.min(100, Math.round((weeksElapsed / totalWeeks) * 100));
});

trainingProfileSchema.set("toJSON", { virtuals: true });
trainingProfileSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("TrainingProfile", trainingProfileSchema);
