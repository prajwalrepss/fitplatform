import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { liveWorkoutAPI, exerciseAPI } from '../api';

export default function LogWorkout() {
    const navigate = useNavigate();

    const [exercises, setExercises] = useState([]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState('');
    const [duration, setDuration] = useState(60);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch available exercises
    useEffect(() => {
        const loadExercises = async () => {
            try {
                const res = await exerciseAPI.getAll();
                setAvailableExercises(res.data || []);
            } catch (err) {
                console.error('Error loading exercises:', err);
            }
        };
        loadExercises();
    }, []);

    // Add exercise to workout
    const addExercise = () => {
        if (!selectedExerciseId) return;

        const exercise = availableExercises.find(ex => ex.id === selectedExerciseId);
        if (!exercise) return;

        setExercises([
            ...exercises,
            { exerciseId: exercise.id, exerciseName: exercise.name, sets: [] }
        ]);
        setSelectedExerciseId('');
    };

    // Add set to exercise
    const addSet = (exerciseIndex, weight, reps) => {
        const updated = [...exercises];
        updated[exerciseIndex].sets.push({ weight: weight || 0, reps: reps || 0 });
        setExercises(updated);
    };

    // Remove set from exercise
    const removeSet = (exerciseIndex, setIndex) => {
        const updated = [...exercises];
        updated[exerciseIndex].sets.splice(setIndex, 1);
        setExercises(updated);
    };

    // Remove exercise
    const removeExercise = (exerciseIndex) => {
        const updated = exercises.filter((_, i) => i !== exerciseIndex);
        setExercises(updated);
    };

    // Save workout
    const handleSave = async () => {
        if (exercises.length === 0) {
            alert('Please add at least one exercise');
            return;
        }

        try {
            setLoading(true);
            await liveWorkoutAPI.logWorkout({
                exercises,
                duration,
                notes,
            });
            navigate('/dashboard');
        } catch (err) {
            console.error('Error logging workout:', err);
            alert('Failed to log workout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Log Workout</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-text-secondary hover:text-white transition-colors"
                >
                    Cancel
                </button>
            </div>

            {/* Exercise Selector */}
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
                        Add
                    </button>
                </div>
            </div>

            {/* Added Exercises */}
            <div className="space-y-4 mb-6">
                {exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="bg-card-dark border border-border-dark rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">{exercise.exerciseName}</h3>
                            <button
                                onClick={() => removeExercise(exerciseIndex)}
                                className="text-red-500 hover:text-red-400 transition-colors"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>

                        {/* Sets */}
                        <div className="space-y-2 mb-3">
                            {exercise.sets.map((set, setIndex) => (
                                <div key={setIndex} className="flex items-center gap-3 bg-background-dark p-3 rounded-lg">
                                    <span className="text-text-secondary text-sm w-16">Set {setIndex + 1}</span>
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="number"
                                            value={set.weight}
                                            readOnly
                                            className="w-20 bg-card-dark border border-border-dark text-white px-3 py-1 rounded text-sm"
                                            placeholder="Weight"
                                        />
                                        <span className="text-text-secondary text-xs">kg ×</span>
                                        <input
                                            type="number"
                                            value={set.reps}
                                            readOnly
                                            className="w-16 bg-card-dark border border-border-dark text-white px-3 py-1 rounded text-sm"
                                            placeholder="Reps"
                                        />
                                        <span className="text-text-secondary text-xs">reps</span>
                                    </div>
                                    <button
                                        onClick={() => removeSet(exerciseIndex, setIndex)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Set Form */}
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                id={`weight-${exerciseIndex}`}
                                placeholder="Weight (kg)"
                                className="w-32 bg-background-dark border border-border-dark text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="number"
                                id={`reps-${exerciseIndex}`}
                                placeholder="Reps"
                                className="w-24 bg-background-dark border border-border-dark text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                onClick={() => {
                                    const weight = parseFloat(document.getElementById(`weight-${exerciseIndex}`).value);
                                    const reps = parseInt(document.getElementById(`reps-${exerciseIndex}`).value);
                                    if (reps > 0) {
                                        addSet(exerciseIndex, weight, reps);
                                        document.getElementById(`weight-${exerciseIndex}`).value = '';
                                        document.getElementById(`reps-${exerciseIndex}`).value = '';
                                    }
                                }}
                                className="text-primary hover:text-primary/80 text-sm font-medium"
                            >
                                + Add Set
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Duration & Notes */}
            <div className="bg-card-dark border border-border-dark rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                            className="w-full bg-background-dark border border-border-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Notes (optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full bg-background-dark border border-border-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="How did it go?"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    disabled={loading || exercises.length === 0}
                    className="flex-1 bg-primary text-sidebar-dark px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : 'Save Workout'}
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 border border-border-dark text-text-secondary rounded-lg hover:border-primary/50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
