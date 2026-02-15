const mongoose = require("mongoose");

const workoutSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: false,
        },
        exercises: [
            {
                type: String,
                required: true,
            },
        ],
        muscleLoad: {
            type: Map,
            of: Number,
            required: true,
        },
        startedAt: {
            type: Date,
            required: true,
        },
        endedAt: {
            type: Date,
            required: true,
        },
        durationSeconds: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("WorkoutSession", workoutSessionSchema);
