import { useState, useEffect } from 'react';
import { splitsAPI } from '../api';

export default function Splits() {
    const [splits, setSplits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSplits();
    }, []);

    const loadSplits = async () => {
        try {
            const response = await splitsAPI.getAll();
            // Ensure splits is always an array, even if response is undefined
            setSplits(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Failed to load splits:', err);
            // Set empty array on error
            setSplits([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Workout Splits</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {splits.map((split) => (
                    <div key={split.id} className="card">
                        <h2 className="text-2xl font-bold text-white mb-4">{split.name}</h2>
                        <p className="text-gray-400 mb-4">{split.description}</p>

                        <div className="space-y-3">
                            {split.days.map((day, index) => (
                                <div key={index} className="bg-gray-700 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Day {day.day}: {day.focus}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {day.muscles.map((muscle, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full"
                                            >
                                                {muscle}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
