import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Helper to check if link is active
    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen w-full font-display overflow-hidden">
            {/* Side Navigation */}
            <aside className="flex w-[260px] flex-col justify-between bg-sidebar-dark border-r border-border-dark/50 shrink-0 h-full overflow-y-auto custom-scrollbar">
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
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${isActive('/dashboard') && location.pathname === '/dashboard'
                                    ? 'bg-primary text-sidebar-dark'
                                    : 'text-text-secondary hover:text-primary hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">dashboard</span>
                            <span className="text-sm font-medium tracking-wide">Overview</span>
                        </Link>
                        <Link
                            to="/dashboard/workout"
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${isActive('/dashboard/workout')
                                    ? 'bg-primary text-sidebar-dark'
                                    : 'text-text-secondary hover:text-primary hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">exercise</span>
                            <span className="text-sm font-medium tracking-wide">Workout</span>
                        </Link>
                        <Link
                            to="/dashboard/progress"
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${isActive('/dashboard/progress')
                                    ? 'bg-primary text-sidebar-dark'
                                    : 'text-text-secondary hover:text-primary hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">trending_up</span>
                            <span className="text-sm font-medium tracking-wide">Progress</span>
                        </Link>
                        <Link
                            to="/dashboard/splits"
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${isActive('/dashboard/splits')
                                    ? 'bg-primary text-sidebar-dark'
                                    : 'text-text-secondary hover:text-primary hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">horizontal_split</span>
                            <span className="text-sm font-medium tracking-wide">Splits</span>
                        </Link>
                        <Link
                            to="/dashboard/nutrition"
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${isActive('/dashboard/nutrition')
                                    ? 'bg-primary text-sidebar-dark'
                                    : 'text-text-secondary hover:text-primary hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">nutrition</span>
                            <span className="text-sm font-medium tracking-wide">Nutrition</span>
                        </Link>
                        <Link
                            to="/dashboard/analytics"
                            className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group ${isActive('/dashboard/analytics')
                                    ? 'bg-primary text-sidebar-dark'
                                    : 'text-text-secondary hover:text-primary hover:bg-white/5'
                                }`}
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

            {/* Main Content Area - Child routes render here */}
            <main className="flex-1 overflow-y-auto bg-background-dark custom-scrollbar">
                <Outlet />
            </main>
        </div>
    );
}
