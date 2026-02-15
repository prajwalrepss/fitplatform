export default function StatCard({ title, value, subtitle, trend, trendType }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm hover:bg-slate-800 transition">
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-3xl font-semibold text-white mt-2">{value}</p>
            {subtitle && (
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
            {trend && trendType && (
                <div className="mt-2">
                    <span className={`text-xs font-medium ${trendType === 'positive' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {trendType === 'positive' ? '↑' : '↓'} {trend}
                    </span>
                </div>
            )}
        </div>
    );
}
