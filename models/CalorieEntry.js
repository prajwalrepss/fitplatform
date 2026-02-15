const mongoose = require("mongoose");

const calorieEntrySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        calories: {
            type: Number,
            default: 0,
        },
        protein: {
            type: Number,
            default: 0,
        },
        carbs: {
            type: Number,
            default: 0,
        },
        fats: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index to prevent duplicate entries per user per day
calorieEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("CalorieEntry", calorieEntrySchema);
