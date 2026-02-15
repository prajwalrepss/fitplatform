const splits = [
    {
        id: "push_pull_legs",
        name: "Push Pull Legs (6 Day)",
        description: "Classic bodybuilding split targeting push, pull and leg muscles separately for maximum recovery.",
        days: [
            {
                day: 1,
                name: "Push",
                focusMuscles: ["chest", "shoulders", "triceps"]
            },
            {
                day: 2,
                name: "Pull",
                focusMuscles: ["back", "biceps", "forearms"]
            },
            {
                day: 3,
                name: "Legs",
                focusMuscles: ["quads", "hamstrings", "glutes", "calves"]
            },
            {
                day: 4,
                name: "Push",
                focusMuscles: ["chest", "shoulders", "triceps"]
            },
            {
                day: 5,
                name: "Pull",
                focusMuscles: ["back", "biceps", "forearms"]
            },
            {
                day: 6,
                name: "Legs",
                focusMuscles: ["quads", "hamstrings", "glutes", "calves"]
            }
        ]
    },
    {
        id: "upper_lower",
        name: "Upper Lower (4 Day)",
        description: "Efficient split alternating between upper and lower body workouts for balanced development and recovery.",
        days: [
            {
                day: 1,
                name: "Upper",
                focusMuscles: ["chest", "back", "shoulders", "biceps", "triceps"]
            },
            {
                day: 2,
                name: "Lower",
                focusMuscles: ["quads", "hamstrings", "glutes", "calves", "core"]
            },
            {
                day: 3,
                name: "Upper",
                focusMuscles: ["chest", "back", "shoulders", "biceps", "triceps"]
            },
            {
                day: 4,
                name: "Lower",
                focusMuscles: ["quads", "hamstrings", "glutes", "calves", "core"]
            }
        ]
    },
    {
        id: "bro_split",
        name: "Bro Split (5 Day)",
        description: "Traditional bodybuilding split dedicating one day per major muscle group for maximum volume and pump.",
        days: [
            {
                day: 1,
                name: "Chest Day",
                focusMuscles: ["chest", "triceps"]
            },
            {
                day: 2,
                name: "Back Day",
                focusMuscles: ["back", "biceps"]
            },
            {
                day: 3,
                name: "Shoulder Day",
                focusMuscles: ["shoulders", "triceps"]
            },
            {
                day: 4,
                name: "Arm Day",
                focusMuscles: ["biceps", "triceps", "forearms"]
            },
            {
                day: 5,
                name: "Leg Day",
                focusMuscles: ["quads", "hamstrings", "glutes", "calves"]
            }
        ]
    },
    {
        id: "full_body_beginner",
        name: "Full Body Beginner (3 Day)",
        description: "Perfect for beginners hitting all major muscle groups three times per week for rapid strength gains.",
        days: [
            {
                day: 1,
                name: "Full Body A",
                focusMuscles: ["chest", "back", "shoulders", "quads", "hamstrings", "biceps", "triceps", "core"]
            },
            {
                day: 2,
                name: "Full Body B",
                focusMuscles: ["chest", "back", "shoulders", "quads", "hamstrings", "biceps", "triceps", "core"]
            },
            {
                day: 3,
                name: "Full Body C",
                focusMuscles: ["chest", "back", "shoulders", "quads", "hamstrings", "biceps", "triceps", "core"]
            }
        ]
    }
];

module.exports = splits;
