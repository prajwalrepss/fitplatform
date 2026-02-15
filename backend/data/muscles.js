module.exports = [
  // =====================
  // CHEST
  // =====================
  { id: "chest_upper", name: "Upper Chest", group: "Chest", region: "Upper", modelKey: "pec_upper" },
  { id: "chest_mid", name: "Mid Chest", group: "Chest", region: "Upper", modelKey: "pec_mid" },
  { id: "chest_lower", name: "Lower Chest", group: "Chest", region: "Upper", modelKey: "pec_lower" },
  { id: "serratus_anterior", name: "Serratus Anterior", group: "Chest", region: "Upper", modelKey: "serratus_anterior" },

  // =====================
  // BACK
  // =====================
  { id: "lats", name: "Latissimus Dorsi", group: "Back", region: "Upper", modelKey: "lats" },
  { id: "teres_major", name: "Teres Major", group: "Back", region: "Upper", modelKey: "teres_major" },
  { id: "rhomboids", name: "Rhomboids", group: "Back", region: "Upper", modelKey: "rhomboids" },
  { id: "traps_upper", name: "Upper Trapezius", group: "Back", region: "Upper", modelKey: "traps_upper" },
  { id: "traps_middle", name: "Middle Trapezius", group: "Back", region: "Upper", modelKey: "traps_middle" },
  { id: "traps_lower", name: "Lower Trapezius", group: "Back", region: "Upper", modelKey: "traps_lower" },
  { id: "erector_spinae", name: "Erector Spinae", group: "Back", region: "Lower", modelKey: "erectors" },

  // =====================
  // SHOULDERS
  // =====================
  { id: "delts_front", name: "Anterior Deltoid", group: "Shoulders", region: "Upper", modelKey: "delts_front" },
  { id: "delts_side", name: "Lateral Deltoid", group: "Shoulders", region: "Upper", modelKey: "delts_side" },
  { id: "delts_rear", name: "Posterior Deltoid", group: "Shoulders", region: "Upper", modelKey: "delts_rear" },
  { id: "rotator_cuff", name: "Rotator Cuff", group: "Shoulders", region: "Upper", modelKey: "rotator_cuff" },

  // =====================
  // ARMS — BICEPS
  // =====================
  { id: "biceps_long", name: "Biceps Long Head", group: "Arms", region: "Upper", modelKey: "biceps_long" },
  { id: "biceps_short", name: "Biceps Short Head", group: "Arms", region: "Upper", modelKey: "biceps_short" },
  { id: "brachialis", name: "Brachialis", group: "Arms", region: "Upper", modelKey: "brachialis" },
  { id: "brachioradialis", name: "Brachioradialis", group: "Arms", region: "Upper", modelKey: "brachioradialis" },

  // =====================
  // ARMS — TRICEPS
  // =====================
  { id: "triceps_long", name: "Triceps Long Head", group: "Arms", region: "Upper", modelKey: "triceps_long" },
  { id: "triceps_lateral", name: "Triceps Lateral Head", group: "Arms", region: "Upper", modelKey: "triceps_lateral" },
  { id: "triceps_medial", name: "Triceps Medial Head", group: "Arms", region: "Upper", modelKey: "triceps_medial" },

  // =====================
  // FOREARMS
  // =====================
  { id: "forearm_flexors", name: "Forearm Flexors", group: "Arms", region: "Upper", modelKey: "forearm_flexors" },
  { id: "forearm_extensors", name: "Forearm Extensors", group: "Arms", region: "Upper", modelKey: "forearm_extensors" },

  // =====================
  // CORE
  // =====================
  { id: "abs", name: "Rectus Abdominis", group: "Core", region: "Core", modelKey: "abs" },
  { id: "obliques_internal", name: "Internal Obliques", group: "Core", region: "Core", modelKey: "obliques_internal" },
  { id: "obliques_external", name: "External Obliques", group: "Core", region: "Core", modelKey: "obliques_external" },
  { id: "transverse_abs", name: "Transverse Abdominis", group: "Core", region: "Core", modelKey: "transverse_abs" },
  { id: "iliopsoas", name: "Iliopsoas (Hip Flexors)", group: "Core", region: "Lower", modelKey: "iliopsoas" },

  // =====================
  // GLUTES
  // =====================
  { id: "glute_max", name: "Gluteus Maximus", group: "Glutes", region: "Lower", modelKey: "glute_max" },
  { id: "glute_med", name: "Gluteus Medius", group: "Glutes", region: "Lower", modelKey: "glute_med" },
  { id: "glute_min", name: "Gluteus Minimus", group: "Glutes", region: "Lower", modelKey: "glute_min" },

  // =====================
  // LEGS — QUADS
  // =====================
  { id: "quad_rectus", name: "Rectus Femoris", group: "Legs", region: "Lower", modelKey: "quad_rectus" },
  { id: "quad_vastus_lateral", name: "Vastus Lateralis", group: "Legs", region: "Lower", modelKey: "quad_lateral" },
  { id: "quad_vastus_medial", name: "Vastus Medialis", group: "Legs", region: "Lower", modelKey: "quad_medial" },
  { id: "quad_vastus_inter", name: "Vastus Intermedius", group: "Legs", region: "Lower", modelKey: "quad_inter" },

  // =====================
  // LEGS — HAMSTRINGS
  // =====================
  { id: "ham_biceps", name: "Biceps Femoris", group: "Legs", region: "Lower", modelKey: "ham_biceps" },
  { id: "ham_semitendinosus", name: "Semitendinosus", group: "Legs", region: "Lower", modelKey: "ham_semitendinosus" },
  { id: "ham_semimembranosus", name: "Semimembranosus", group: "Legs", region: "Lower", modelKey: "ham_semimembranosus" },

  // =====================
  // LEGS — ADDUCTORS / ABDUCTORS
  // =====================
  { id: "adductor_magnus", name: "Adductor Magnus", group: "Legs", region: "Lower", modelKey: "adductor_magnus" },
  { id: "gracilis", name: "Gracilis", group: "Legs", region: "Lower", modelKey: "gracilis" },
  { id: "pectineus", name: "Pectineus", group: "Legs", region: "Lower", modelKey: "pectineus" },
  { id: "tfl", name: "Tensor Fasciae Latae", group: "Legs", region: "Lower", modelKey: "tfl" },

  // =====================
  // CALVES
  // =====================
  { id: "calf_gastro", name: "Gastrocnemius", group: "Calves", region: "Lower", modelKey: "calf_gastro" },
  { id: "calf_soleus", name: "Soleus", group: "Calves", region: "Lower", modelKey: "calf_soleus" },

  // =====================
  // NECK
  // =====================
  { id: "neck_scm", name: "Sternocleidomastoid", group: "Neck", region: "Upper", modelKey: "neck_scm" },
  { id: "neck_posterior", name: "Posterior Neck", group: "Neck", region: "Upper", modelKey: "neck_posterior" }
];