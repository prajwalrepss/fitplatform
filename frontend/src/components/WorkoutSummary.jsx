import { useState, useEffect } from 'react';

export default function WorkoutSummary({ isActive, muscleStatus, startTime }) {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!isActive || !startTime) {
            setDuration(0);
            return;
        }

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
            setDuration(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, startTime]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const getTopMuscle = () => {
        if (!muscleStatus || Object.keys(muscleStatus).length === 0) return null;

        const entries = Object.entries(muscleStatus);
        const sorted = entries.sort((a, b) => (b[1].load || 0) - (a[1].load || 0));

        return sorted[0] ? { name: sorted[0][0], load: sorted[0][1].load || 0 } : null;
    };

    const totalExercises = muscleStatus ?
        Object.values(muscleStatus).reduce((sum, m) => sum + (m.load || 0), 0) : 0;

    const topMuscle = getTopMuscle();

    if (!isActive) {
        return (
            <div className="bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-700/50">
                <p className="text-slate-500">Start a workout to begin tracking</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4">Session Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Duration */}
                <div className="text-center">
                    <p className="text-sm text-slate-400 mb-1">Duration</p>
                    <p className="text-2xl font-bold text-white font-mono">{formatTime(duration)}</p>
                </div>

                {/* Total Load */}
                <div className="text-center">
                    <p className="text-sm text-slate-400 mb-1">Total Load</p>
                    <p className="text-2xl font-bold text-blue-500">{totalExercises}</p>
                </div>

                {/* Top Muscle */}
                <div className="text-center">
                    <p className="text-sm text-slate-400 mb-1">Top Muscle</p>
                    <p className="text-xl font-bold text-white capitalize">
                        {topMuscle ? topMuscle.name.replace('_', ' ') : '-'}
                    </p>
                    {topMuscle && (
                        <span className={`text-xs px-2 py-1 rounded-full ${topMuscle.load >= 3 ? 'bg-red-500/20 text-red-500' :
                                topMuscle.load === 2 ? 'bg-green-500/20 text-green-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                            }`}>
                            Load: {topMuscle.load}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
