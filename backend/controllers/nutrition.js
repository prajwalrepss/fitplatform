const NutritionPlan = require("../models/NutritionPlan");
const DailyNutritionLog = require("../models/DailyNutritionLog");

// Get or create user's nutrition plan
exports.getNutritionPlan = async (req, res) => {
    try {
        let plan = await NutritionPlan.findOne({ userId: req.userId });

        // Create default plan if doesn't exist
        if (!plan) {
            plan = await NutritionPlan.create({
                userId: req.userId,
                calorieTarget: 2500,
                proteinTarget: 150,
                carbTarget: 250,
                fatTarget: 80,
            });
        }

        res.json(plan);
    } catch (err) {
        console.error("Error fetching nutrition plan:", err);
        res.status(500).json({ error: "Failed to fetch nutrition plan" });
    }
};

// Update nutrition plan
exports.updateNutritionPlan = async (req, res) => {
    try {
        const { calorieTarget, proteinTarget, carbTarget, fatTarget } = req.body;

        const plan = await NutritionPlan.findOneAndUpdate(
            { userId: req.userId },
            { calorieTarget, proteinTarget, carbTarget, fatTarget },
            { new: true, upsert: true, runValidators: true }
        );

        res.json(plan);
    } catch (err) {
        console.error("Error updating nutrition plan:", err);
        res.status(500).json({ error: "Failed to update nutrition plan" });
    }
};

// Get today's nutrition log
exports.getTodayLog = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let log = await DailyNutritionLog.findOne({
            userId: req.userId,
            date: today,
        });

        // Create if doesn't exist
        if (!log) {
            log = await DailyNutritionLog.create({
                userId: req.userId,
                date: today,
                caloriesConsumed: 0,
                proteinConsumed: 0,
                carbsConsumed: 0,
                fatsConsumed: 0,
                meals: [],
            });
        }

        res.json(log);
    } catch (err) {
        console.error("Error fetching today's log:", err);
        res.status(500).json({ error: "Failed to fetch today's log" });
    }
};

// Log a meal
exports.logMeal = async (req, res) => {
    try {
        const { name, calories, protein, carbs, fats } = req.body;

        if (!name || calories === undefined) {
            return res.status(400).json({ error: "Name and calories are required" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const meal = {
            name,
            calories: calories || 0,
            protein: protein || 0,
            carbs: carbs || 0,
            fats: fats || 0,
            time: new Date(),
        };

        let log = await DailyNutritionLog.findOne({
            userId: req.userId,
            date: today,
        });

        if (!log) {
            log = await DailyNutritionLog.create({
                userId: req.userId,
                date: today,
                caloriesConsumed: meal.calories,
                proteinConsumed: meal.protein,
                carbsConsumed: meal.carbs,
                fatsConsumed: meal.fats,
                meals: [meal],
            });
        } else {
            log.caloriesConsumed += meal.calories;
            log.proteinConsumed += meal.protein;
            log.carbsConsumed += meal.carbs;
            log.fatsConsumed += meal.fats;
            log.meals.push(meal);
            await log.save();
        }

        res.json(log);
    } catch (err) {
        console.error("Error logging meal:", err);
        res.status(500).json({ error: "Failed to log meal" });
    }
};

// Get last 7 days nutrition history
exports.getHistory = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const logs = await DailyNutritionLog.find({
            userId: req.userId,
            date: { $gte: sevenDaysAgo },
        }).sort({ date: 1 });

        res.json(logs);
    } catch (err) {
        console.error("Error fetching nutrition history:", err);
        res.status(500).json({ error: "Failed to fetch nutrition history" });
    }
};

// Delete a meal from today's log
exports.deleteMeal = async (req, res) => {
    try {
        const { mealId } = req.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const log = await DailyNutritionLog.findOne({
            userId: req.userId,
            date: today,
        });

        if (!log) {
            return res.status(404).json({ error: "No log found for today" });
        }

        const meal = log.meals.id(mealId);
        if (!meal) {
            return res.status(404).json({ error: "Meal not found" });
        }

        // Subtract meal values from totals
        log.caloriesConsumed -= meal.calories;
        log.proteinConsumed -= meal.protein;
        log.carbsConsumed -= meal.carbs;
        log.fatsConsumed -= meal.fats;

        // Remove meal
        meal.remove();
        await log.save();

        res.json(log);
    } catch (err) {
        console.error("Error deleting meal:", err);
        res.status(500).json({ error: "Failed to delete meal" });
    }
};
