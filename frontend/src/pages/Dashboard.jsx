import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BodyHeatmap } from '../components/muscle-heatmap';

export default function Dashboard() {
    const { user, logout } = useAuth();

    // Get current date info
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="flex h-screen w-full font-display overflow-hidden">
            {/* Side Navigation */}
            <aside className="flex w-[260px] flex-col justify-between bg-sidebar-dark border-r border-border-dark/50 shrink-0 h-full overflow-y-auto">
                <div className="p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
                        <h1 className="text-primary text-xl font-bold tracking-wide uppercase">FitPlatform</h1>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded bg-primary text-sidebar-dark transition-colors duration-200 group"
                        >
                            <span className="material-symbols-outlined text-[20px]">dashboard</span>
                            <span className="text-sm font-bold tracking-wide">Overview</span>
                        </Link>
                        <Link
                            to="/workout"
                            className="flex items-center gap-3 px-4 py-3 rounded text-text-secondary hover:text-primary hover:bg-white/5 transition-all duration-200 group"
                        >
                            <span className="material-symbols-outlined text-[20px]">exercise</span>
                            <span className="text-sm font-medium tracking-wide">Workout</span>
                        </Link>
                        <Link
                            to="/progress"
                            className="flex items-center gap-3 px-4 py-3 rounded text-text-secondary hover:text-primary hover:bg-white/5 transition-all duration-200 group"
                        >
                            <span className="material-symbols-outlined text-[20px]">trending_up</span>
                            <span className="text-sm font-medium tracking-wide">Progress</span>
                        </Link>
                        <Link
                            to="/splits"
                            className="flex items-center gap-3 px-4 py-3 rounded text-text-secondary hover:text-primary hover:bg-white/5 transition-all duration-200 group"
                        >
                            <span className="material-symbols-outlined text-[20px]">horizontal_split</span>
                            <span className="text-sm font-medium tracking-wide">Splits</span>
                        </Link>
                        <Link
                            to="/nutrition"
                            className="flex items-center gap-3 px-4 py-3 rounded text-text-secondary hover:text-primary hover:bg-white/5 transition-all duration-200 group"
                        >
                            <span className="material-symbols-outlined text-[20px]">nutrition</span>
                            <span className="text-sm font-medium tracking-wide">Nutrition</span>
                        </Link>
                        <Link
                            to="/analytics"
                            className="flex items-center gap-3 px-4 py-3 rounded text-text-secondary hover:text-primary hover:bg-white/5 transition-all duration-200 group"
                        >
                            <span className="material-symbols-outlined text-[20px]">analytics</span>
                            <span className="text-sm font-medium tracking-wide">Analytics</span>
                        </Link>
                    </nav>
                </div>

                {/* Footer Profile & Logout */}
                <div className="p-6 border-t border-border-dark/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                            <span className="material-symbols-outlined text-primary text-xl">person</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-white text-sm font-semibold">{user?.username || 'User'}</p>
                            <p className="text-text-secondary text-xs">Premium Member</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-primary/30 text-primary hover:bg-primary hover:text-sidebar-dark transition-all duration-300"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-background-dark p-10">
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
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-card-dark border border-border-dark rounded hover:border-primary/50 transition-colors group">
                                <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors text-sm">add</span>
                                <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">Log Workout</span>
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-sidebar-dark rounded font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(212,175,53,0.15)]">
                                <span className="material-symbols-outlined text-sm">play_arrow</span>
                                <span className="text-sm">Start Session</span>
                            </button>
                        </div>
                    </header>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Metric Card 1 */}
                        <div className="flex flex-col gap-4 p-6 rounded-lg bg-card-dark border border-border-dark relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-8xl text-primary">local_fire_department</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Today's Calories</p>
                                <span className="material-symbols-outlined text-primary">local_fire_department</span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold text-white">1,240</span>
                                <span className="text-sm text-text-secondary">/ 2,500 kcal</span>
                            </div>
                            <div className="w-full bg-border-dark h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: '49%' }}></div>
                            </div>
                        </div>

                        {/* Metric Card 2 */}
                        <div className="flex flex-col gap-4 p-6 rounded-lg bg-card-dark border border-border-dark relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-8xl text-primary">timer</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Active Minutes</p>
                                <span className="material-symbols-outlined text-primary">timer</span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold text-white">45</span>
                                <span className="text-sm text-text-secondary">mins</span>
                            </div>
                            <div className="w-full bg-border-dark h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>

                        {/* Metric Card 3 */}
                        <div className="flex flex-col gap-4 p-6 rounded-lg bg-card-dark border border-border-dark relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-8xl text-primary">bolt</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Workout Streak</p>
                                <span className="material-symbols-outlined text-primary">bolt</span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold text-white">12</span>
                                <span className="text-sm text-text-secondary">Days</span>
                            </div>
                            <p className="text-xs text-primary mt-3 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                Top 5% this week
                            </p>
                        </div>
                    </div>

                    {/* Main Content Row */}
                    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[400px]">
                        {/* Body Activation Heatmap */}
                        <div className="flex-1 bg-card-dark border border-border-dark rounded-lg p-8 flex flex-col gap-6 min-h-[500px]">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-white">Body Activation Overview</h3>
                                <p className="text-sm text-text-secondary">Muscle heatmap based on today's activity</p>
                            </div>

                            {/* BodyHeatmap Component */}
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

                        {/* Upcoming Session / Schedule */}
                        <div className="w-full lg:w-[320px] bg-card-dark border border-border-dark rounded-lg p-6 flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-6">Upcoming Sessions</h3>
                            <div className="flex flex-col gap-4">
                                {/* Card 1 (Next) */}
                                <div className="p-4 rounded border-l-2 border-primary bg-background-dark/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Today, 14:00</span>
                                        <span className="material-symbols-outlined text-text-secondary text-sm cursor-pointer hover:text-white">more_horiz</span>
                                    </div>
                                    <h4 className="text-white font-semibold">HIIT Cardio</h4>
                                    <p className="text-text-secondary text-xs mt-1">45 mins • High Intensity</p>
                                    <div className="flex -space-x-2 mt-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-card-dark flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-xs">person</span>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-card-dark flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-xs">person</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="p-4 rounded border border-border-dark hover:border-border-dark/80 transition-colors bg-transparent opacity-60 hover:opacity-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold text-text-secondary">Tomorrow, 09:00</span>
                                    </div>
                                    <h4 className="text-white font-medium">Upper Body Strength</h4>
                                    <p className="text-text-secondary text-xs mt-1">60 mins • Strength</p>
                                </div>

                                {/* Card 3 */}
                                <div className="p-4 rounded border border-border-dark hover:border-border-dark/80 transition-colors bg-transparent opacity-60 hover:opacity-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold text-text-secondary">Wed, 18:00</span>
                                    </div>
                                    <h4 className="text-white font-medium">Yoga Flow</h4>
                                    <p className="text-text-secondary text-xs mt-1">30 mins • Recovery</p>
                                </div>
                            </div>
                            <button className="mt-auto pt-6 text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
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
                                    <p className="text-text-secondary text-xs">1,260 kcal remaining</p>
                                </div>
                            </div>
                            <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">Log Meal</button>
                        </div>
                        <div className="bg-card-dark border border-border-dark rounded-lg p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">water_drop</span>
                                </div>
                                <div>
                                    <p className="text-white font-bold">Hydration</p>
                                    <p className="text-text-secondary text-xs">1.5L / 3.0L Goal</p>
                                </div>
                            </div>
                            <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">Add Water</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}