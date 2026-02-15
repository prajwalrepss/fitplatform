export default function WorkoutHeader({ isActive }) {
    return (
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Workout Session</h1>
                <p className="text-sm text-slate-400 mt-1">Track your training and muscle activation</p>
            </div>
            <div className="flex items-center gap-2">
                {isActive ? (
                    <>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-green-500 font-semibold">Active</span>
                    </>
                ) : (
                    <>
                        <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                        <span className="text-slate-500 font-semibold">Not Active</span>
                    </>
                )}
            </div>
        </div>
    );
}
