const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
    weight: {
        type: Number,
        min: 0,
    },
    reps: {
        type: Number,
        required: true,
        min: 0,
    },
    completed: {
        type: Boolean,
        default: true,
    },
});

const exerciseSchema = new mongoose.Schema({
    exerciseId: {
        type: String,
        required: true,
    },
    exerciseName: {
        type: String,
        required: true,
    },
    sets: [setSchema],
});

const workoutSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["strength", "cardio", "mixed"],
            default: "strength",
        },
        exercises: [exerciseSchema],
        muscleLoad: {
            type: Map,
            of: Number,
            default: {},
        },
        totalVolume: {
            type: Number, // sum of weight * reps for all sets
            default: 0,
        },
        caloriesBurned: {
            type: Number,
            default: 0,
        },
        activeMinutes: {
            type: Number,
            default: 0,
        },
        startedAt: {
            type: Date,
            required: true,
        },
        endedAt: {
            type: Date,
            required: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient date-based queries
workoutSessionSchema.index({ userId: 1, startedAt: -1 });

module.exports = mongoose.model("WorkoutSession", workoutSessionSchema);
