const mongoose = require("mongoose");

const exerciseSetSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        exerciseId: {
            type: String,
            required: true,
            index: true,
        },
        weight: {
            type: Number,
            required: true,
            min: 0,
        },
        reps: {
            type: Number,
            required: true,
            min: 1,
        },
        sets: {
            type: Number,
            required: true,
            min: 1,
        },
        volume: {
            type: Number,
            required: true,
        },
        oneRepMaxEstimate: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for querying user's exercise history
exerciseSetSchema.index({ userId: 1, exerciseId: 1, createdAt: -1 });

module.exports = mongoose.model("ExerciseSet", exerciseSetSchema);
