const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    calories: {
        type: Number,
        required: true,
        min: 0,
    },
    protein: {
        type: Number,
        default: 0,
        min: 0,
    },
    carbs: {
        type: Number,
        default: 0,
        min: 0,
    },
    fats: {
        type: Number,
        default: 0,
        min: 0,
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

const dailyNutritionLogSchema = new mongoose.Schema(
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
        caloriesConsumed: {
            type: Number,
            default: 0,
            min: 0,
        },
        proteinConsumed: {
            type: Number,
            default: 0,
            min: 0,
        },
        carbsConsumed: {
            type: Number,
            default: 0,
            min: 0,
        },
        fatsConsumed: {
            type: Number,
            default: 0,
            min: 0,
        },
        meals: [mealSchema],
    },
    {
        timestamps: true,
    }
);

// Compound unique index: one log per user per day
dailyNutritionLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyNutritionLog", dailyNutritionLogSchema);
