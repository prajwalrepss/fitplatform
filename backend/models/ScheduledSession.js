const mongoose = require("mongoose");

const scheduledSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["strength", "cardio", "recovery", "mixed"],
            required: true,
        },
        scheduledDate: {
            type: Date,
            required: true,
            index: true,
        },
        duration: {
            type: Number, // minutes
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
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

// Index for efficient queries
scheduledSessionSchema.index({ userId: 1, scheduledDate: 1 });

module.exports = mongoose.model("ScheduledSession", scheduledSessionSchema);
