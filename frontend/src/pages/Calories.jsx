import { useState, useEffect } from 'react';
import { caloriesAPI } from '../api';

export default function Calories() {
    const [formData, setFormData] = useState({
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
    });
    const [todayTotal, setTodayTotal] = useState(null);
    const [last7Days, setLast7Days] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [todayRes, last7Res] = await Promise.all([
                caloriesAPI.today(),
                caloriesAPI.last7Days(),
            ]);
            setTodayTotal(todayRes.data);
            // Ensure last7Days is always an array
            setLast7Days(Array.isArray(last7Res.data) ? last7Res.data : []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load data:', err);
            // Ensure last7Days is an array even on error
            setLast7Days([]);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await caloriesAPI.add(formData);
            setFormData({ calories: '', protein: '', carbs: '', fats: '' });
            loadData();
        } catch (err) {
            alert('Failed to add calories');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    // Safe calculation - ensure last7Days is an array
    const maxCalories = Array.isArray(last7Days) && last7Days.length > 0
        ? Math.max(...last7Days.map((d) => d.totalCalories), 2000)
        : 2000;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-white">Calorie Tracking</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="bg-card-dark border border-border-dark rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Add Entry</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Calories
                            </label>
                            <input
                                type="number"
                                className="w-full bg-card-dark border border-border-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                                value={formData.calories}
                                onChange={(e) =>
                                    setFormData({ ...formData, calories: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Protein (g)
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-card-dark border border-border-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                                    value={formData.protein}
                                    onChange={(e) =>
                                        setFormData({ ...formData, protein: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Carbs (g)
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-card-dark border border-border-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                                    value={formData.carbs}
                                    onChange={(e) =>
                                        setFormData({ ...formData, carbs: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Fats (g)
                                </label>
                                <input
                                    type="number"
                                    className="w-full bg-card-dark border border-border-dark text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
                                    value={formData.fats}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fats: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <button type="submit" className="bg-primary text-sidebar-dark px-4 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors w-full">
                            Add Entry
                        </button>
                    </form>
                </div>

                {/* Today's Totals */}
                <div className="bg-card-dark border border-border-dark rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Today's Totals</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background-dark rounded-lg p-4">
                            <p className="text-gray-400 text-sm">Calories</p>
                            <p className="text-3xl font-bold text-white">
                                {todayTotal?.totalCalories || 0}
                            </p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <p className="text-text-secondary text-sm">Protein</p>
                            <p className="text-3xl font-bold text-white">
                                {todayTotal?.totalProtein || 0}g
                            </p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <p className="text-gray-400 text-sm">Carbs</p>
                            <p className="text-3xl font-bold text-white">
                                {todayTotal?.totalCarbs || 0}g
                            </p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <p className="text-gray-400 text-sm">Fats</p>
                            <p className="text-3xl font-bold text-white">
                                {todayTotal?.totalFats || 0}g
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7 Day Chart */}
            <div className="bg-card-dark border border-border-dark rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Last 7 Days</h2>
                <div className="flex items-end justify-between h-64 gap-2">
                    {last7Days.map((day, index) => {
                        const height = (day.totalCalories / maxCalories) * 100;
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex items-end justify-center h-full">
                                    <div
                                        className="bg-primary w-full rounded-t-lg transition-all hover:bg-primary/90"
                                        style={{ height: `${height}%` }}
                                        title={`${day.totalCalories} cal`}
                                    />
                                </div>
                                <p className="text-white font-bold mt-2">{day.totalCalories}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
