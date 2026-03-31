import { useState, useEffect } from 'react';
import { workoutAPI, exerciseAPI } from '../api';
import MuscleHeatmap3D from '../components/MuscleHeatmap3D';
import WorkoutHeader from '../components/WorkoutHeader';
import WorkoutSummary from '../components/WorkoutSummary';

export default function Workout() {
    const [isActive, setIsActive] = useState(false);
    const [muscleStatus, setMuscleStatus] = useState({});
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!searchQuery.trim()) {
                setFilteredExercises(exercises);
            } else {
                const filtered = exercises.filter(ex =>
                    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ex.primaryMuscle?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredExercises(filtered);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, exercises]);

    const loadInitialData = async () => {
        try {
            const [exercisesRes, statusRes] = await Promise.all([
                exerciseAPI.getAll(),
                workoutAPI.status().catch(() => ({ data: {} })),
            ]);

            setExercises(Array.isArray(exercisesRes.data) ? exercisesRes.data : []);
            setFilteredExercises(Array.isArray(exercisesRes.data) ? exercisesRes.data : []);

            if (statusRes.data && typeof statusRes.data === 'object') {
                setMuscleStatus(statusRes.data || {});
                setIsActive(!!statusRes.data.active);
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            setError('Failed to load workout data');
            setExercises([]);
            setFilteredExercises([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStartWorkout = async () => {
        try {
            await workoutAPI.start();
            setIsActive(true);
            setMuscleStatus({});
            setStartTime(new Date());
            setError('');
        } catch (err) {
            console.error('Failed to start workout:', err);
            setError('Failed to start workout');
        }
    };

    const handleEndWorkout = async () => {
        try {
            const response = await workoutAPI.end();
            setIsActive(false);
            setMuscleStatus({});
            setStartTime(null);

            if (response.data?.session?.durationSeconds) {
                const minutes = Math.floor(response.data.session.durationSeconds / 60);
                alert(`Workout completed! Duration: ${minutes} minutes`);
            }
        } catch (err) {
            console.error('Failed to end workout:', err);
            setError('Failed to end workout');
        }
    };

    const handleAddExercise = async (exerciseId) => {
        if (!isActive) {
            setError('Start a workout first');
            return;
        }

        try {
            const response = await workoutAPI.addExercise(exerciseId);
            if (response.data) {
                setMuscleStatus(response.data);
            }
            setError('');
        } catch (err) {
            console.error('Failed to add exercise:', err);
            setError('Failed to add exercise');
        }
    };

    const getDifficultyBadge = (difficulty) => {
        const colors = {
            beginner: 'text-green-500',
            intermediate: 'text-yellow-500',
            advanced: 'text-red-500'
        };
        return colors[difficulty] || 'text-slate-500';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-slate-400">Loading workout...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <WorkoutHeader isActive={isActive} />

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* LEFT: 3D Muscle View */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-card-dark border border-border-dark rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Muscle Activation</h2>
                        <div className="h-[500px] relative">
                            {exercises.length > 0 ? (
                                <MuscleHeatmap3D muscleStatus={muscleStatus} />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-text-secondary text-sm">3D model loading...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Controls */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Start/End Button */}
                    <div className="bg-card-dark border border-border-dark rounded-2xl p-6">
                        {!isActive ? (
                            <button
                                onClick={handleStartWorkout}
                                className="w-full bg-primary hover:bg-primary/90 text-sidebar-dark rounded-xl px-4 py-3 transition text-sm font-semibold"
                            >
                                Start Workout
                            </button>
                        ) : (
                            <button
                                onClick={handleEndWorkout}
                                className="w-full bg-card-dark hover:bg-border-dark text-text-secondary rounded-xl px-4 py-3 transition text-sm font-semibold"
                            >
                                End Workout
                            </button>
                        )}
                    </div>

                    {/* Exercise Search & List */}
                    {isActive && (
                        <div className="bg-card-dark border border-border-dark rounded-2xl p-6">
                            <h3 className="text-sm font-semibold text-white mb-4">Add Exercise</h3>

                            <input
                                type="text"
                                placeholder="Search exercises..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-background-dark border border-border-dark text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition text-sm mb-4"
                            />

                            <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                                {!Array.isArray(filteredExercises) || filteredExercises.length === 0 ? (
                                    <p className="text-text-secondary text-center py-8 text-sm">No exercises found</p>
                                ) : (
                                    filteredExercises.map((exercise) => (
                                        <div
                                            key={exercise.id}
                                            onClick={() => handleAddExercise(exercise.id)}
                                            className="bg-card-dark border border-border-dark rounded-xl p-4 hover:bg-border-dark cursor-pointer transition"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white text-sm font-medium mb-1">
                                                        {exercise.name}
                                                    </h4>
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="text-text-secondary capitalize">
                                                            {exercise.primaryMuscle}
                                                        </span>
                                                        <span className={getDifficultyBadge(exercise.difficulty)}>
                                                            {exercise.difficulty}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="flex-shrink-0 w-6 h-6 rounded-full bg-primary hover:bg-primary/90 text-sidebar-dark flex items-center justify-center transition text-xs font-semibold">
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {!isActive && (
                        <div className="bg-card-dark border border-border-dark rounded-2xl p-8 text-center">
                            <p className="text-text-secondary text-sm">Start a workout to track exercises</p>
                        </div>
                    )}
                </div>
            </div>

            <WorkoutSummary
                isActive={isActive}
                muscleStatus={muscleStatus}
                startTime={startTime}
            />
        </div>
    );
}
