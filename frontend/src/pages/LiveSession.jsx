import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { liveWorkoutAPI, exerciseAPI } from '../api';

export default function LiveSession() {
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState('');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [loading, setLoading] = useState(true);

    // Load session and exercises
    useEffect(() => {
        const loadSession = async () => {
            try {
                const [sessionRes, exercisesRes] = await Promise.all([
                    liveWorkoutAPI.getLiveStatus(),
                    exerciseAPI.getAll()
                ]);

                if (!sessionRes.data.active) {
                    // No active session, redirect to dashboard
                    navigate('/dashboard');
                    return;
                }

                setSession(sessionRes.data.session);
                setAvailableExercises(exercisesRes.data || []);
                setLoading(false);
            } catch (err) {
                console.error('Error loading session:', err);
                navigate('/dashboard');
            }
        };
        loadSession();
    }, [navigate]);

    // Timer
    useEffect(() => {
        if (!session) return;

        const startTime = new Date(session.startedAt).getTime();
        const timer = setInterval(() => {
            const now = Date.now();
            setElapsedSeconds(Math.floor((now - startTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [session]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Add exercise
    const addExercise = async () => {
        if (!selectedExerciseId) return;

        const exercise = availableExercises.find(ex => ex.id === selectedExerciseId);
        if (!exercise) return;

        try {
            const res = await liveWorkoutAPI.addExerciseLive(exercise.id, exercise.name);
            setSession(res.data);
            setSelectedExerciseId('');
        } catch (err) {
            console.error('Error adding exercise:', err);
            alert('Failed to add exercise');
        }
    };

    // Add set
    const addSet = async (exerciseIndex, weight, reps) => {
        try {
            const res = await liveWorkoutAPI.addSetLive(exerciseIndex, weight, reps);
            setSession(res.data);
        } catch (err) {
            console.error('Error adding set:', err);
            alert('Failed to add set');
        }
    };

    // End session
    const endSession = async () => {
        const confirmed = window.confirm('End this workout session? Your progress will be saved.');
        if (!confirmed) return;

        try {
            await liveWorkoutAPI.endLive();
            navigate('/dashboard');
        } catch (err) {
            console.error('Error ending session:', err);
            alert('Failed to end session');
        }
    };

    // Cancel session
    const cancelSession = async () => {
        const confirmed = window.confirm('Cancel this workout? All progress will be lost.');
        if (!confirmed) return;

        try {
            await liveWorkoutAPI.cancelLive();
            navigate('/dashboard');
        } catch (err) {
            console.error('Error cancelling session:', err);
            alert('Failed to cancel session');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-xl">Loading session...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header with Timer */}
            <div className="bg-card-dark border border-border-dark rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-white">Live Workout</h1>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary animate-pulse">radio_button_checked</span>
                        <span className="text-text-secondary text-sm">LIVE</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">timer</span>
                        <span className="text-4xl font-mono font-bold text-white tabular-nums">
                            {formatTime(elapsedSeconds)}
                        </span>
                    </div>
                    <div className="flex-1"></div>
                    <button
                        onClick={endSession}
                        className="bg-primary text-sidebar-dark px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                        End Session
                    </button>
                    <button
                        onClick={cancelSession}
                        className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Add Exercise */}
            <div className="bg-card-dark border border-border-dark rounded-xl p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Add Exercise</h2>
                <div className="flex gap-3">
                    <select
                        value={selectedExerciseId}
                        onChange={(e) => setSelectedExerciseId(e.target.value)}
                        className="flex-1 bg-background-dark border border-border-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                    >
                        <option value="">Select an exercise...</option>
                        {availableExercises.map(ex => (
                            <option key={ex.id} value={ex.id}>{ex.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={addExercise}
                        disabled={!selectedExerciseId}
                        className="bg-primary text-sidebar-dark px-5 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add Exercise
                    </button>
                </div>
            </div>

            {/* Exercises & Sets */}
            <div className="space-y-4">
                {session?.exercises && session.exercises.length > 0 ? (
                    session.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="bg-card-dark border border-border-dark rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">{exercise.exerciseName}</h3>

                            {/* Existing Sets */}
                            <div className="space-y-2 mb-4">
                                {exercise.sets && exercise.sets.map((set, setIndex) => (
                                    <div key={setIndex} className="flex items-center gap-3 bg-background-dark p-3 rounded-lg">
                                        <span className="text-primary font-bold text-sm w-20">Set {setIndex + 1}</span>
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className="text-white font-mono">{set.weight || 0} kg</span>
                                            <span className="text-text-secondary">×</span>
                                            <span className="text-white font-mono">{set.reps} reps</span>
                                        </div>
                                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                                    </div>
                                ))}
                            </div>

                            {/* Add Set Form */}
                            <div className="flex items-center gap-3 bg-background-dark p-4 rounded-lg">
                                <span className="text-text-secondary text-sm">New Set:</span>
                                <input
                                    type="number"
                                    id={`live-weight-${exerciseIndex}`}
                                    placeholder="Weight (kg)"
                                    className="w-32 bg-card-dark border border-border-dark text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <span className="text-text-secondary">×</span>
                                <input
                                    type="number"
                                    id={`live-reps-${exerciseIndex}`}
                                    placeholder="Reps"
                                    className="w-24 bg-card-dark border border-border-dark text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    onClick={() => {
                                        const weight = parseFloat(document.getElementById(`live-weight-${exerciseIndex}`).value);
                                        const reps = parseInt(document.getElementById(`live-reps-${exerciseIndex}`).value);
                                        if (reps > 0) {
                                            addSet(exerciseIndex, weight || 0, reps);
                                            document.getElementById(`live-weight-${exerciseIndex}`).value = '';
                                            document.getElementById(`live-reps-${exerciseIndex}`).value = '';
                                        }
                                    }}
                                    className="bg-primary text-sidebar-dark px-4 py-2 rounded font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Add Set
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-card-dark border border-border-dark rounded-xl p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-text-secondary/30 mb-4 block">fitness_center</span>
                        <p className="text-text-secondary">No exercises added yet. Add one above to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
