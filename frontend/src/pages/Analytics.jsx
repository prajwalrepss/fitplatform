import { useState } from 'react';
import DaySelector from '../components/DaySelector';
import BodyHeatmap2D from '../components/BodyHeatmap2D';

export default function Analytics() {
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());

    // Mock muscle status data
    const mockMuscleStatus = {
        chest: { load: 2 },
        shoulders: { load: 1 },
        biceps: { load: 0 },
        back: { load: 3 },
        core: { load: 1 },
        triceps: { load: 2 },
        quads: { load: 1 },
        hamstrings: { load: 2 },
        glutes: { load: 1 },
        calves: { load: 0 }
    };

    const statisticsItems = [
        {
            icon: '💪',
            title: 'Workout Volume',
            subtitle: 'Track total sets and reps',
            isPro: false
        },
        {
            icon: '🔥',
            title: 'Calories Burned',
            subtitle: 'View daily calorie expenditure',
            isPro: false
        },
        {
            icon: '📊',
            title: 'Muscle Balance',
            subtitle: 'Analyze training distribution',
            isPro: true
        },
        {
            icon: '📈',
            title: 'Progressive Overload',
            subtitle: 'Monitor strength gains',
            isPro: true
        },
        {
            icon: '⏱️',
            title: 'Rest Time Analysis',
            subtitle: 'Optimize recovery periods',
            isPro: true
        }
    ];

    return (
        <div className="max-w-[900px] mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Statistics</h1>
                <p className="text-sm text-slate-400 mt-1">Track your fitness metrics</p>
            </div>

            {/* Last 7 Days Section */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-800">
                <h2 className="text-lg font-semibold text-white mb-4">Last 7 days body graph</h2>
                <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
            </div>

            {/* 2D Body Heatmap */}
            <BodyHeatmap2D muscleStatus={mockMuscleStatus} />

            {/* Divider */}
            <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-800"></div>
                <span className="text-sm text-slate-500 font-medium">Advanced statistics</span>
                <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Statistics List */}
            <div className="space-y-3">
                {statisticsItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:bg-slate-800 transition cursor-pointer group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">{item.icon}</div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white font-medium">{item.title}</h3>
                                        {item.isPro && (
                                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs font-semibold rounded-full">
                                                PRO
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 mt-0.5">{item.subtitle}</p>
                                </div>
                            </div>
                            <svg
                                className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
