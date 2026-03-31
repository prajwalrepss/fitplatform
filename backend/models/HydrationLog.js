const mongoose = require("mongoose");

const hydrationEntrySchema = new mongoose.Schema({
    amountMl: {
        type: Number,
        required: true,
        min: 0,
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

const hydrationLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        totalWaterMl: {
            type: Number,
            default: 0,
            min: 0,
        },
        entries: [hydrationEntrySchema],
    },
    {
        timestamps: true,
    }
);

// Compound unique index: one log per user per day
hydrationLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("HydrationLog", hydrationLogSchema);
