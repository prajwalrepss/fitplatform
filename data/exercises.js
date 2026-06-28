module.exports = [

  /* ================= CHEST (10) ================= */
  { id: "barbell-bench-press", name: "Barbell Bench Press", primaryMuscle: "chest", secondaryMuscles: ["triceps", "shoulders"], difficulty: "intermediate" },
  { id: "incline-barbell-press", name: "Incline Barbell Press", primaryMuscle: "chest", secondaryMuscles: ["shoulders", "triceps"], difficulty: "intermediate" },
  { id: "decline-bench-press", name: "Decline Bench Press", primaryMuscle: "chest", secondaryMuscles: ["triceps"], difficulty: "intermediate" },
  { id: "dumbbell-bench-press", name: "Dumbbell Bench Press", primaryMuscle: "chest", secondaryMuscles: ["triceps", "shoulders"], difficulty: "beginner" },
  { id: "incline-dumbbell-press", name: "Incline Dumbbell Press", primaryMuscle: "chest", secondaryMuscles: ["shoulders"], difficulty: "beginner" },
  { id: "cable-fly", name: "Cable Fly", primaryMuscle: "chest", secondaryMuscles: [], difficulty: "beginner" },
  { id: "pec-deck", name: "Pec Deck", primaryMuscle: "chest", secondaryMuscles: [], difficulty: "beginner" },
  { id: "push-up", name: "Push-Up", primaryMuscle: "chest", secondaryMuscles: ["triceps", "core"], difficulty: "beginner" },
  { id: "machine-chest-press", name: "Machine Chest Press", primaryMuscle: "chest", secondaryMuscles: ["triceps"], difficulty: "beginner" },
  { id: "dumbbell-pullover", name: "Dumbbell Pullover", primaryMuscle: "chest", secondaryMuscles: ["back"], difficulty: "intermediate" },

  /* ================= BACK (12) ================= */
  { id: "deadlift", name: "Deadlift", primaryMuscle: "back", secondaryMuscles: ["glutes", "hamstrings", "core"], difficulty: "advanced" },
  { id: "barbell-row", name: "Barbell Row", primaryMuscle: "back", secondaryMuscles: ["biceps"], difficulty: "intermediate" },
  { id: "lat-pulldown", name: "Lat Pulldown", primaryMuscle: "back", secondaryMuscles: ["biceps"], difficulty: "beginner" },
  { id: "pull-up", name: "Pull-Up", primaryMuscle: "back", secondaryMuscles: ["biceps"], difficulty: "intermediate" },
  { id: "seated-cable-row", name: "Seated Cable Row", primaryMuscle: "back", secondaryMuscles: ["biceps"], difficulty: "beginner" },
  { id: "t-bar-row", name: "T-Bar Row", primaryMuscle: "back", secondaryMuscles: ["biceps"], difficulty: "intermediate" },
  { id: "single-arm-dumbbell-row", name: "Single Arm Dumbbell Row", primaryMuscle: "back", secondaryMuscles: ["biceps"], difficulty: "beginner" },
  { id: "face-pull", name: "Face Pull", primaryMuscle: "back", secondaryMuscles: ["shoulders"], difficulty: "beginner" },
  { id: "straight-arm-pulldown", name: "Straight Arm Pulldown", primaryMuscle: "back", secondaryMuscles: [], difficulty: "beginner" },
  { id: "rack-pull", name: "Rack Pull", primaryMuscle: "back", secondaryMuscles: ["glutes", "hamstrings"], difficulty: "advanced" },
  { id: "inverted-row", name: "Inverted Row", primaryMuscle: "back", secondaryMuscles: ["biceps"], difficulty: "beginner" },
  { id: "machine-row", name: "Machine Row", primaryMuscle: "back", secondaryMuscles: ["biceps"], difficulty: "beginner" },

  /* ================= SHOULDERS (10) ================= */
  { id: "overhead-press", name: "Overhead Press", primaryMuscle: "shoulders", secondaryMuscles: ["triceps"], difficulty: "intermediate" },
  { id: "dumbbell-shoulder-press", name: "Dumbbell Shoulder Press", primaryMuscle: "shoulders", secondaryMuscles: ["triceps"], difficulty: "beginner" },
  { id: "lateral-raise", name: "Lateral Raise", primaryMuscle: "shoulders", secondaryMuscles: [], difficulty: "beginner" },
  { id: "front-raise", name: "Front Raise", primaryMuscle: "shoulders", secondaryMuscles: [], difficulty: "beginner" },
  { id: "rear-delt-fly", name: "Rear Delt Fly", primaryMuscle: "shoulders", secondaryMuscles: ["back"], difficulty: "beginner" },
  { id: "arnold-press", name: "Arnold Press", primaryMuscle: "shoulders", secondaryMuscles: ["triceps"], difficulty: "intermediate" },
  { id: "upright-row", name: "Upright Row", primaryMuscle: "shoulders", secondaryMuscles: ["forearms"], difficulty: "intermediate" },
  { id: "machine-shoulder-press", name: "Machine Shoulder Press", primaryMuscle: "shoulders", secondaryMuscles: ["triceps"], difficulty: "beginner" },
  { id: "cable-lateral-raise", name: "Cable Lateral Raise", primaryMuscle: "shoulders", secondaryMuscles: [], difficulty: "beginner" },
  { id: "shrugs", name: "Shrugs", primaryMuscle: "shoulders", secondaryMuscles: ["forearms"], difficulty: "beginner" },

  /* ================= BICEPS (8) ================= */
  { id: "barbell-curl", name: "Barbell Curl", primaryMuscle: "biceps", secondaryMuscles: [], difficulty: "beginner" },
  { id: "dumbbell-curl", name: "Dumbbell Curl", primaryMuscle: "biceps", secondaryMuscles: [], difficulty: "beginner" },
  { id: "hammer-curl", name: "Hammer Curl", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], difficulty: "beginner" },
  { id: "preacher-curl", name: "Preacher Curl", primaryMuscle: "biceps", secondaryMuscles: [], difficulty: "intermediate" },
  { id: "concentration-curl", name: "Concentration Curl", primaryMuscle: "biceps", secondaryMuscles: [], difficulty: "beginner" },
  { id: "cable-curl", name: "Cable Curl", primaryMuscle: "biceps", secondaryMuscles: [], difficulty: "beginner" },
  { id: "incline-dumbbell-curl", name: "Incline Dumbbell Curl", primaryMuscle: "biceps", secondaryMuscles: [], difficulty: "intermediate" },
  { id: "ez-bar-curl", name: "EZ Bar Curl", primaryMuscle: "biceps", secondaryMuscles: [], difficulty: "beginner" },

  /* ================= TRICEPS (8) ================= */
  { id: "tricep-pushdown", name: "Tricep Pushdown", primaryMuscle: "triceps", secondaryMuscles: [], difficulty: "beginner" },
  { id: "skull-crusher", name: "Skull Crusher", primaryMuscle: "triceps", secondaryMuscles: [], difficulty: "intermediate" },
  { id: "overhead-tricep-extension", name: "Overhead Tricep Extension", primaryMuscle: "triceps", secondaryMuscles: [], difficulty: "beginner" },
  { id: "close-grip-bench", name: "Close Grip Bench Press", primaryMuscle: "triceps", secondaryMuscles: ["chest"], difficulty: "intermediate" },
  { id: "bench-dips", name: "Bench Dips", primaryMuscle: "triceps", secondaryMuscles: ["chest"], difficulty: "beginner" },
  { id: "cable-overhead-extension", name: "Cable Overhead Extension", primaryMuscle: "triceps", secondaryMuscles: [], difficulty: "beginner" },
  { id: "diamond-pushup", name: "Diamond Push-Up", primaryMuscle: "triceps", secondaryMuscles: ["chest"], difficulty: "beginner" },
  { id: "machine-tricep-extension", name: "Machine Tricep Extension", primaryMuscle: "triceps", secondaryMuscles: [], difficulty: "beginner" },

  /* ================= FOREARMS (4) ================= */
  { id: "wrist-curl", name: "Wrist Curl", primaryMuscle: "forearms", secondaryMuscles: [], difficulty: "beginner" },
  { id: "reverse-wrist-curl", name: "Reverse Wrist Curl", primaryMuscle: "forearms", secondaryMuscles: [], difficulty: "beginner" },
  { id: "farmer-carry", name: "Farmer Carry", primaryMuscle: "forearms", secondaryMuscles: ["core"], difficulty: "intermediate" },
  { id: "plate-pinches", name: "Plate Pinches", primaryMuscle: "forearms", secondaryMuscles: [], difficulty: "beginner" },

  /* ================= QUADS (10) ================= */
  { id: "barbell-squat", name: "Barbell Squat", primaryMuscle: "quads", secondaryMuscles: ["glutes", "core"], difficulty: "advanced" },
  { id: "leg-press", name: "Leg Press", primaryMuscle: "quads", secondaryMuscles: ["glutes"], difficulty: "beginner" },
  { id: "lunges", name: "Lunges", primaryMuscle: "quads", secondaryMuscles: ["glutes"], difficulty: "beginner" },
  { id: "walking-lunges", name: "Walking Lunges", primaryMuscle: "quads", secondaryMuscles: ["glutes"], difficulty: "intermediate" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", primaryMuscle: "quads", secondaryMuscles: ["glutes"], difficulty: "intermediate" },
  { id: "leg-extension", name: "Leg Extension", primaryMuscle: "quads", secondaryMuscles: [], difficulty: "beginner" },
  { id: "front-squat", name: "Front Squat", primaryMuscle: "quads", secondaryMuscles: ["core"], difficulty: "advanced" },
  { id: "hack-squat", name: "Hack Squat", primaryMuscle: "quads", secondaryMuscles: ["glutes"], difficulty: "intermediate" },
  { id: "step-ups", name: "Step Ups", primaryMuscle: "quads", secondaryMuscles: ["glutes"], difficulty: "beginner" },
  { id: "wall-sit", name: "Wall Sit", primaryMuscle: "quads", secondaryMuscles: [], difficulty: "beginner" },

  /* ================= HAMSTRINGS (7) ================= */
  { id: "romanian-deadlift", name: "Romanian Deadlift", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes"], difficulty: "intermediate" },
  { id: "leg-curl", name: "Leg Curl", primaryMuscle: "hamstrings", secondaryMuscles: [], difficulty: "beginner" },
  { id: "seated-leg-curl", name: "Seated Leg Curl", primaryMuscle: "hamstrings", secondaryMuscles: [], difficulty: "beginner" },
  { id: "good-morning", name: "Good Morning", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes"], difficulty: "advanced" },
  { id: "glute-ham-raise", name: "Glute Ham Raise", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes"], difficulty: "advanced" },
  { id: "single-leg-deadlift", name: "Single Leg Deadlift", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes"], difficulty: "intermediate" },
  { id: "kettlebell-swing", name: "Kettlebell Swing", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes", "core"], difficulty: "intermediate" },

  /* ================= GLUTES (7) ================= */
  { id: "hip-thrust", name: "Hip Thrust", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings"], difficulty: "intermediate" },
  { id: "glute-bridge", name: "Glute Bridge", primaryMuscle: "glutes", secondaryMuscles: [], difficulty: "beginner" },
  { id: "cable-kickback", name: "Cable Kickback", primaryMuscle: "glutes", secondaryMuscles: [], difficulty: "beginner" },
  { id: "sumo-deadlift", name: "Sumo Deadlift", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings"], difficulty: "advanced" },
  { id: "reverse-lunge", name: "Reverse Lunge", primaryMuscle: "glutes", secondaryMuscles: ["quads"], difficulty: "beginner" },
  { id: "step-back-lunge", name: "Step Back Lunge", primaryMuscle: "glutes", secondaryMuscles: ["quads"], difficulty: "beginner" },
  { id: "barbell-hip-abduction", name: "Barbell Hip Abduction", primaryMuscle: "glutes", secondaryMuscles: [], difficulty: "intermediate" },

  /* ================= CALVES (5) ================= */
  { id: "standing-calf-raise", name: "Standing Calf Raise", primaryMuscle: "calves", secondaryMuscles: [], difficulty: "beginner" },
  { id: "seated-calf-raise", name: "Seated Calf Raise", primaryMuscle: "calves", secondaryMuscles: [], difficulty: "beginner" },
  { id: "donkey-calf-raise", name: "Donkey Calf Raise", primaryMuscle: "calves", secondaryMuscles: [], difficulty: "intermediate" },
  { id: "single-leg-calf-raise", name: "Single Leg Calf Raise", primaryMuscle: "calves", secondaryMuscles: [], difficulty: "beginner" },
  { id: "calf-press", name: "Calf Press", primaryMuscle: "calves", secondaryMuscles: [], difficulty: "beginner" },

  /* ================= CORE (5) ================= */
  { id: "plank", name: "Plank", primaryMuscle: "core", secondaryMuscles: [], difficulty: "beginner" },
  { id: "crunch", name: "Crunch", primaryMuscle: "core", secondaryMuscles: [], difficulty: "beginner" },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", primaryMuscle: "core", secondaryMuscles: [], difficulty: "intermediate" },
  { id: "russian-twist", name: "Russian Twist", primaryMuscle: "core", secondaryMuscles: [], difficulty: "beginner" },
  { id: "ab-wheel-rollout", name: "Ab Wheel Rollout", primaryMuscle: "core", secondaryMuscles: [], difficulty: "advanced" }

];
