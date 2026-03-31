const ActiveWorkoutSession = require("../models/ActiveWorkoutSession");
const WorkoutSession = require("../models/WorkoutSession");
const { calculateMuscleLoad } = require("../utils/muscleEngine");

// Start a live workout session
exports.startLiveSession = async (req, res, next) => {
    try {
        const existingSession = await ActiveWorkoutSession.findOne({ userId: req.userId });

        if (existingSession) {
            return res.status(400).json({
                success: false,
                message: "You already have an active workout session",
                data: existingSession,
            });
        }

        const session = await ActiveWorkoutSession.create({
            userId: req.userId,
            startedAt: new Date(),
            exercises: [],
            currentExerciseIndex: 0,
            lastActivity: new Date(),
        });

        res.status(201).json({ success: true, data: session });
    } catch (err) {
        next(err);
    }
};

// Add exercise to live session
exports.addExerciseToLive = async (req, res, next) => {
    try {
        const { exerciseId, exerciseName } = req.body;

        if (!exerciseId || !exerciseName) {
            return res.status(400).json({ success: false, message: "Exercise ID and name required" });
        }

        const session = await ActiveWorkoutSession.findOne({ userId: req.userId });

        if (!session) {
            return res.status(404).json({ success: false, message: "No active session found" });
        }

        session.exercises.push({ exerciseId, exerciseName, sets: [] });
        session.lastActivity = new Date();
        await session.save();

        res.json({ success: true, data: session });
    } catch (err) {
        next(err);
    }
};

// Add set to live session
exports.addSetToLive = async (req, res, next) => {
    try {
        const { exerciseIndex, weight, reps } = req.body;

        if (exerciseIndex === undefined || reps === undefined) {
            return res.status(400).json({ success: false, message: "Exercise index and reps required" });
        }

        const session = await ActiveWorkoutSession.findOne({ userId: req.userId });

        if (!session) {
            return res.status(404).json({ success: false, message: "No active session found" });
        }

        if (exerciseIndex >= session.exercises.length) {
            return res.status(400).json({ success: false, message: "Invalid exercise index" });
        }

        session.exercises[exerciseIndex].sets.push({
            weight: weight || 0,
            reps,
            completed: true,
            timestamp: new Date(),
        });
        session.lastActivity = new Date();
        await session.save();

        res.json({ success: true, data: session });
    } catch (err) {
        next(err);
    }
};

// End live session and create completed workout
exports.endLiveSession = async (req, res, next) => {
    try {
        const session = await ActiveWorkoutSession.findOne({ userId: req.userId });

        if (!session) {
            return res.status(404).json({ success: false, message: "No active session found" });
        }

        const endTime = new Date();
        const durationMinutes = Math.round((endTime - session.startedAt) / 1000 / 60);

        // Calculate total volume
        let totalVolume = 0;
        session.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
                if (set.completed && set.weight && set.reps) {
                    totalVolume += set.weight * set.reps;
                }
            });
        });

        const caloriesBurned = Math.round(durationMinutes * 5);

        const workoutSession = await WorkoutSession.create({
            userId: req.userId,
            type: "strength",
            exercises: session.exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                exerciseName: ex.exerciseName,
                sets: ex.sets.map(set => ({
                    weight: set.weight,
                    reps: set.reps,
                    completed: set.completed,
                })),
            })),
            totalVolume,
            caloriesBurned,
            activeMinutes: durationMinutes,
            startedAt: session.startedAt,
            endedAt: endTime,
            muscleLoad: calculateMuscleLoad(session.exercises),
        });

        await ActiveWorkoutSession.deleteOne({ userId: req.userId });

        res.json({
            success: true,
            data: workoutSession,
            message: "Workout completed successfully",
        });
    } catch (err) {
        next(err);
    }
};

// Get current live session status
exports.getLiveStatus = async (req, res, next) => {
    try {
        const session = await ActiveWorkoutSession.findOne({ userId: req.userId });

        if (!session) {
            return res.json({ success: true, data: { active: false, session: null } });
        }

        res.json({ success: true, data: { active: true, session } });
    } catch (err) {
        next(err);
    }
};

// Cancel live session
exports.cancelLiveSession = async (req, res, next) => {
    try {
        const result = await ActiveWorkoutSession.deleteOne({ userId: req.userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "No active session found" });
        }

        res.json({ success: true, message: "Session cancelled successfully" });
    } catch (err) {
        next(err);
    }
};

// Quick log workout (without live tracking)
exports.logWorkout = async (req, res, next) => {
    try {
        const { exercises, duration, notes, date } = req.body;

        if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return res.status(400).json({ success: false, message: "Exercises array required" });
        }

        const workoutDate = date ? new Date(date) : new Date();
        const durationMinutes = duration || 60;

        let totalVolume = 0;
        exercises.forEach(exercise => {
            if (exercise.sets && Array.isArray(exercise.sets)) {
                exercise.sets.forEach(set => {
                    if (set.weight && set.reps) {
                        totalVolume += set.weight * set.reps;
                    }
                });
            }
        });

        const caloriesBurned = Math.round(durationMinutes * 5);

        const workout = await WorkoutSession.create({
            userId: req.userId,
            type: "strength",
            exercises,
            totalVolume,
            caloriesBurned,
            activeMinutes: durationMinutes,
            startedAt: workoutDate,
            endedAt: new Date(workoutDate.getTime() + durationMinutes * 60 * 1000),
            notes,
            muscleLoad: calculateMuscleLoad(exercises),
        });

        res.status(201).json({ success: true, data: workout });
    } catch (err) {
        next(err);
    }
};
