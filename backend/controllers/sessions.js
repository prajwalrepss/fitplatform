const ScheduledSession = require("../models/ScheduledSession");

// Get all scheduled sessions for user
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await ScheduledSession.find({ userId: req.userId })
            .sort({ scheduledDate: 1 });

        res.json(sessions);
    } catch (err) {
        console.error("Error fetching sessions:", err);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
};

// Create new scheduled session
exports.createSession = async (req, res) => {
    try {
        const { title, type, scheduledDate, duration, notes } = req.body;

        if (!title || !type || !scheduledDate || !duration) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const session = await ScheduledSession.create({
            userId: req.userId,
            title,
            type,
            scheduledDate: new Date(scheduledDate),
            duration,
            notes,
        });

        res.status(201).json(session);
    } catch (err) {
        console.error("Error creating session:", err);
        res.status(500).json({ error: "Failed to create session" });
    }
};

// Update scheduled session
exports.updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const session = await ScheduledSession.findOneAndUpdate(
            { _id: id, userId: req.userId },
            updates,
            { new: true, runValidators: true }
        );

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json(session);
    } catch (err) {
        console.error("Error updating session:", err);
        res.status(500).json({ error: "Failed to update session" });
    }
};

// Delete scheduled session
exports.deleteSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await ScheduledSession.findOneAndDelete({
            _id: id,
            userId: req.userId,
        });

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json({ message: "Session deleted successfully" });
    } catch (err) {
        console.error("Error deleting session:", err);
        res.status(500).json({ error: "Failed to delete session" });
    }
};

// Mark session as completed
exports.completeSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await ScheduledSession.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { completed: true, completedAt: new Date() },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        res.json(session);
    } catch (err) {
        console.error("Error completing session:", err);
        res.status(500).json({ error: "Failed to complete session" });
    }
};

// Get upcoming sessions (next 3)
exports.getUpcoming = async (req, res) => {
    try {
        const now = new Date();

        const sessions = await ScheduledSession.find({
            userId: req.userId,
            scheduledDate: { $gte: now },
            completed: false,
        })
            .sort({ scheduledDate: 1 })
            .limit(3);

        res.json(sessions);
    } catch (err) {
        console.error("Error fetching upcoming sessions:", err);
        res.status(500).json({ error: "Failed to fetch upcoming sessions" });
    }
};
