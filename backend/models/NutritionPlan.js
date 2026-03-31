const mongoose = require("mongoose");

const nutritionPlanSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One plan per user
        },
        calorieTarget: {
            type: Number,
            required: true,
            min: 1000,
            max: 10000,
        },
        proteinTarget: {
            type: Number, // grams
            required: true,
            min: 0,
        },
        carbTarget: {
            type: Number, // grams
            required: true,
            min: 0,
        },
        fatTarget: {
            type: Number, // grams
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("NutritionPlan", nutritionPlanSchema);
