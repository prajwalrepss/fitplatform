import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, hydrationAPI, liveWorkoutAPI } from '../api';
import { BodyHeatmap } from '../components/muscle-heatmap';

export default function DashboardHome() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current date info
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    // Fetch dashboard metrics
    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await dashboardAPI.getMetrics();
            setMetrics(res.data);
        } catch (err) {
            console.error('Error fetching dashboard metrics:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    // Handle Log Workout button
    const handleLogWorkout = () => {
        navigate('/dashboard/log-workout');
    };

    // Handle Start Session button
    const handleStartSession = async () => {
        try {
            await liveWorkoutAPI.startLive();
            navigate('/dashboard/live-session');
        } catch (err) {
            console.error('Error starting session:', err);
            alert(err.response?.data?.error || 'Failed to start session');
        }
    };

    // Handle Add Water button
    const handleAddWater = async (amountMl) => {
        try {
            await hydrationAPI.addWater(amountMl);
            await fetchMetrics(); // Refresh metrics
        } catch (err) {
            console.error('Error adding water:', err);
            alert('Failed to add water');
        }
    };

    // Handle session click
    const handleSessionClick = async (sessionId) => {
        const confirmed = window.confirm('Start this scheduled session now?');
        if (confirmed) {
            try {
                await liveWorkoutAPI.startLive();
                navigate('/dashboard/live-session');
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to start session');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-xl">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 text-xl">{error}</p>
            </div>
        );
    }

    const { calories, activeMinutes, workoutStreak, hydration, upcomingSessions } = metrics || {};

    return (
        <div className="p-10">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
                {/* Header */}
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border-dark/50 pb-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-light text-white tracking-tight">
                            Welcome back, <span className="font-bold">{user?.username || 'User'}</span>
                        </h2>
                        <p className="text-text-secondary text-base font-light">
                            {dateString} • Let's crush your goals.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleLogWorkout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-card-dark border border-border-dark rounded hover:border-primary/50 transition-colors group">
                            <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-sm">add</span>
                            <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">Log Workout</span>
                        </button>
                        <button
                            onClick={handleStartSession}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-sidebar-dark rounded font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(212,175,53,0.15)]">
                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                            <span className="text-sm">Start Session</span>
                        </button>
                    </div>
                </header>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Calories Card */}
                    <div className="flex flex-col gap-4 p-6 rounded-lg bg-card-dark border border-border-dark relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-primary">local_fire_department</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Today's Calories</p>
                            <span className="material-symbols-outlined text-primary">local_fire_department</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-white">{calories?.consumed || 0}</span>
                            <span className="text-sm text-text-secondary">/ {calories?.target || 2500} kcal</span>
                        </div>
                        <div className="w-full bg-border-dark h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(calories?.percentage || 0, 100)}%` }}></div>
                        </div>
                    </div>

                    {/* Active Minutes Card */}
                    <div className="flex flex-col gap-4 p-6 rounded-lg bg-card-dark border border-border-dark relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-primary">timer</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Active Minutes</p>
                            <span className="material-symbols-outlined text-primary">timer</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-white">{activeMinutes?.today || 0}</span>
                            <span className="text-sm text-text-secondary">mins</span>
                        </div>
                        <div className="w-full bg-border-dark h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(activeMinutes?.percentage || 0, 100)}%` }}></div>
                        </div>
                    </div>

                    {/* Workout Streak Card */}
                    <div className="flex flex-col gap-4 p-6 rounded-lg bg-card-dark border border-border-dark relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-8xl text-primary">bolt</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Workout Streak</p>
                            <span className="material-symbols-outlined text-primary">bolt</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-white">{workoutStreak?.current || 0}</span>
                            <span className="text-sm text-text-secondary">Days</span>
                        </div>
                        {workoutStreak?.best > 0 && (
                            <p className="text-xs text-primary mt-3 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                Best: {workoutStreak.best} days
                            </p>
                        )}
                    </div>
                </div>

                {/* Main Content Row */}
                <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[400px]">
                    {/* Body Activation Heatmap */}
                    <div className="flex-1 bg-card-dark border border-border-dark rounded-lg p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Muscle Activation</h3>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background-dark rounded-lg text-center min-w-[64px]">
                                    <p className="text-text-secondary text-[10px] mb-0.5">Workouts</p>
                                    <p className="text-lg font-bold text-white">{workoutStreak?.current || 0}</p>
                                </div>
                                <div className="p-2 bg-background-dark rounded-lg text-center min-w-[64px]">
                                    <p className="text-text-secondary text-[10px] mb-0.5">Active</p>
                                    <p className="text-lg font-bold text-white">{activeMinutes?.today || 0}m</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <BodyHeatmap
                                muscleData={{
                                    chest_left: 2,
                                    chest_right: 2,
                                    abs_upper: 1,
                                    abs_lower: 1,
                                    quads_left: 3,
                                    quads_right: 3,
                                    shoulders_left: 1,
                                    shoulders_right: 1,
                                }}
                                onMuscleClick={(name) => console.log('Muscle clicked:', name)}
                            />
                        </div>
                    </div>

                    {/* Upcoming Sessions */}
                    <div className="w-full lg:w-[320px] bg-card-dark border border-border-dark rounded-lg p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-6">Upcoming Sessions</h3>
                        <div className="flex flex-col gap-4">
                            {upcomingSessions && upcomingSessions.length > 0 ? (
                                upcomingSessions.map((session, index) => (
                                    <div
                                        key={session.id}
                                        onClick={() => handleSessionClick(session.id)}
                                        className={`p-4 rounded border-l-2 cursor-pointer ${index === 0
                                                ? 'border-primary bg-background-dark/50'
                                                : 'border-border-dark hover:border-border-dark/80 bg-transparent opacity-60 hover:opacity-100'
                                            } transition-all`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs font-bold ${index === 0 ? 'text-primary bg-primary/10' : 'text-text-secondary'
                                                } px-2 py-0.5 rounded`}>
                                                {new Date(session.scheduledDate).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <h4 className="text-white font-semibold">{session.title}</h4>
                                        <p className="text-text-secondary text-xs mt-1">
                                            {session.duration} mins • {session.type}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-text-secondary text-sm text-center py-8">
                                    No upcoming sessions scheduled
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/sessions')}
                            className="mt-auto pt-6 text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                            View Full Schedule <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Footer Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    <div className="bg-card-dark border border-border-dark rounded-lg p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">restaurant</span>
                            </div>
                            <div>
                                <p className="text-white font-bold">Nutrition Plan</p>
                                <p className="text-text-secondary text-xs">
                                    {calories ? (calories.target - calories.consumed) : 0} kcal remaining
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard/calories')}
                            className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                            Log Meal
                        </button>
                    </div>
                    <div className="bg-card-dark border border-border-dark rounded-lg p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">water_drop</span>
                            </div>
                            <div>
                                <p className="text-white font-bold">Hydration</p>
                                <p className="text-text-secondary text-xs">
                                    {hydration ? (hydration.current / 1000).toFixed(1) : 0}L / {hydration ? (hydration.goal / 1000).toFixed(1) : 3.0}L Goal
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAddWater(250)}
                                className="text-primary text-xs font-medium hover:text-primary/80 transition-colors px-2 py-1 border border-primary/30 rounded">
                                +250ml
                            </button>
                            <button
                                onClick={() => handleAddWater(500)}
                                className="text-primary text-xs font-medium hover:text-primary/80 transition-colors px-2 py-1 border border-primary/30 rounded">
                                +500ml
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
