import { useState, useEffect } from 'react';
import { exerciseAPI, setsAPI } from '../api';

export default function Progress() {
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [bestRecords, setBestRecords] = useState(null);
    const [progressData, setProgressData] = useState([]);
    const [formData, setFormData] = useState({
        weight: '',
        reps: '',
        sets: '',
    });
    const [loading, setLoading] = useState(true);
    const [showPRBanner, setShowPRBanner] = useState(false);
    const [prMessage, setPRMessage] = useState('');

    useEffect(() => {
        loadExercises();
    }, []);

    useEffect(() => {
        if (selectedExercise) {
            loadExerciseData(selectedExercise);
        }
    }, [selectedExercise]);

    const loadExercises = async () => {
        try {
            const response = await exerciseAPI.getAll();
            setExercises(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load exercises:', err);
            setLoading(false);
        }
    };

    const loadExerciseData = async (exerciseId) => {
        try {
            const [bestRes, progressRes] = await Promise.all([
                setsAPI.best(exerciseId),
                setsAPI.progress(exerciseId),
            ]);

            setBestRecords(bestRes.data);
            setProgressData(progressRes.data);
        } catch (err) {
            console.error('Failed to load exercise data:', err);
        }
    };

    const handleLogSet = async (e) => {
        e.preventDefault();

        if (!selectedExercise) {
            alert('Please select an exercise first');
            return;
        }

        try {
            const response = await setsAPI.add({
                exerciseId: selectedExercise,
                weight: parseFloat(formData.weight),
                reps: parseInt(formData.reps),
                sets: parseInt(formData.sets),
            });

            // Check if it's a PR
            if (response.data.isPR) {
                setShowPRBanner(true);
                setPRMessage(response.data.message);
                setTimeout(() => setShowPRBanner(false), 5000);
            }

            // Reload data
            loadExerciseData(selectedExercise);

            // Reset form
            setFormData({ weight: '', reps: '', sets: '' });
        } catch (err) {
            alert('Failed to log set');
        }
    };

    const maxVolume = progressData.length > 0
        ? Math.max(...progressData.map(d => d.volume))
        : 100;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-white">Progress Tracking</h1>

            {/* PR Banner */}
            {showPRBanner && (
                <div className="bg-green-500 text-white px-6 py-4 rounded-lg text-center animate-pulse">
                    <p className="text-2xl font-bold">🎉 {prMessage} 🎉</p>
                </div>
            )}

            {/* Exercise Selector */}
            <div className="card">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Exercise
                </label>
                <select
                    className="input-field"
                    value={selectedExercise || ''}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                >
                    <option value="">-- Choose an exercise --</option>
                    {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedExercise && bestRecords && (
                <>
                    {/* Best Records */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card">
                            <p className="text-gray-400 text-sm">Best Weight</p>
                            <p className="text-4xl font-bold text-white mt-2">
                                {bestRecords.bestWeight} lbs
                            </p>
                        </div>
                        <div className="card">
                            <p className="text-gray-400 text-sm">Best Volume</p>
                            <p className="text-4xl font-bold text-white mt-2">
                                {bestRecords.bestVolume.toLocaleString()}
                            </p>
                        </div>
                        <div className="card">
                            <p className="text-gray-400 text-sm">Best 1RM (Est.)</p>
                            <p className="text-4xl font-bold text-white mt-2">
                                {bestRecords.best1RM.toFixed(1)} lbs
                            </p>
                        </div>
                    </div>

                    {/* Progress Chart */}
                    {progressData.length > 0 && (
                        <div className="card">
                            <h2 className="text-xl font-bold text-white mb-4">Volume Over Time</h2>
                            <div className="flex items-end justify-between h-64 gap-2">
                                {progressData.slice(-20).map((point, index) => {
                                    const height = (point.volume / maxVolume) * 100;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div className="w-full flex items-end justify-center h-full">
                                                <div
                                                    className="bg-purple-600 w-full rounded-t-lg transition-all hover:bg-purple-500"
                                                    style={{ height: `${height}%` }}
                                                    title={`${point.volume} volume`}
                                                />
                                            </div>
                                            <p className="text-white text-xs font-bold mt-2">
                                                {point.volume}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {new Date(point.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Log Set Form */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-white mb-4">Log New Set</h2>
                        <form onSubmit={handleLogSet} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Weight (lbs)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="input-field"
                                        value={formData.weight}
                                        onChange={(e) =>
                                            setFormData({ ...formData, weight: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Reps
                                    </label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.reps}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reps: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Sets
                                    </label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.sets}
                                        onChange={(e) =>
                                            setFormData({ ...formData, sets: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full">
                                Log Set
                            </button>
                        </form>
                    </div>
                </>
            )}

            {selectedExercise && !bestRecords && (
                <div className="card text-center">
                    <p className="text-gray-400">No data yet. Log your first set above!</p>
                </div>
            )}
        </div>
    );
}
