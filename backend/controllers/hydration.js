const HydrationLog = require("../models/HydrationLog");

// Get today's hydration
exports.getTodayHydration = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let log = await HydrationLog.findOne({
            userId: req.userId,
            date: today,
        });

        // Create if doesn't exist
        if (!log) {
            log = await HydrationLog.create({
                userId: req.userId,
                date: today,
                totalWaterMl: 0,
                entries: [],
            });
        }

        res.json(log);
    } catch (err) {
        console.error("Error fetching today's hydration:", err);
        res.status(500).json({ error: "Failed to fetch today's hydration" });
    }
};

// Add water
exports.addWater = async (req, res) => {
    try {
        const { amountMl } = req.body;

        if (!amountMl || amountMl <= 0) {
            return res.status(400).json({ error: "Valid amount required" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let log = await HydrationLog.findOne({
            userId: req.userId,
            date: today,
        });

        if (!log) {
            log = await HydrationLog.create({
                userId: req.userId,
                date: today,
                totalWaterMl: amountMl,
                entries: [{ amountMl, time: new Date() }],
            });
        } else {
            log.totalWaterMl += amountMl;
            log.entries.push({ amountMl, time: new Date() });
            await log.save();
        }

        res.json(log);
    } catch (err) {
        console.error("Error adding water:", err);
        res.status(500).json({ error: "Failed to add water" });
    }
};

// Get last 7 days hydration history
exports.getHistory = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const logs = await HydrationLog.find({
            userId: req.userId,
            date: { $gte: sevenDaysAgo },
        }).sort({ date: 1 });

        res.json(logs);
    } catch (err) {
        console.error("Error fetching hydration history:", err);
        res.status(500).json({ error: "Failed to fetch hydration history" });
    }
};
