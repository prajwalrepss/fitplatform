export default function DaySelector({ selectedDay, onSelectDay }) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((day, index) => (
                <button
                    key={day}
                    onClick={() => onSelectDay(index)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${selectedDay === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    {day}
                </button>
            ))}
        </div>
    );
}
