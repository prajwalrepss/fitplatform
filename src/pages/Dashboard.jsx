import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Home' },
        { path: '/dashboard/workout', label: 'Workout' },
        { path: '/dashboard/splits', label: 'Splits' },
        { path: '/dashboard/calories', label: 'Calories' },
        { path: '/dashboard/analytics', label: 'Analytics' },
        { path: '/dashboard/buddy', label: 'Buddy' },
    ];

    return (
        <div className="flex h-screen bg-slate-950">
            {/* Fixed Sidebar */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-semibold text-white">FitPlatform</h1>
                    <p className="text-sm text-slate-500 mt-1">@{user?.username || 'user'}</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-4 py-2.5 rounded-xl transition text-sm font-medium ${isActive
                                        ? 'bg-slate-800 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
