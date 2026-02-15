import { useState, useEffect } from 'react';

export default function ExerciseSelector({ exercises, muscles, onAddExercise }) {
    const [search, setSearch] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('all');
    const [filteredExercises, setFilteredExercises] = useState([]);

    useEffect(() => {
        let filtered = exercises;

        // Filter by search
        if (search) {
            filtered = filtered.filter((ex) =>
                ex.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter by muscle
        if (selectedMuscle !== 'all') {
            filtered = filtered.filter((ex) =>
                ex.primary.includes(selectedMuscle) || ex.secondary?.includes(selectedMuscle)
            );
        }

        setFilteredExercises(filtered);
    }, [search, selectedMuscle, exercises]);

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Add Exercise</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search exercises..."
                className="input-field mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Muscle Filter */}
            <select
                className="input-field mb-4"
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
            >
                <option value="all">All Muscles</option>
                {muscles.map((muscle) => (
                    <option key={muscle.id} value={muscle.id}>
                        {muscle.name}
                    </option>
                ))}
            </select>

            {/* Exercise List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredExercises.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No exercises found</p>
                ) : (
                    filteredExercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 cursor-pointer transition-colors"
                            onClick={() => onAddExercise(exercise.id)}
                        >
                            <h3 className="text-white font-medium">{exercise.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                Primary: {exercise.primary.join(', ')}
                            </p>
                            {exercise.secondary && exercise.secondary.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Secondary: {exercise.secondary.join(', ')}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
