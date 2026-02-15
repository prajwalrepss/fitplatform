export default function ExerciseCard({ exercise, onAdd }) {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'intermediate':
                return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'advanced':
                return 'bg-red-500/20 text-red-500 border-red-500/30';
            default:
                return 'bg-slate-500/20 text-slate-500 border-slate-500/30';
        }
    };

    const getMuscleColor = (muscle) => {
        const colors = {
            chest: 'bg-blue-500/20 text-blue-400',
            back: 'bg-purple-500/20 text-purple-400',
            shoulders: 'bg-orange-500/20 text-orange-400',
            biceps: 'bg-pink-500/20 text-pink-400',
            triceps: 'bg-indigo-500/20 text-indigo-400',
            forearms: 'bg-cyan-500/20 text-cyan-400',
            quads: 'bg-emerald-500/20 text-emerald-400',
            hamstrings: 'bg-lime-500/20 text-lime-400',
            glutes: 'bg-amber-500/20 text-amber-400',
            calves: 'bg-teal-500/20 text-teal-400',
            core: 'bg-rose-500/20 text-rose-400',
        };
        return colors[muscle] || 'bg-slate-500/20 text-slate-400';
    };

    return (
        <div className="group bg-slate-800/50 hover:bg-slate-700 rounded-xl p-4 transition-all duration-200 border border-slate-700/50 hover:border-blue-500/30 hover:shadow-lg cursor-pointer"
            onClick={() => onAdd(exercise.id)}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                        {exercise.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {/* Primary Muscle Badge */}
                        <span className={`text-xs uppercase tracking-wide px-2 py-1 rounded-full font-semibold ${getMuscleColor(exercise.primaryMuscle)}`}>
                            {exercise.primaryMuscle}
                        </span>

                        {/* Difficulty Badge */}
                        <span className={`text-xs uppercase tracking-wide px-2 py-1 rounded-full border font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                        </span>
                    </div>
                </div>

                {/* Add Button */}
                <button
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all hover:scale-110"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd(exercise.id);
                    }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
