import { useState, useEffect } from 'react';
import { analyticsAPI, workoutAPI } from '../api';
import StatCard from '../components/StatCard';

export default function Home() {
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0
    });
    const [recentWorkouts, setRecentWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [summaryRes, historyRes] = await Promise.all([
                analyticsAPI.summary().catch(() => ({ data: {} })),
                workoutAPI.history().catch(() => ({ data: { sessions: [] } }))
            ]);

            if (summaryRes.data && typeof summaryRes.data === 'object') {
                setStats({
                    totalWorkouts: summaryRes.data.totalSessions || 0,
                    totalMinutes: summaryRes.data.totalMinutes || 0,
                    currentStreak: summaryRes.data.currentStreak || 0,
                    longestStreak: summaryRes.data.longestStreak || 0
                });
            }

            if (historyRes.data && Array.isArray(historyRes.data.sessions)) {
                setRecentWorkouts(historyRes.data.sessions.slice(0, 5));
            }
        } catch (err) {
            console.error('Failed to load home data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0m';
        const mins = Math.floor(seconds / 60);
        return `${mins}m`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-slate-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                <p className="text-sm text-slate-400 mt-1">Track your fitness journey</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Workouts"
                    value={stats.totalWorkouts}
                    subtitle="All time"
                />
                <StatCard
                    title="Total Minutes"
                    value={stats.totalMinutes}
                    subtitle="Training time"
                />
                <StatCard
                    title="Current Streak"
                    value={stats.currentStreak}
                    subtitle="Days"
                />
                <StatCard
                    title="Longest Streak"
                    value={stats.longestStreak}
                    subtitle="Personal best"
                />
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Workouts */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Recent Workouts</h2>
                    <div className="space-y-3">
                        {!Array.isArray(recentWorkouts) || recentWorkouts.length === 0 ? (
                            <p className="text-sm text-slate-500">No workouts yet</p>
                        ) : (
                            recentWorkouts.map((workout, index) => (
                                <div
                                    key={workout._id || index}
                                    className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm text-white">{formatDate(workout.createdAt)}</p>
                                        <p className="text-xs text-slate-500">
                                            {workout.exercises?.length || 0} exercises
                                        </p>
                                    </div>
                                    <span className="text-sm text-slate-400">
                                        {formatDuration(workout.durationSeconds)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Weekly Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Weekly Summary</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Workouts this week</span>
                            <span className="text-lg font-semibold text-white">-</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Total volume</span>
                            <span className="text-lg font-semibold text-white">-</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Avg duration</span>
                            <span className="text-lg font-semibold text-white">-</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">Data updates after each workout</p>
                </div>
            </div>
        </div>
    );
}
