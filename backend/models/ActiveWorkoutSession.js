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
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
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

const activeWorkoutSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // Only one active session per user
        },
        startedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        exercises: [exerciseSchema],
        currentExerciseIndex: {
            type: Number,
            default: 0,
        },
        lastActivity: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ActiveWorkoutSession", activeWorkoutSessionSchema);
