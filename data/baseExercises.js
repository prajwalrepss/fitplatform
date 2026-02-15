module.exports = [
  // =====================
  // CHEST (12)
  // =====================
  {
    id: "bench_press",
    name: "Bench Press",
    primary: ["chest_mid"],
    secondary: ["delts_front", "triceps_long"]
  },
  {
    id: "chest_fly",
    name: "Chest Fly",
    primary: ["chest_mid"],
    secondary: ["delts_front"]
  },
  {
    id: "push_up",
    name: "Push-Up",
    primary: ["chest_mid"],
    secondary: ["delts_front", "triceps_long", "core"]
  },
  {
    id: "chest_press",
    name: "Chest Press",
    primary: ["chest_mid"],
    secondary: ["delts_front", "triceps_long"]
  },
  {
    id: "pec_deck",
    name: "Pec Deck",
    primary: ["chest_mid"],
    secondary: []
  },
  {
    id: "dips",
    name: "Dips",
    primary: ["chest_lower"],
    secondary: ["triceps_long", "delts_front"]
  },
  {
    id: "pullover",
    name: "Pullover",
    primary: ["chest_upper"],
    secondary: ["lats"]
  },
  {
    id: "cable_crossover",
    name: "Cable Crossover",
    primary: ["chest_mid"],
    secondary: ["delts_front"]
  },
  {
    id: "landmine_press",
    name: "Landmine Press",
    primary: ["chest_upper"],
    secondary: ["delts_front", "triceps_long"]
  },
  {
    id: "squeeze_press",
    name: "Squeeze Press",
    primary: ["chest_mid"],
    secondary: ["triceps_long"]
  },
  {
    id: "floor_press",
    name: "Floor Press",
    primary: ["chest_mid"],
    secondary: ["triceps_long"]
  },
  {
    id: "guillotine_press",
    name: "Guillotine Press",
    primary: ["chest_upper"],
    secondary: ["delts_front"]
  },

  // =====================
  // BACK (14)
  // =====================
  {
    id: "pull_up",
    name: "Pull-Up",
    primary: ["lats"],
    secondary: ["biceps_long", "rhomboids"]
  },
  {
    id: "lat_pulldown",
    name: "Lat Pulldown",
    primary: ["lats"],
    secondary: ["biceps_long"]
  },
  {
    id: "barbell_row",
    name: "Barbell Row",
    primary: ["lats", "rhomboids"],
    secondary: ["biceps_long", "erector_spinae"]
  },
  {
    id: "dumbbell_row",
    name: "Dumbbell Row",
    primary: ["lats"],
    secondary: ["biceps_long"]
  },
  {
    id: "seated_cable_row",
    name: "Seated Cable Row",
    primary: ["rhomboids"],
    secondary: ["biceps_long"]
  },
  {
    id: "deadlift",
    name: "Deadlift",
    primary: ["erector_spinae", "glute_max"],
    secondary: ["hamstrings", "lats"]
  },
  {
    id: "rack_pull",
    name: "Rack Pull",
    primary: ["erector_spinae"],
    secondary: ["glute_max"]
  },
  {
    id: "t_bar_row",
    name: "T-Bar Row",
    primary: ["lats"],
    secondary: ["rhomboids"]
  },
  {
    id: "meadows_row",
    name: "Meadows Row",
    primary: ["lats"],
    secondary: ["biceps_long"]
  },
  {
    id: "inverted_row",
    name: "Inverted Row",
    primary: ["rhomboids"],
    secondary: ["biceps_long"]
  },
  {
    id: "straight_arm_pulldown",
    name: "Straight Arm Pulldown",
    primary: ["lats"],
    secondary: []
  },
  {
    id: "good_morning",
    name: "Good Morning",
    primary: ["erector_spinae"],
    secondary: ["hamstrings"]
  },
  {
    id: "back_extension",
    name: "Back Extension",
    primary: ["erector_spinae"],
    secondary: ["glute_max"]
  },
  {
    id: "shrug",
    name: "Shrug",
    primary: ["traps_upper"],
    secondary: []
  },

  // =====================
  // SHOULDERS (10)
  // =====================
  {
    id: "overhead_press",
    name: "Overhead Press",
    primary: ["delts_front"],
    secondary: ["triceps_long"]
  },
  {
    id: "arnold_press",
    name: "Arnold Press",
    primary: ["delts_front", "delts_side"],
    secondary: ["triceps_long"]
  },
  {
    id: "lateral_raise",
    name: "Lateral Raise",
    primary: ["delts_side"],
    secondary: []
  },
  {
    id: "front_raise",
    name: "Front Raise",
    primary: ["delts_front"],
    secondary: []
  },
  {
    id: "rear_delt_fly",
    name: "Rear Delt Fly",
    primary: ["delts_rear"],
    secondary: ["rhomboids"]
  },
  {
    id: "upright_row",
    name: "Upright Row",
    primary: ["delts_side"],
    secondary: ["traps_upper"]
  },
  {
    id: "face_pull",
    name: "Face Pull",
    primary: ["delts_rear"],
    secondary: ["traps_middle"]
  },
  {
    id: "cuban_press",
    name: "Cuban Press",
    primary: ["rotator_cuff"],
    secondary: ["delts_front"]
  },
  {
    id: "landmine_shoulder_press",
    name: "Landmine Shoulder Press",
    primary: ["delts_front"],
    secondary: ["triceps_long"]
  },
  {
    id: "y_raise",
    name: "Y Raise",
    primary: ["delts_rear"],
    secondary: ["traps_lower"]
  },

  // =====================
  // ARMS – BICEPS (8)
  // =====================
  {
    id: "barbell_curl",
    name: "Barbell Curl",
    primary: ["biceps_long"],
    secondary: []
  },
  {
    id: "dumbbell_curl",
    name: "Dumbbell Curl",
    primary: ["biceps_long"],
    secondary: []
  },
  {
    id: "hammer_curl",
    name: "Hammer Curl",
    primary: ["brachialis"],
    secondary: ["brachioradialis"]
  },
  {
    id: "preacher_curl",
    name: "Preacher Curl",
    primary: ["biceps_short"],
    secondary: []
  },
  {
    id: "concentration_curl",
    name: "Concentration Curl",
    primary: ["biceps_short"],
    secondary: []
  },
  {
    id: "spider_curl",
    name: "Spider Curl",
    primary: ["biceps_long"],
    secondary: []
  },
  {
    id: "cable_curl",
    name: "Cable Curl",
    primary: ["biceps_long"],
    secondary: []
  },
  {
    id: "reverse_curl",
    name: "Reverse Curl",
    primary: ["brachioradialis"],
    secondary: ["biceps_long"]
  },

  // =====================
  // ARMS – TRICEPS (8)
  // =====================
  {
    id: "skullcrusher",
    name: "Skullcrusher",
    primary: ["triceps_long"],
    secondary: []
  },
  {
    id: "triceps_pushdown",
    name: "Triceps Pushdown",
    primary: ["triceps_lateral"],
    secondary: []
  },
  {
    id: "overhead_extension",
    name: "Overhead Extension",
    primary: ["triceps_long"],
    secondary: []
  },
  {
    id: "close_grip_bench_press",
    name: "Close Grip Bench Press",
    primary: ["triceps_long"],
    secondary: ["chest_mid"]
  },
  {
    id: "triceps_dips",
    name: "Triceps Dips",
    primary: ["triceps_long"],
    secondary: ["chest_lower"]
  },
  {
    id: "kickback",
    name: "Kickback",
    primary: ["triceps_lateral"],
    secondary: []
  },
  {
    id: "jm_press",
    name: "JM Press",
    primary: ["triceps_long"],
    secondary: []
  },
  {
    id: "tate_press",
    name: "Tate Press",
    primary: ["triceps_long"],
    secondary: []
  },

  // =====================
  // LEGS (14)
  // =====================
  {
    id: "squat",
    name: "Squat",
    primary: ["quad_rectus"],
    secondary: ["glute_max"]
  },
  {
    id: "front_squat",
    name: "Front Squat",
    primary: ["quad_rectus"],
    secondary: ["core"]
  },
  {
    id: "hack_squat",
    name: "Hack Squat",
    primary: ["quad_vastus_lateral"],
    secondary: []
  },
  {
    id: "leg_press",
    name: "Leg Press",
    primary: ["quad_rectus"],
    secondary: ["glute_max"]
  },
  {
    id: "lunge",
    name: "Lunge",
    primary: ["glute_max"],
    secondary: ["quad_rectus"]
  },
  {
    id: "bulgarian_split_squat",
    name: "Bulgarian Split Squat",
    primary: ["glute_max"],
    secondary: ["quad_rectus"]
  },
  {
    id: "step_up",
    name: "Step Up",
    primary: ["glute_max"],
    secondary: ["quad_rectus"]
  },
  {
    id: "romanian_deadlift",
    name: "Romanian Deadlift",
    primary: ["hamstrings"],
    secondary: ["glute_max"]
  },
  {
    id: "hip_thrust",
    name: "Hip Thrust",
    primary: ["glute_max"],
    secondary: []
  },
  {
    id: "glute_bridge",
    name: "Glute Bridge",
    primary: ["glute_max"],
    secondary: []
  },
  {
    id: "leg_extension",
    name: "Leg Extension",
    primary: ["quad_rectus"],
    secondary: []
  },
  {
    id: "leg_curl",
    name: "Leg Curl",
    primary: ["hamstrings"],
    secondary: []
  },
  {
    id: "good_morning_leg",
    name: "Good Morning (Leg)",
    primary: ["hamstrings"],
    secondary: ["erector_spinae"]
  },
  {
    id: "trap_bar_deadlift",
    name: "Trap Bar Deadlift",
    primary: ["glute_max"],
    secondary: ["quad_rectus"]
  },

  // =====================
  // CALVES (4)
  // =====================
  {
    id: "standing_calf_raise",
    name: "Standing Calf Raise",
    primary: ["calf_gastro"],
    secondary: []
  },
  {
    id: "seated_calf_raise",
    name: "Seated Calf Raise",
    primary: ["calf_soleus"],
    secondary: []
  },
  {
    id: "donkey_calf_raise",
    name: "Donkey Calf Raise",
    primary: ["calf_gastro"],
    secondary: []
  },
  {
    id: "single_leg_calf_raise",
    name: "Single Leg Calf Raise",
    primary: ["calf_gastro"],
    secondary: []
  },

  // =====================
  // CORE (8)
  // =====================
  {
    id: "plank",
    name: "Plank",
    primary: ["transverse_abs"],
    secondary: ["core"]
  },
  {
    id: "crunch",
    name: "Crunch",
    primary: ["abs"],
    secondary: []
  },
  {
    id: "hanging_leg_raise",
    name: "Hanging Leg Raise",
    primary: ["abs"],
    secondary: ["iliopsoas"]
  },
  {
    id: "cable_crunch",
    name: "Cable Crunch",
    primary: ["abs"],
    secondary: []
  },
  {
    id: "russian_twist",
    name: "Russian Twist",
    primary: ["obliques_external"],
    secondary: []
  },
  {
    id: "ab_wheel_rollout",
    name: "Ab Wheel Rollout",
    primary: ["transverse_abs"],
    secondary: ["delts_front"]
  },
  {
    id: "side_plank",
    name: "Side Plank",
    primary: ["obliques_internal"],
    secondary: []
  },
  {
    id: "dead_bug",
    name: "Dead Bug",
    primary: ["core"],
    secondary: []
  }
];