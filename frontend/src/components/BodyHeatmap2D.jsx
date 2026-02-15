const getColorFromLoad = (load) => {
    if (load === 0) return '#6b7280'; // grey
    if (load === 1) return '#facc15'; // yellow
    if (load === 2) return '#22c55e'; // green
    return '#ef4444'; // red (3+)
};

export default function BodyHeatmap2D({ muscleStatus = {} }) {
    const getLoad = (muscleName) => {
        return muscleStatus[muscleName]?.load || 0;
    };

    return (
        <div className="bg-black rounded-2xl p-6 flex justify-center items-center gap-12 h-[500px]">
            {/* Front View */}
            <div className="flex flex-col items-center">
                <svg width="160" height="400" viewBox="0 0 160 400" className="drop-shadow-lg">
                    {/* Head */}
                    <ellipse cx="80" cy="30" rx="25" ry="30" fill="#475569" />

                    {/* Shoulders */}
                    <rect
                        x="30"
                        y="55"
                        width="100"
                        height="30"
                        rx="8"
                        fill={getColorFromLoad(getLoad('shoulders'))}
                        className="transition-colors duration-300"
                    />

                    {/* Chest */}
                    <rect
                        x="45"
                        y="85"
                        width="70"
                        height="50"
                        rx="8"
                        fill={getColorFromLoad(getLoad('chest'))}
                        className="transition-colors duration-300"
                    />

                    {/* Core */}
                    <rect
                        x="50"
                        y="135"
                        width="60"
                        height="60"
                        rx="8"
                        fill={getColorFromLoad(getLoad('core'))}
                        className="transition-colors duration-300"
                    />

                    {/* Biceps Left */}
                    <rect
                        x="20"
                        y="85"
                        width="20"
                        height="60"
                        rx="6"
                        fill={getColorFromLoad(getLoad('biceps'))}
                        className="transition-colors duration-300"
                    />

                    {/* Biceps Right */}
                    <rect
                        x="120"
                        y="85"
                        width="20"
                        height="60"
                        rx="6"
                        fill={getColorFromLoad(getLoad('biceps'))}
                        className="transition-colors duration-300"
                    />

                    {/* Forearms Left */}
                    <rect
                        x="15"
                        y="145"
                        width="22"
                        height="60"
                        rx="6"
                        fill="#475569"
                    />

                    {/* Forearms Right */}
                    <rect
                        x="123"
                        y="145"
                        width="22"
                        height="60"
                        rx="6"
                        fill="#475569"
                    />

                    {/* Quads Left */}
                    <rect
                        x="45"
                        y="195"
                        width="30"
                        height="110"
                        rx="8"
                        fill={getColorFromLoad(getLoad('quads'))}
                        className="transition-colors duration-300"
                    />

                    {/* Quads Right */}
                    <rect
                        x="85"
                        y="195"
                        width="30"
                        height="110"
                        rx="8"
                        fill={getColorFromLoad(getLoad('quads'))}
                        className="transition-colors duration-300"
                    />

                    {/* Calves Left */}
                    <rect
                        x="48"
                        y="305"
                        width="24"
                        height="70"
                        rx="6"
                        fill="#475569"
                    />

                    {/* Calves Right */}
                    <rect
                        x="88"
                        y="305"
                        width="24"
                        height="70"
                        rx="6"
                        fill="#475569"
                    />
                </svg>
                <p className="text-slate-400 text-sm mt-3 font-medium">Front</p>
            </div>

            {/* Back View */}
            <div className="flex flex-col items-center">
                <svg width="160" height="400" viewBox="0 0 160 400" className="drop-shadow-lg">
                    {/* Head */}
                    <ellipse cx="80" cy="30" rx="25" ry="30" fill="#475569" />

                    {/* Upper Back/Shoulders */}
                    <rect
                        x="30"
                        y="55"
                        width="100"
                        height="30"
                        rx="8"
                        fill={getColorFromLoad(getLoad('shoulders'))}
                        className="transition-colors duration-300"
                    />

                    {/* Back */}
                    <rect
                        x="40"
                        y="85"
                        width="80"
                        height="70"
                        rx="8"
                        fill={getColorFromLoad(getLoad('back'))}
                        className="transition-colors duration-300"
                    />

                    {/* Lower Back */}
                    <rect
                        x="50"
                        y="155"
                        width="60"
                        height="40"
                        rx="8"
                        fill={getColorFromLoad(getLoad('back'))}
                        className="transition-colors duration-300"
                        opacity="0.7"
                    />

                    {/* Triceps Left */}
                    <rect
                        x="20"
                        y="85"
                        width="20"
                        height="60"
                        rx="6"
                        fill={getColorFromLoad(getLoad('triceps'))}
                        className="transition-colors duration-300"
                    />

                    {/* Triceps Right */}
                    <rect
                        x="120"
                        y="85"
                        width="20"
                        height="60"
                        rx="6"
                        fill={getColorFromLoad(getLoad('triceps'))}
                        className="transition-colors duration-300"
                    />

                    {/* Forearms Left */}
                    <rect
                        x="15"
                        y="145"
                        width="22"
                        height="60"
                        rx="6"
                        fill="#475569"
                    />

                    {/* Forearms Right */}
                    <rect
                        x="123"
                        y="145"
                        width="22"
                        height="60"
                        rx="6"
                        fill="#475569"
                    />

                    {/* Glutes */}
                    <rect
                        x="50"
                        y="195"
                        width="60"
                        height="45"
                        rx="8"
                        fill={getColorFromLoad(getLoad('glutes'))}
                        className="transition-colors duration-300"
                    />

                    {/* Hamstrings Left */}
                    <rect
                        x="45"
                        y="240"
                        width="30"
                        height="70"
                        rx="8"
                        fill={getColorFromLoad(getLoad('hamstrings'))}
                        className="transition-colors duration-300"
                    />

                    {/* Hamstrings Right */}
                    <rect
                        x="85"
                        y="240"
                        width="30"
                        height="70"
                        rx="8"
                        fill={getColorFromLoad(getLoad('hamstrings'))}
                        className="transition-colors duration-300"
                    />

                    {/* Calves Left */}
                    <rect
                        x="48"
                        y="310"
                        width="24"
                        height="65"
                        rx="6"
                        fill={getColorFromLoad(getLoad('calves'))}
                        className="transition-colors duration-300"
                    />

                    {/* Calves Right */}
                    <rect
                        x="88"
                        y="310"
                        width="24"
                        height="65"
                        rx="6"
                        fill={getColorFromLoad(getLoad('calves'))}
                        className="transition-colors duration-300"
                    />
                </svg>
                <p className="text-slate-400 text-sm mt-3 font-medium">Back</p>
            </div>
        </div>
    );
}
