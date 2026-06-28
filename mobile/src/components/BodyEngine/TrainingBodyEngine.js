import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const MUSCLE_GROUPS = {
  "left_upper_chest": "chest",
  "right_upper_chest": "chest",
  "left_side_delt": "shoulders",
  "left_front_delt": "shoulders",
  "left_anterior_delt": "shoulders",
  "right_side_delt": "shoulders",
  "right_front_delt": "shoulders",
  "right_anterior_delt": "shoulders",
  "left_rear_delt": "back",
  "left_rear_delt_upper": "shoulders",
  "right_rear_delt": "back",
  "right_rear_delt_upper": "shoulders",
  "left_biceps": "arms",
  "right_biceps": "arms",
  "left_triceps": "arms",
  "right_triceps": "arms",
  "left_outer_forearm": "arms",
  "left_inner_forearm": "arms",
  "right_outer_forearm": "arms",
  "right_inner_forearm": "arms",
  "left_brachioradialis": "arms",
  "right_brachioradialis": "arms",
  "left_forearm_extensors": "arms",
  "right_forearm_extensors": "arms",
  "left_forearm_outer_back": "arms",
  "right_forearm_outer_back": "arms",
  "left_neck_trap": "back",
  "right_neck_trap": "back",
  "left_mid_trap": "back",
  "right_mid_trap": "back",
  "left_upper_trap": "back",
  "right_upper_trap": "back",
  "left_lats": "back",
  "right_lats": "back",
  "left_rhomboids": "back",
  "right_rhomboids": "back",
  "left_infraspinatus": "back",
  "right_infraspinatus": "back",
  "left_teres_major": "back",
  "right_teres_major": "back",
  "left_upper_quad": "legs",
  "right_upper_quad": "legs",
  "left_outer_quad": "legs",
  "right_outer_quad": "legs",
  "left_inner_quad": "legs",
  "right_inner_quad": "legs",
  "left_shin_inner": "legs",
  "right_shin_inner": "legs",
  "left_shin_outer": "legs",
  "right_shin_outer": "legs",
  "left_glute_max": "legs",
  "right_glute_max": "legs",
  "left_adductor": "legs",
  "right_adductor": "legs",
  "left_inner_hamstring": "legs",
  "right_inner_hamstring": "legs",
  "left_outer_hamstring": "legs",
  "right_outer_hamstring": "legs",
  "left_soleus": "legs",
  "right_soleus": "legs",
  "left_lateral_calf": "legs",
  "right_lateral_calf": "legs",
  "left_medial_calf": "legs",
  "right_medial_calf": "legs",
  "left_achilles_tendon": "legs",
  "right_achilles_tendon": "legs"
};

const ANATOMICAL_TO_PATH = {
  // Chest
  "chest_upper": ["left_upper_chest", "right_upper_chest"],
  "chest_mid": ["left_upper_chest", "right_upper_chest"],
  "chest_lower": ["left_upper_chest", "right_upper_chest"],
  "serratus_anterior": ["left_upper_chest", "right_upper_chest"],

  // Shoulders
  "delts_front": ["left_front_delt", "right_front_delt", "left_anterior_delt", "right_anterior_delt"],
  "delts_side": ["left_side_delt", "right_side_delt"],
  "delts_rear": ["left_rear_delt", "right_rear_delt", "left_rear_delt_upper", "right_rear_delt_upper"],
  "rotator_cuff": ["left_infraspinatus", "right_infraspinatus"],

  // Biceps
  "biceps_long": ["left_biceps", "right_biceps"],
  "biceps_short": ["left_biceps", "right_biceps"],
  "brachialis": ["left_biceps", "right_biceps"],
  "brachioradialis": ["left_brachioradialis", "right_brachioradialis"],

  // Triceps
  "triceps_long": ["left_triceps", "right_triceps"],
  "triceps_lateral": ["left_triceps", "right_triceps"],
  "triceps_medial": ["left_triceps", "right_triceps"],

  // Forearms
  "forearm_flexors": ["left_inner_forearm", "right_inner_forearm"],
  "forearm_extensors": ["left_outer_forearm", "right_outer_forearm", "left_forearm_extensors", "right_forearm_extensors", "left_forearm_outer_back", "right_forearm_outer_back"],

  // Back
  "lats": ["left_lats", "right_lats"],
  "rhomboids": ["left_rhomboids", "right_rhomboids"],
  "teres_major": ["left_teres_major", "right_teres_major"],
  "traps_upper": ["left_upper_trap", "right_upper_trap", "left_neck_trap", "right_neck_trap"],
  "traps_middle": ["left_mid_trap", "right_mid_trap"],
  "traps_lower": ["left_mid_trap", "right_mid_trap"],
  "erector_spinae": ["left_mid_trap", "right_mid_trap"],

  // Glutes
  "glute_max": ["left_glute_max", "right_glute_max"],
  "glute_med": ["left_glute_max", "right_glute_max"],
  "glute_min": ["left_glute_max", "right_glute_max"],

  // Quads
  "quad_rectus": ["left_upper_quad", "right_upper_quad"],
  "quad_vastus_lateral": ["left_outer_quad", "right_outer_quad"],
  "quad_vastus_medial": ["left_inner_quad", "right_inner_quad"],
  "quad_vastus_inter": ["left_upper_quad", "right_upper_quad"],

  // Hamstrings
  "ham_biceps": ["left_outer_hamstring", "right_outer_hamstring"],
  "ham_semitendinosus": ["left_inner_hamstring", "right_inner_hamstring"],
  "ham_semimembranosus": ["left_inner_hamstring", "right_inner_hamstring"],

  // Calves & Shin
  "calf_gastro": ["left_lateral_calf", "right_lateral_calf", "left_medial_calf", "right_medial_calf"],
  "calf_soleus": ["left_soleus", "right_soleus", "left_achilles_tendon", "right_achilles_tendon"],

  // Adductors / Gracilis
  "adductor_magnus": ["left_adductor", "right_adductor"],
  "gracilis": ["left_adductor", "right_adductor"],
  "pectineus": ["left_adductor", "right_adductor"],
  "tfl": ["left_outer_quad", "right_outer_quad"],
};

export default function TrainingBodyEngine({
  style,
  selectedMuscles = [],
  onMusclePress,
  highlightColor = '#6D5DF6',
  interactive = true,
  width,
  height,
}) {
  const [containerWidth, setContainerWidth] = useState(
    width || Dimensions.get('window').width - 40
  );

  const onLayout = useCallback((e) => {
    if (!width) {
      setContainerWidth(e.nativeEvent.layout.width);
    }
  }, [width]);

  const svgAspect = 5461.13 / 3834.42;
  const effectiveWidth = width || containerWidth;
  const effectiveHeight = height || effectiveWidth / svgAspect;

  const handlePress = useCallback((muscleId) => {
    if (onMusclePress && interactive) {
      const group = MUSCLE_GROUPS[muscleId] || 'unknown';
      onMusclePress(muscleId, group);
    }
  }, [onMusclePress, interactive]);

  const isSelected = useCallback((muscleId) => {
    if (!selectedMuscles || selectedMuscles.length === 0) return false;
    if (selectedMuscles.includes(muscleId)) return true;
    const group = MUSCLE_GROUPS[muscleId];
    if (group && selectedMuscles.includes(group)) return true;

    // Check if any anatomical ID in selectedMuscles maps to this path ID
    for (const selected of selectedMuscles) {
      const paths = ANATOMICAL_TO_PATH[selected];
      if (paths && paths.includes(muscleId)) return true;
    }
    return false;
  }, [selectedMuscles]);

  const getMuscleColor = useCallback((muscleId, defaultFill) => {
    if (isSelected(muscleId)) return highlightColor;
    return defaultFill;
  }, [isSelected, highlightColor]);

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      <Svg
        width={effectiveWidth}
        height={effectiveHeight}
        viewBox="0 0 5461.13 3834.42"
        preserveAspectRatio="xMidYMid meet"
      >
        <G id="_Artboards_" transform="translate(-269.67,-82.71)">
          <G id="Layer 1" transform="translate(-269.67,-82.71)">
            <Path id="&lt;Path&gt;" d="M 269.67,3917.13 H 5730.8 V 82.71 H 269.67 Z" fill="transparent" />
            <G id="g1629" transform="translate(34.440344,-29.520295)">
              <G id="g168">
                <G id="g86" transform="matrix(1.3653703,0,0,1.2052492,-141.74104,-516.32379)">
                  <G id="&lt;Group&gt;">
                    <Path id="path1" d="m 1159.21,583.28 c 48.38,1.22 72.46,12.52 99.77,55.15 28.2,44.01 14.83,125.22 14.83,125.22 21.43,-9.55 12.03,21.11 6.99,56.14 -5.04,35.03 -25.54,32.59 -25.54,32.59 -3.31,25.51 -19.54,52.37 -19.54,52.37 0,0 -2.71,41.54 -0.1,53.74 2.6,12.2 26.18,6.29 87.53,44.22 22.52,13.92 34.58,9.96 80.41,25.68 65.05,22.3 81.98,51.6 84.81,139.46 0,0 0.23,27.29 9.7,45.98 5.36,10.56 46.77,56.71 53.77,162.57 0,0 -1.72,21.57 15.61,36.01 17.33,14.45 57.65,42.91 90.9,132.29 31.27,84.06 97.88,147.95 116.81,164.75 0,0 5.8,5.67 18.98,3.03 11.44,-2.29 38.95,-3.18 58.67,4.84 19.72,8.01 41.01,10.36 53.29,9.96 12.27,-0.4 15.73,6.38 16,9.87 0.3,3.98 -2.23,9.48 -12.88,12.41 -10.65,2.93 -32.95,0.15 -43.26,-2.19 -10.31,-2.34 -16.11,-3.48 -10.53,4.88 0,0 14.25,21.96 21.17,30.73 6.91,8.77 22.86,28.82 31.42,40.45 8.56,11.62 19.17,30.18 21.32,35.96 2.14,5.78 1.05,10.87 -1.52,13.04 -2.82,2.39 -6.54,3.18 -9.91,1.74 0,0 10.12,12.36 3.26,18.34 -6.86,5.98 -15.54,-1.54 -17.78,-3.38 0,0 -0.71,4.21 -2.59,6.25 -2.65,2.88 -9.3,4.87 -14.87,0.88 -5.48,-3.93 -21.1,-15.67 -21.1,-15.67 0,0 0.6,3.58 -2.19,6.37 -2.78,2.78 -10.03,2.23 -15.1,-0.2 -5.06,-2.44 -34.74,-25.49 -38.55,-28.88 -3.81,-3.38 -15.37,-13.9 -22.17,-18.09 -6.81,-4.19 -26.26,-19.76 -34.79,-33.52 -8.52,-13.77 -10.02,-25.32 -23.38,-37.65 -13.36,-12.33 -146.48,-128.95 -170.02,-147.03 -23.53,-18.07 -82.07,-83.49 -99.34,-134.88 -17.27,-51.39 -17.98,-63.33 -31.73,-80.48 -10.8,-13.49 -24.33,-35.04 -33.98,-58.22 0,0 -11.37,29.14 -31.55,56.8 0,0 -15.34,23.07 -15.68,53.72 -0.33,29.87 -11.79,108.66 -8.83,149.87 2.27,31.56 10.62,65.03 19.73,104.2 8.65,37.21 44.4,258.02 40.4,390.21 -4.77,157.34 -44.86,218.63 -45.85,248.03 -1,29.4 -4.44,53.44 1.05,76.86 5.48,23.43 26.9,69.77 0.49,180.89 -26.41,111.12 -31.28,274.95 -29.69,302.92 0.23,4.05 1.68,6.54 1.68,6.54 4.43,8.1 8.25,14.8 6.07,31.53 -2.66,20.39 23.37,40.78 30.81,69 7.44,28.23 41.44,27.71 36.13,56.46 0,0 -4.01,8.8 -17,11.5 -37.72,7.84 -75.98,0 -87.67,3.13 -11.68,3.14 -44.62,7.32 -46.75,-21.43 -2.12,-28.75 6.38,-63.63 6.91,-84.35 0.46,-18 -5.99,-38.06 -4.24,-56.81 0.18,-1.9 0.93,-5.6 0.93,-5.6 0,0 10.55,-68.27 -4.4,-132.55 0,0 -48.75,-152.14 -45.76,-230.87 2.99,-78.74 26.91,-120.6 12.96,-164.45 -13.95,-43.85 -29.69,-189.04 -27.7,-287.71 1.99,-98.66 -22.92,-142.31 -21.93,-219.05 0,0 0.75,-4.48 -4.48,-4.48 -5.23,0 -4.49,4.48 -4.49,4.48 1,76.74 -23.91,120.39 -21.92,219.05 1.99,98.67 -13.75,243.86 -27.7,287.71 -13.95,43.85 9.97,85.71 12.96,164.45 2.99,78.73 -45.76,230.87 -45.76,230.87 -14.95,64.28 -4.41,132.55 -4.41,132.55 0,0 0.76,3.7 0.94,5.6 1.75,18.75 -4.7,38.81 -4.24,56.81 0.53,20.72 9.03,55.6 6.91,84.35 -2.13,28.75 -35.07,24.57 -46.76,21.43 -11.69,-3.13 -49.94,4.71 -87.66,-3.13 -12.99,-2.7 -17,-11.5 -17,-11.5 -5.31,-28.75 28.69,-28.23 36.13,-56.46 7.43,-28.22 33.47,-48.61 30.81,-69 -2.18,-16.73 1.64,-23.43 6.07,-31.53 0,0 1.45,-2.49 1.68,-6.54 1.59,-27.97 -3.29,-191.8 -29.7,-302.92 -26.41,-111.12 -4.98,-157.46 0.5,-180.89 5.48,-23.42 2.05,-47.46 1.05,-76.86 -0.99,-29.4 -41.08,-90.69 -45.85,-248.03 -4,-132.19 31.75,-353 40.4,-390.21 9.11,-39.17 17.46,-72.64 19.72,-104.2 2.96,-41.21 -8.49,-120 -8.82,-149.87 -0.34,-30.65 -15.68,-53.72 -15.68,-53.72 -20.18,-27.66 -31.55,-56.8 -31.55,-56.8 -9.66,23.18 -23.18,44.73 -33.99,58.22 -13.74,17.15 -14.45,29.09 -31.72,80.48 -17.27,51.39 -75.81,116.81 -99.34,134.88 -23.54,18.08 -156.66,134.7 -170.02,147.03 -13.36,12.33 -14.86,23.88 -23.38,37.65 -8.53,13.76 -27.98,29.33 -34.79,33.52 -6.81,4.19 -18.36,14.71 -22.17,18.09 -3.81,3.39 -33.49,26.44 -38.56,28.88 -5.06,2.43 -12.31,2.98 -15.09,0.2 -2.79,-2.79 -2.2,-6.37 -2.2,-6.37 0,0 -15.62,11.74 -21.1,15.67 -5.56,3.99 -12.21,2 -14.87,-0.88 -1.88,-2.04 -2.58,-6.25 -2.58,-6.25 -2.24,1.84 -10.92,9.36 -17.78,3.38 -6.86,-5.98 3.25,-18.34 3.25,-18.34 -3.36,1.44 -7.09,0.65 -9.9,-1.74 -2.57,-2.17 -3.67,-7.26 -1.52,-13.04 2.14,-5.78 12.76,-24.34 21.32,-35.96 8.56,-11.63 24.51,-31.68 31.42,-40.45 6.92,-8.77 21.17,-30.73 21.17,-30.73 5.58,-8.36 -0.23,-7.22 -10.53,-4.88 -10.31,2.34 -32.61,5.12 -43.26,2.19 -10.65,-2.93 -13.18,-8.43 -12.88,-12.41 0.27,-3.49 3.73,-10.27 16,-9.87 12.28,0.4 33.57,-1.95 53.29,-9.96 19.72,-8.02 47.22,-7.13 58.67,-4.84 13.18,2.64 18.98,-3.03 18.98,-3.03 18.93,-16.8 85.54,-80.69 116.81,-164.75 33.25,-89.38 73.57,-117.84 90.9,-132.29 17.32,-14.44 15.61,-36.01 15.61,-36.01 6.99,-105.86 48.41,-152.01 53.76,-162.57 9.48,-18.69 9.71,-45.98 9.71,-45.98 2.83,-87.86 19.75,-117.16 84.8,-139.46 45.84,-15.72 57.9,-11.76 80.41,-25.68 61.36,-37.93 84.94,-32.02 87.54,-44.22 2.6,-12.2 -0.11,-58.05 -0.11,-58.05 0,0 -16.22,-22.55 -19.53,-48.06 0,0 -20.5,2.44 -25.54,-32.59 -5.04,-35.03 -14.44,-65.69 6.99,-56.14 0,0 -13.37,-81.21 14.83,-125.22 27.31,-42.63 51.01,-53.93 99.39,-55.15 z" fill="#4f5c70" />
                  </G>
                  <G id="g85">
                    <G id="g84">
                      <G id="g57" fill="#9299a5" fillOpacity={1}>
                        <G id="g29" fill="#9299a5" fillOpacity={1}>
                          <G id="g2" fill="#9299a5" fillOpacity={1}>
                            <Path id="path2" d="m 845.45,1180.63 c 0,0 -4.97,-67.95 16.99,-99.11 21.97,-31.16 57.73,-44.44 93.49,-53.64 0,0 -72.33,48.19 -110.48,152.75 z" fillOpacity={1} fill={getMuscleColor('left_side_delt', '#9299a5')} onPress={interactive ? () => handlePress('left_side_delt') : undefined} opacity={isSelected('left_side_delt') ? 1 : 0.85} />
                          </G>
                          <G id="g3" fill="#9299a5" fillOpacity={1}>
                            <Path id="path3" d="m 966.92,1032.73 c 0,0 -85.37,69.57 -121.47,172.42 0,0 58.14,-39.59 95.33,-78.67 36.61,-38.49 41.8,-69.74 26.14,-93.75 z" fillOpacity={1} fill={getMuscleColor('left_front_delt', '#9299a5')} onPress={interactive ? () => handlePress('left_front_delt') : undefined} opacity={isSelected('left_front_delt') ? 1 : 0.85} />
                          </G>
                          <G id="g4" fill="#9299a5" fillOpacity={1}>
                            <Path id="path4" d="m 887.65,1189.48 c 0,0 -73.72,38.01 -90.09,95.88 -28.6,101.15 -5.28,158.87 -7.32,174.54 0,0 47.95,-48.8 67.61,-84.63 33.2,-60.54 56.36,-121.08 29.8,-185.79 z" fillOpacity={1} fill={getMuscleColor('left_biceps', '#9299a5')} onPress={interactive ? () => handlePress('left_biceps') : undefined} opacity={isSelected('left_biceps') ? 1 : 0.85} />
                          </G>
                          <G id="g5" fill="#9299a5" fillOpacity={1}>
                            <Path id="path5" d="m 908.93,1264 c 0,0 -0.13,73.72 -68.07,156.22 0,0 34.25,-7.32 59.59,-48.19 25.34,-40.87 8.48,-108.03 8.48,-108.03 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g6" fill="#9299a5" fillOpacity={1}>
                            <Path id="path6" d="m 773.89,1420.22 c 0,0 13.63,53.98 -8.17,86.68 -21.8,32.7 -61.98,104.56 -203.32,208.77 0,0 58.11,-49.45 88.89,-118.86 19.13,-43.14 30.65,-84.46 59.94,-119.2 29.29,-34.74 62.66,-57.39 62.66,-57.39 z" fillOpacity={1} fill={getMuscleColor('left_outer_forearm', '#9299a5')} onPress={interactive ? () => handlePress('left_outer_forearm') : undefined} opacity={isSelected('left_outer_forearm') ? 1 : 0.85} />
                          </G>
                          <G id="g7" fill="#9299a5" fillOpacity={1}>
                            <Path id="path7" d="m 594.41,1734.41 c 0,0 176.08,-126.02 225.12,-195.5 49.04,-69.47 35.42,-111.02 35.42,-111.02 0,0 -40.87,19.07 -57.22,41.55 -16.34,22.48 -27.8,59.27 -66.75,111.71 -44.02,59.26 -136.57,153.26 -136.57,153.26 z" fillOpacity={1} fill={getMuscleColor('left_inner_forearm', '#9299a5')} onPress={interactive ? () => handlePress('left_inner_forearm') : undefined} opacity={isSelected('left_inner_forearm') ? 1 : 0.85} />
                          </G>
                          <G id="g8" fill="#9299a5" fillOpacity={1}>
                            <Path id="path8" d="m 525.1,1728.09 c 0,0 -18.29,-6.06 -38.31,17.29 -16.34,19.04 -33.25,41.8 -33.75,46.54 -0.77,7.15 3.09,19.64 23.15,26.26 20.07,6.62 33.64,21.92 59.3,0.69 25.66,-21.24 31.43,-38.74 31.53,-52.04 0.1,-13.3 -22.97,-34.11 -41.92,-38.74 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g9" fill="#9299a5" fillOpacity={1}>
                            <Path id="path9" d="m 503.94,1721.38 c 0,0 -22.81,8.98 -29.75,13.03 -10.22,5.96 -59.09,14.64 -66.17,7.41 -2.16,-2.2 -2.25,-4.19 -1.69,-5.38 1.13,-2.44 6.53,-3.09 10.13,-3.02 5.36,0.09 32.08,-1.71 43.68,-5.92 14.05,-5.1 33.2,-9.19 43.8,-6.12 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g10" fill="#9299a5" fillOpacity={1}>
                            <Path id="path10" d="m 436.55,1804.12 c 0,0 -21.31,24.92 -26.96,34 -5.65,9.07 -16.98,24.64 -12.7,29.4 3.3,3.65 14.55,-11.72 23.37,-22.34 5.35,-6.44 19.91,-23.15 22.51,-27.33 2.89,-4.67 4.34,-8.54 -6.22,-13.73 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g11" fill="#9299a5" fillOpacity={1}>
                            <Path id="path11" d="m 452.95,1818.9 c 0,0 -23.6,27.68 -31.25,36.5 -7.65,8.83 -19.13,24.5 -20.26,26.37 -1.12,1.88 -2.21,4.86 0.13,6.87 2.11,1.83 6.22,0.29 11.73,-4.57 5.52,-4.85 43.97,-47.73 46.67,-50.94 0,0 5.59,-5.85 2.17,-7.65 -3.81,-2 -5.9,-3.27 -9.19,-6.58 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g12" fill="#9299a5" fillOpacity={1}>
                            <Path id="path12" d="m 472.8,1829.69 c 0,0 -28.65,32.47 -32.43,36.07 -3.78,3.59 -12.84,12.93 -14.36,14.97 -1.51,2.04 -5.22,7.24 -1.64,10.26 3.58,3.02 9.36,-1.09 15.87,-6.78 6.99,-6.11 29.05,-27.78 34.55,-33.27 0,0 10.85,-10.56 12.68,-13.85 1.82,-3.29 -5.11,0.33 -14.67,-7.4 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g13" fill="#9299a5" fillOpacity={1}>
                            <Path id="path13" d="m 497.07,1840.31 c 0,0 -16.72,17.19 -22.8,22.87 -6.09,5.69 -15.82,14.31 -11.99,18.32 4.89,5.11 21.37,-10.45 27.35,-15.39 5.99,-4.93 19.46,-17.82 22.71,-22.13 3.26,-4.3 -1.44,1.74 -15.27,-3.67 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g14" fill="#9299a5" fillOpacity={1}>
                            <Path id="path14" d="m 549.11,1728.1 c 0,0 18.05,12.1 21.63,20.44 3.58,8.34 19.41,-24.18 32.35,-39 12.95,-14.81 -9.02,1.37 -53.98,18.56 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g15" fill="#9299a5" fillOpacity={1}>
                            <Path id="path15" d="m 1027.61,1047.5 c 32.56,-0.71 70.66,1.54 90.61,4.77 0,0 26.51,3.2 27.5,41.51 0.84,31.98 6.73,86.29 -0.95,118.01 -7.29,30.11 -10.41,72.92 -102.85,58.89 C 945.55,1256.06 907,1178.07 907,1178.07 c 0,0 35.98,-22.98 57.96,-56.7 21.97,-33.72 23.54,-73.01 62.65,-73.87 z" fillOpacity={1} fill={getMuscleColor('left_upper_chest', '#9299a5')} onPress={interactive ? () => handlePress('left_upper_chest') : undefined} opacity={isSelected('left_upper_chest') ? 1 : 0.85} />
                          </G>
                          <G id="g16" fill="#9299a5" fillOpacity={1}>
                            <Path id="path16" d="m 994.28,1033.09 c 71.65,-4.97 129.09,8.78 124.11,0.66 -21.46,-34.92 -36.64,-58.23 -36.64,-58.23 -30.93,7.99 -64.36,28.92 -85.08,43.49 0,0 -23.32,15.53 -2.39,14.08 z" fillOpacity={1} fill={getMuscleColor('left_anterior_delt', '#9299a5')} onPress={interactive ? () => handlePress('left_anterior_delt') : undefined} opacity={isSelected('left_anterior_delt') ? 1 : 0.85} />
                          </G>
                          <G id="g17" fill="#9299a5" fillOpacity={1}>
                            <Path id="path17" d="m 1150.96,1049.17 c 0,0 -54.64,-40.75 -55.66,-122.14 0,0 24.38,13.45 26.11,18.74 3.26,9.95 6.54,56.82 29.55,103.4 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g18" fill="#9299a5" fillOpacity={1}>
                            <Path id="path18" d="m 1156.46,943.06 c 18.38,0 26.07,-1.36 25.05,10.85 -1.02,12.21 -21.45,70.54 -21.45,70.54 h -1.7 c 0,0 -20.43,-58.33 -21.45,-70.54 -1.03,-12.21 6.67,-10.85 25.04,-10.85 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g19" fill="#9299a5" fillOpacity={1}>
                            <Path id="path19" d="m 1141.18,1340.31 c 0,0 4.78,-20.08 -0.04,-38.71 -4.82,-18.63 -26.5,-15.67 -54.71,-6.42 -28.21,9.25 -40.79,44.93 -44.51,75.08 0,0 54.6,-39.98 99.26,-29.95 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g20" fill="#9299a5" fillOpacity={1}>
                            <Path id="path20" d="m 1110.61,1362.34 c -19.62,1.96 -37.86,13.22 -53.52,23.16 0,0 -15.78,8.12 -14.09,27.55 1.28,14.62 2.08,33.23 2.08,33.23 0,0 52.53,-18.29 97.08,-14.53 0,0 2.3,-36.57 0,-52.71 -2.31,-16.13 -18.47,-18 -31.55,-16.7 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g21" fill="#9299a5" fillOpacity={1}>
                            <Path id="path21" d="m 1049.6,1477.48 c 0,0 -0.79,-12.97 10.89,-15.56 15.6,-3.47 50.07,-10.72 73.57,-9.34 0,0 8.31,0.31 9.12,11.41 1.06,14.56 2.46,70.89 2.46,70.89 0,0 -94.85,12.96 -96.04,-57.4 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g22" fill="#9299a5" fillOpacity={1}>
                            <Path id="path22" d="m 1057.26,1535.82 c 0,0 21.46,22.87 78,22.21 0,0 11.74,-0.33 12.6,13.73 1.11,18.33 0,196.03 0,196.03 0,0 -79.7,-17.7 -90.6,-231.97 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g23" fill="#9299a5" fillOpacity={1}>
                            <Path id="path23" d="m 912.08,1210.43 c 0,0 23.25,137.42 54.92,175.23 0,0 -13.78,-55.94 -7.14,-90.68 6.64,-34.74 0.83,-26.33 -47.78,-84.55 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g24" fill="#9299a5" fillOpacity={1}>
                            <Path id="path24" d="m 975.35,1370.26 c 0,0 16.38,10.6 33.59,12.5 17.21,1.9 17.65,23.09 4.88,23.36 -12.78,0.28 -30.95,-6.2 -38.47,-35.86 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g25" fill="#9299a5" fillOpacity={1}>
                            <Path id="path25" d="m 973.93,1324.11 c 0,0 17.86,10.41 36.46,11.65 18.59,1.24 19.49,23.44 5.73,24.29 -13.77,0.84 -33.48,-5.15 -42.19,-35.94 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g26" fill="#9299a5" fillOpacity={1}>
                            <Path id="path26" d="m 976.22,1278.39 c 0,0 18.89,10.92 39.27,12.76 20.37,1.84 19.7,23.91 4.48,24.3 -15.22,0.39 -36.47,-6.21 -43.75,-37.06 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g27" fill="#9299a5" fillOpacity={1}>
                            <Path id="path27" d="m 981.45,1418.27 c 0,0 11.77,10.44 31.09,12.25 0,0 5.16,-0.61 7.09,8.36 1.92,8.98 -8.56,12.51 -16.56,11.16 -8.01,-1.36 -18.93,-9.94 -21.62,-31.77 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g28" fill="#9299a5" fillOpacity={1}>
                            <Path id="path28" d="m 989.82,1466.71 c 0,0 33.12,16.03 38.01,47.68 4.9,31.64 11.71,153.81 31.47,201.28 0,0 -51.97,-23.18 -59.7,-62.92 -7.74,-39.74 5.2,-73.43 -9.78,-186.04 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                        </G>
                        <G id="g56" fill="#9299a5" fillOpacity={1}>
                          <G id="g30" fill="#9299a5" fillOpacity={1}>
                            <Path id="path29" d="m 1472.97,1180.63 c 0,0 4.97,-67.95 -17,-99.11 -21.96,-31.16 -57.72,-44.44 -93.48,-53.64 0,0 72.33,48.19 110.48,152.75 z" fillOpacity={1} fill={getMuscleColor('right_side_delt', '#9299a5')} onPress={interactive ? () => handlePress('right_side_delt') : undefined} opacity={isSelected('right_side_delt') ? 1 : 0.85} />
                          </G>
                          <G id="g31" fill="#9299a5" fillOpacity={1}>
                            <Path id="path30" d="m 1351.5,1032.73 c 0,0 85.36,69.57 121.47,172.42 0,0 -58.14,-39.59 -95.33,-78.67 -36.61,-38.49 -41.8,-69.74 -26.14,-93.75 z" fillOpacity={1} fill={getMuscleColor('right_front_delt', '#9299a5')} onPress={interactive ? () => handlePress('right_front_delt') : undefined} opacity={isSelected('right_front_delt') ? 1 : 0.85} />
                          </G>
                          <G id="g32" fill="#9299a5" fillOpacity={1}>
                            <Path id="path31" d="m 1430.77,1189.48 c 0,0 73.72,38.01 90.08,95.88 28.61,101.15 5.28,158.87 7.33,174.54 0,0 -47.95,-48.8 -67.61,-84.63 -33.2,-60.54 -56.36,-121.08 -29.8,-185.79 z" fillOpacity={1} fill={getMuscleColor('right_biceps', '#9299a5')} onPress={interactive ? () => handlePress('right_biceps') : undefined} opacity={isSelected('right_biceps') ? 1 : 0.85} />
                          </G>
                          <G id="g33" fill="#9299a5" fillOpacity={1}>
                            <Path id="path32" d="m 1409.49,1264 c 0,0 0.13,73.72 68.07,156.22 0,0 -34.25,-7.32 -59.59,-48.19 -25.34,-40.87 -8.48,-108.03 -8.48,-108.03 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g34" fill="#9299a5" fillOpacity={1}>
                            <Path id="path33" d="m 1544.52,1420.22 c 0,0 -13.62,53.98 8.18,86.68 21.79,32.7 61.98,104.56 203.32,208.77 0,0 -58.11,-49.45 -88.89,-118.86 -19.13,-43.14 -30.65,-84.46 -59.94,-119.2 -29.29,-34.74 -62.67,-57.39 -62.67,-57.39 z" fillOpacity={1} fill={getMuscleColor('right_outer_forearm', '#9299a5')} onPress={interactive ? () => handlePress('right_outer_forearm') : undefined} opacity={isSelected('right_outer_forearm') ? 1 : 0.85} />
                          </G>
                          <G id="g35" fill="#9299a5" fillOpacity={1}>
                            <Path id="path34" d="m 1724.01,1734.41 c 0,0 -176.08,-126.02 -225.12,-195.5 -49.05,-69.47 -35.42,-111.02 -35.42,-111.02 0,0 40.87,19.07 57.21,41.55 16.35,22.48 27.8,59.27 66.76,111.71 44.02,59.26 136.57,153.26 136.57,153.26 z" fillOpacity={1} fill={getMuscleColor('right_inner_forearm', '#9299a5')} onPress={interactive ? () => handlePress('right_inner_forearm') : undefined} opacity={isSelected('right_inner_forearm') ? 1 : 0.85} />
                          </G>
                          <G id="g36" fill="#9299a5" fillOpacity={1}>
                            <Path id="path35" d="m 1793.32,1728.09 c 0,0 18.28,-6.06 38.31,17.29 16.33,19.04 33.25,41.8 33.75,46.54 0.77,7.15 -3.09,19.64 -23.16,26.26 -20.06,6.62 -33.63,21.92 -59.29,0.69 -25.66,-21.24 -31.43,-38.74 -31.53,-52.04 -0.1,-13.3 22.97,-34.11 41.92,-38.74 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g37" fill="#9299a5" fillOpacity={1}>
                            <Path id="path36" d="m 1814.47,1721.38 c 0,0 22.82,8.98 29.76,13.03 10.22,5.96 59.09,14.64 66.17,7.41 2.16,-2.2 2.25,-4.19 1.69,-5.38 -1.14,-2.44 -6.53,-3.09 -10.13,-3.02 -5.37,0.09 -32.08,-1.71 -43.68,-5.92 -14.05,-5.1 -33.21,-9.19 -43.81,-6.12 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g38" fill="#9299a5" fillOpacity={1}>
                            <Path id="path37" d="m 1881.87,1804.12 c 0,0 21.3,24.92 26.96,34 5.65,9.07 16.98,24.64 12.7,29.4 -3.3,3.65 -14.55,-11.72 -23.37,-22.34 -5.35,-6.44 -19.91,-23.15 -22.51,-27.33 -2.9,-4.67 -4.34,-8.54 6.22,-13.73 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g39" fill="#9299a5" fillOpacity={1}>
                            <Path id="path38" d="m 1865.47,1818.9 c 0,0 23.59,27.68 31.25,36.5 7.65,8.83 19.13,24.5 20.26,26.37 1.12,1.88 2.2,4.86 -0.13,6.87 -2.12,1.83 -6.22,0.29 -11.73,-4.57 -5.52,-4.85 -43.97,-47.73 -46.67,-50.94 0,0 -5.59,-5.85 -2.17,-7.65 3.81,-2 5.9,-3.27 9.19,-6.58 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g40" fill="#9299a5" fillOpacity={1}>
                            <Path id="path39" d="m 1845.62,1829.69 c 0,0 28.65,32.47 32.43,36.07 3.78,3.59 12.84,12.93 14.35,14.97 1.52,2.04 5.23,7.24 1.65,10.26 -3.59,3.02 -9.36,-1.09 -15.87,-6.78 -6.99,-6.11 -29.05,-27.78 -34.55,-33.27 0,0 -10.85,-10.56 -12.68,-13.85 -1.83,-3.29 5.11,0.33 14.67,-7.4 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g41" fill="#9299a5" fillOpacity={1}>
                            <Path id="path40" d="m 1821.34,1840.31 c 0,0 16.72,17.19 22.81,22.87 6.09,5.69 15.82,14.31 11.98,18.32 -4.88,5.11 -21.36,-10.45 -27.34,-15.39 -5.99,-4.93 -19.46,-17.82 -22.71,-22.13 -3.26,-4.3 1.44,1.74 15.26,-3.67 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g42" fill="#9299a5" fillOpacity={1}>
                            <Path id="path41" d="m 1769.3,1728.1 c 0,0 -18.05,12.1 -21.62,20.44 -3.58,8.34 -19.41,-24.18 -32.36,-39 -12.94,-14.81 9.03,1.37 53.98,18.56 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g43" fill="#9299a5" fillOpacity={1}>
                            <Path id="path42" d="m 1290.81,1047.5 c -32.56,-0.71 -70.66,1.54 -90.61,4.77 0,0 -26.51,3.2 -27.51,41.51 -0.83,31.98 -6.73,86.29 0.96,118.01 7.29,30.11 8.44,73.14 100.88,59.12 96.37,-14.63 136.89,-92.84 136.89,-92.84 0,0 -35.99,-22.98 -57.96,-56.7 -21.97,-33.72 -23.55,-73.01 -62.65,-73.87 z" fillOpacity={1} fill={getMuscleColor('right_upper_chest', '#9299a5')} onPress={interactive ? () => handlePress('right_upper_chest') : undefined} opacity={isSelected('right_upper_chest') ? 1 : 0.85} />
                          </G>
                          <G id="g44" fill="#9299a5" fillOpacity={1}>
                            <Path id="path43" d="m 1324.13,1033.09 c -71.64,-4.97 -129.09,8.78 -124.1,0.66 21.46,-34.92 36.64,-58.23 36.64,-58.23 30.93,7.99 64.36,28.92 85.08,43.49 0,0 23.31,15.53 2.38,14.08 z" fillOpacity={1} fill={getMuscleColor('right_anterior_delt', '#9299a5')} onPress={interactive ? () => handlePress('right_anterior_delt') : undefined} opacity={isSelected('right_anterior_delt') ? 1 : 0.85} />
                          </G>
                          <G id="g45" fill="#9299a5" fillOpacity={1}>
                            <Path id="path44" d="m 1167.46,1049.17 c 0,0 54.63,-40.75 55.65,-122.14 0,0 -24.25,12.43 -26.11,18.74 -2.96,10.04 -6.53,56.82 -29.54,103.4 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g46" fill="#9299a5" fillOpacity={1}>
                            <Path id="path45" d="m 1176.22,1340.31 c 0,0 -4.78,-20.08 0.04,-38.71 4.82,-18.63 26.51,-15.67 54.71,-6.42 28.21,9.25 40.79,44.93 44.51,75.08 0,0 -54.6,-39.98 -99.26,-29.95 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g47" fill="#9299a5" fillOpacity={1}>
                            <Path id="path46" d="m 1206.79,1362.34 c 19.62,1.96 37.86,13.22 53.52,23.16 0,0 15.79,8.12 14.09,27.55 -1.27,14.62 -2.08,33.23 -2.08,33.23 0,0 -52.53,-18.29 -97.07,-14.53 0,0 -2.31,-36.57 0,-52.71 2.3,-16.13 18.46,-18 31.54,-16.7 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g48" fill="#9299a5" fillOpacity={1}>
                            <Path id="path47" d="m 1267.81,1477.48 c 0,0 0.79,-12.97 -10.9,-15.56 -15.6,-3.47 -50.07,-10.72 -73.57,-9.34 0,0 -8.31,0.31 -9.12,11.41 -1.06,14.56 -2.46,70.89 -2.46,70.89 0,0 94.85,12.96 96.05,-57.4 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g49" fill="#9299a5" fillOpacity={1}>
                            <Path id="path48" d="m 1260.14,1535.82 c 0,0 -21.46,22.87 -77.99,22.21 0,0 -11.75,-0.33 -12.61,13.73 -1.11,18.33 0,196.03 0,196.03 0,0 79.7,-17.7 90.6,-231.97 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g50" fill="#9299a5" fillOpacity={1}>
                            <Path id="path49" d="m 1406.34,1210.43 c 0,0 -23.25,137.42 -54.92,175.23 0,0 13.78,-55.94 7.14,-90.68 -6.64,-34.74 -0.83,-26.33 47.78,-84.55 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g51" fill="#9299a5" fillOpacity={1}>
                            <Path id="path50" d="m 1343.07,1370.26 c 0,0 -16.38,10.6 -33.59,12.5 -17.21,1.9 -17.65,23.09 -4.88,23.36 12.78,0.28 30.94,-6.2 38.47,-35.86 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g52" fill="#9299a5" fillOpacity={1}>
                            <Path id="path51" d="m 1344.49,1324.11 c 0,0 -17.87,10.41 -36.46,11.65 -18.59,1.24 -19.5,23.44 -5.73,24.29 13.77,0.84 33.48,-5.15 42.19,-35.94 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g53" fill="#9299a5" fillOpacity={1}>
                            <Path id="path52" d="m 1342.19,1278.39 c 0,0 -18.88,10.92 -39.26,12.76 -20.37,1.84 -19.7,23.91 -4.48,24.3 15.22,0.39 36.47,-6.21 43.74,-37.06 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g54" fill="#9299a5" fillOpacity={1}>
                            <Path id="path53" d="m 1336.97,1418.27 c 0,0 -11.78,10.44 -31.09,12.25 0,0 -5.16,-0.61 -7.09,8.36 -1.93,8.98 8.55,12.51 16.56,11.16 8.01,-1.36 18.92,-9.94 21.62,-31.77 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                          <G id="g55" fill="#9299a5" fillOpacity={1}>
                            <Path id="path54" d="m 1328.6,1466.71 c 0,0 -33.12,16.03 -38.02,47.68 -4.89,31.64 -11.71,153.81 -31.46,201.28 0,0 51.97,-23.18 59.7,-62.92 7.74,-39.74 -5.21,-73.43 9.78,-186.04 z" fillOpacity={1} fill="#9299a5" />
                          </G>
                        </G>
                      </G>
                      <G id="g83">
                        <G id="g71">
                          <Path id="path70" d="m 1313.59,1703.73 c 0,0 -137.25,110.16 -137.25,133.86 0,84.13 26.22,183.2 26.22,183.2 0,0 -10.05,-136.4 111.03,-317.06 z" fill={getMuscleColor('right_upper_quad', '#9299a5')} onPress={interactive ? () => handlePress('right_upper_quad') : undefined} opacity={isSelected('right_upper_quad') ? 1 : 0.85} />
                        </G>
                        <G id="g72">
                          <Path id="path71" d="m 1324.83,1715.67 c 0,0 34.52,195.87 -40.02,525.31 0,0 -73.53,-123.29 -59.26,-267.02 7.41,-74.58 99.28,-258.29 99.28,-258.29 z" fill="#9299a5" />
                        </G>
                        <G id="g73">
                          <Path id="path72" d="m 1356.5,1861.35 c 0,0 -11.56,258.3 -58.19,408.34 0,0 -12.05,22.37 20.39,69.63 14.57,21.22 41.26,-36.07 54.91,-131.74 13.66,-95.66 -17.11,-346.23 -17.11,-346.23 z" fill={getMuscleColor('right_outer_quad', '#9299a5')} onPress={interactive ? () => handlePress('right_outer_quad') : undefined} opacity={isSelected('right_outer_quad') ? 1 : 0.85} />
                        </G>
                        <G id="g74">
                          <Path id="path73" d="m 1205.12,2040.72 c 0,0 23.95,152.24 57.14,205.36 28.09,44.96 7.4,88.89 -11,100.64 -17.35,11.09 -62.83,-42.4 -46.14,-306 z" fill={getMuscleColor('right_inner_quad', '#9299a5')} onPress={interactive ? () => handlePress('right_inner_quad') : undefined} opacity={isSelected('right_inner_quad') ? 1 : 0.85} />
                        </G>
                        <G id="g75">
                          <Path id="path74" d="m 1233.89,2432.04 c 0,0 -28.82,80.47 -19.92,159.9 6.92,61.76 66.42,276.41 66.42,276.41 0,0 -16.57,-191.27 -46.5,-436.31 z" fill={getMuscleColor('right_shin_inner', '#9299a5')} onPress={interactive ? () => handlePress('right_shin_inner') : undefined} opacity={isSelected('right_shin_inner') ? 1 : 0.85} />
                        </G>
                        <G id="g76">
                          <Path id="path75" d="m 1328.84,2395.77 c 0,0 37.77,96.55 19.91,168.75 -17.86,72.21 -44.01,177.13 -44.69,313.36 0,0 -18.71,-92.57 -7.94,-255.8 5.99,-90.84 10.23,-168.55 32.72,-226.31 z" fill={getMuscleColor('right_shin_outer', '#9299a5')} onPress={interactive ? () => handlePress('right_shin_outer') : undefined} opacity={isSelected('right_shin_outer') ? 1 : 0.85} />
                        </G>
                        <G id="g77">
                          <Path id="path76" d="m 1223.21,2355.07 c 0,0 21.81,37.96 25.44,76.33 3.63,38.37 28.05,139.9 28.05,139.9 0,0 -8.85,-104.22 -4.91,-140.86 3.94,-36.63 -48.58,-75.37 -48.58,-75.37 z" fill="#9299a5" />
                        </G>
                        <G id="g78">
                          <Path id="path77" d="m 1319.72,2362.99 c 0,0 -11.75,32.7 -19.92,38.83 -8.18,6.13 -22.48,-6.65 -34.23,-35.76 -11.75,-29.12 43.42,-18.91 47,-18.4 3.57,0.51 10.78,5.95 7.15,15.33 z" fill="#9299a5" />
                        </G>
                        <G id="g79">
                          <Path id="path78" d="m 1282.47,3042.34 c 0,0 5.37,26.28 6.35,30.73 0.97,4.45 -5.04,9.3 -13.5,9.3 -8.46,0 -19.19,-1.62 -17.24,-12.54 1.95,-10.91 2.83,-15.88 3.8,-18.71 0.98,-2.83 12.3,-14.44 20.59,-8.78 z" fill="#9299a5" />
                        </G>
                        <G id="g80">
                          <Path id="path79" d="m 1294.9,3039.03 c 0,0 3.55,32.7 11.97,36.91 8.42,4.21 59.91,5.51 73.51,0 13.6,-5.5 -11.98,-22.66 -16.84,-26.23 -4.86,-3.56 -11.66,-23.63 -12.95,-30.76 -1.3,-7.12 -7.43,-9.71 -55.69,20.08 z" fill="#9299a5" />
                        </G>
                        <G id="g81">
                          <Path id="path80" d="m 1261.89,3032.98 c 0,0 34.94,-20.32 71.29,-34.15 0,0 5.86,-3.05 0,-11.02 -5.86,-7.98 -12.95,-33.54 -13.63,-40.81 -0.68,-7.26 -52.41,36.38 -58.83,56.05 -3.29,10.08 0.95,19.53 1.17,29.93 z" fill="#9299a5" />
                        </G>
                        <G id="g82">
                          <Path id="path81" d="m 1268.65,2965.81 c 0,0 31.09,-27.85 39.83,-35.94 8.75,-8.1 4.86,-31.41 -3.56,-27.85 -8.42,3.56 -39.51,8.42 -40.81,13.6 -1.29,5.18 -1.94,53.43 4.54,50.19 z" fill="#9299a5" />
                        </G>
                      </G>
                      <G id="g70">
                        <G id="g58">
                          <Path id="path57" d="m 1005.93,1703.73 c 0,0 137.25,110.16 137.25,133.86 0,84.13 -26.22,183.2 -26.22,183.2 0,0 10.04,-136.4 -111.03,-317.06 z" fill={getMuscleColor('left_upper_quad', '#9299a5')} onPress={interactive ? () => handlePress('left_upper_quad') : undefined} opacity={isSelected('left_upper_quad') ? 1 : 0.85} />
                        </G>
                        <G id="g59">
                          <Path id="path58" d="m 994.69,1715.67 c 0,0 -34.52,195.87 40.02,525.31 0,0 73.53,-123.29 59.26,-267.02 -7.41,-74.58 -99.28,-258.29 -99.28,-258.29 z" fill="#9299a5" />
                        </G>
                        <G id="g60">
                          <Path id="path59" d="m 963.01,1861.35 c 0,0 11.57,258.3 58.2,408.34 0,0 12.05,22.37 -20.39,69.63 -14.57,21.22 -41.26,-36.07 -54.92,-131.74 -13.65,-95.66 17.11,-346.23 17.11,-346.23 z" fill={getMuscleColor('left_outer_quad', '#9299a5')} onPress={interactive ? () => handlePress('left_outer_quad') : undefined} opacity={isSelected('left_outer_quad') ? 1 : 0.85} />
                        </G>
                        <G id="g61">
                          <Path id="path60" d="m 1114.4,2040.72 c 0,0 -23.95,152.24 -57.14,205.36 -28.09,44.96 -7.4,88.89 10.99,100.64 17.36,11.09 62.84,-42.4 46.15,-306 z" fill={getMuscleColor('left_inner_quad', '#9299a5')} onPress={interactive ? () => handlePress('left_inner_quad') : undefined} opacity={isSelected('left_inner_quad') ? 1 : 0.85} />
                        </G>
                        <G id="g62">
                          <Path id="path61" d="m 1085.62,2432.04 c 0,0 28.83,80.47 19.93,159.9 -6.93,61.76 -66.42,276.41 -66.42,276.41 0,0 16.57,-191.27 46.49,-436.31 z" fill={getMuscleColor('left_shin_inner', '#9299a5')} onPress={interactive ? () => handlePress('left_shin_inner') : undefined} opacity={isSelected('left_shin_inner') ? 1 : 0.85} />
                        </G>
                        <G id="g63">
                          <Path id="path62" d="m 990.68,2395.77 c 0,0 -37.77,96.55 -19.91,168.75 17.86,72.21 44.01,177.13 44.69,313.36 0,0 18.71,-92.57 7.94,-255.8 -5.99,-90.84 -10.23,-168.55 -32.72,-226.31 z" fill={getMuscleColor('left_shin_outer', '#9299a5')} onPress={interactive ? () => handlePress('left_shin_outer') : undefined} opacity={isSelected('left_shin_outer') ? 1 : 0.85} />
                        </G>
                        <G id="g64">
                          <Path id="path63" d="m 1096.31,2355.07 c 0,0 -21.81,37.96 -25.44,76.33 -3.63,38.37 -28.05,139.9 -28.05,139.9 0,0 8.85,-104.22 4.91,-140.86 -3.94,-36.63 48.58,-75.37 48.58,-75.37 z" fill="#9299a5" />
                        </G>
                        <G id="g65">
                          <Path id="path64" d="m 999.8,2362.99 c 0,0 11.75,32.7 19.92,38.83 8.18,6.13 22.48,-6.65 34.23,-35.76 11.75,-29.12 -43.42,-18.91 -47,-18.4 -3.58,0.51 -10.78,5.95 -7.15,15.33 z" fill="#9299a5" />
                        </G>
                        <G id="g66">
                          <Path id="path65" d="m 1037.04,3042.34 c 0,0 -5.36,26.28 -6.34,30.73 -0.98,4.45 5.04,9.3 13.5,9.3 8.46,0 19.19,-1.62 17.24,-12.54 -1.95,-10.91 -2.83,-15.88 -3.81,-18.71 -0.97,-2.83 -12.29,-14.44 -20.59,-8.78 z" fill="#9299a5" />
                        </G>
                        <G id="g67">
                          <Path id="path66" d="m 1024.61,3039.03 c 0,0 -3.54,32.7 -11.96,36.91 -8.42,4.21 -59.91,5.51 -73.51,0 -13.6,-5.5 11.98,-22.66 16.84,-26.23 4.86,-3.56 11.66,-23.63 12.95,-30.76 1.3,-7.12 7.42,-9.71 55.68,20.08 z" fill="#9299a5" />
                        </G>
                        <G id="g68">
                          <Path id="path67" d="m 1057.63,3032.98 c 0,0 -34.94,-20.32 -71.29,-34.15 0,0 -5.86,-3.05 0,-11.02 5.86,-7.98 12.94,-33.54 13.62,-40.81 0.68,-7.26 52.42,36.38 58.84,56.05 3.29,10.08 -0.95,19.53 -1.17,29.93 z" fill="#9299a5" />
                        </G>
                        <G id="g69">
                          <Path id="path68" d="m 1050.87,2965.81 c 0,0 -31.09,-27.85 -39.83,-35.94 -8.75,-8.1 -4.86,-31.41 3.56,-27.85 8.42,3.56 39.51,8.42 40.8,13.6 1.3,5.18 1.95,53.43 -4.53,50.19 z" fill="#9299a5" />
                        </G>
                      </G>
                    </G>
                  </G>
                </G>
                <G id="g155" transform="matrix(1.3292844,0,0,1.1719655,651.95062,-489.95205)">
                  <G id="g87">
                    <Path id="path86" d="m 3638.19,1872.44 c 2.58,-2.18 3.67,-7.27 1.53,-13.05 -2.15,-5.78 -12.76,-24.33 -21.32,-35.96 -8.56,-11.63 -24.51,-31.68 -31.42,-40.45 -6.92,-8.77 -21.17,-30.72 -21.17,-30.72 -5.58,-8.37 0.22,-7.23 10.53,-4.89 10.31,2.34 32.61,5.12 43.26,2.19 10.65,-2.93 13.18,-8.43 12.87,-12.41 -0.27,-3.49 -3.72,-10.27 -16,-9.87 -12.27,0.4 -33.57,-1.95 -53.28,-9.96 -19.72,-8.02 -47.23,-7.13 -58.67,-4.84 -13.18,2.64 -18.98,-3.03 -18.98,-3.03 -18.93,-16.8 -85.54,-80.69 -116.81,-164.75 -33.25,-89.38 -73.57,-117.84 -90.9,-132.29 -17.33,-14.44 -15.61,-36.01 -15.61,-36.01 -7,-105.86 -48.41,-152.01 -53.77,-162.57 -9.47,-18.69 -9.7,-45.98 -9.7,-45.98 -2.83,-87.86 -19.76,-117.16 -84.81,-139.46 -45.83,-15.72 -57.89,-11.75 -80.41,-25.68 -61.35,-37.93 -84.93,-32.02 -87.53,-44.22 -2.61,-12.2 0.1,-53.74 0.1,-53.74 0,0 16.23,-26.85 19.53,-52.37 0,0 20.51,2.44 25.55,-32.59 5.04,-35.03 14.43,-65.69 -6.99,-56.14 0,0 13.37,-81.21 -14.83,-125.22 -27.32,-42.63 -51.39,-53.93 -99.77,-55.15 h -0.38 c -48.38,1.22 -72.08,12.52 -99.39,55.15 -28.2,44.01 -14.83,125.22 -14.83,125.22 -21.43,-9.55 -12.04,21.11 -6.99,56.14 5.04,35.03 25.54,32.59 25.54,32.59 3.31,25.52 19.53,48.06 19.53,48.06 0,0 2.71,45.85 0.11,58.05 -2.6,12.2 -26.18,6.29 -87.54,44.22 -22.51,13.93 -34.57,9.96 -80.41,25.68 -65.05,22.3 -81.97,51.6 -84.8,139.46 0,0 -0.23,27.29 -9.71,45.98 -5.35,10.56 -46.77,56.71 -53.76,162.57 0,0 1.71,21.57 -15.61,36.01 -17.33,14.45 -57.66,42.91 -90.9,132.29 -31.27,84.06 -97.89,147.95 -116.81,164.75 0,0 -5.8,5.67 -18.99,3.03 -11.44,-2.29 -38.95,-3.18 -58.66,4.84 -19.72,8.01 -41.01,10.36 -53.29,9.96 -12.27,-0.4 -15.73,6.38 -16,9.87 -0.31,3.98 2.23,9.48 12.88,12.41 10.65,2.93 32.95,0.15 43.26,-2.19 10.3,-2.34 16.11,-3.48 10.53,4.89 0,0 -14.26,21.95 -21.17,30.72 -6.92,8.77 -22.86,28.82 -31.42,40.45 -8.56,11.63 -19.18,30.18 -21.32,35.96 -2.15,5.78 -1.05,10.87 1.52,13.05 2.81,2.38 6.54,3.17 9.9,1.73 0,0 -10.11,12.36 -3.25,18.34 6.86,5.98 15.54,-1.54 17.78,-3.38 0,0 0.7,4.21 2.58,6.25 2.66,2.88 9.31,4.87 14.87,0.88 5.48,-3.93 21.1,-15.66 21.1,-15.66 0,0 -0.59,3.57 2.2,6.36 2.78,2.78 10.03,2.23 15.09,-0.2 5.07,-2.44 34.75,-25.49 38.56,-28.88 3.81,-3.38 15.36,-13.9 22.17,-18.09 6.81,-4.19 26.26,-19.76 34.79,-33.52 8.52,-13.77 10.02,-25.32 23.38,-37.65 13.36,-12.32 146.48,-128.95 170.02,-147.02 23.53,-18.08 82.07,-83.5 99.34,-134.89 17.27,-51.39 17.98,-63.33 31.72,-80.48 10.81,-13.49 24.33,-35.04 33.99,-58.22 0,0 11.37,29.14 31.55,56.8 0,0 15.34,23.07 15.68,53.73 0.33,29.86 11.78,108.65 8.82,149.86 -2.27,31.56 -10.61,65.03 -19.72,104.2 -8.65,37.21 -44.41,258.02 -40.4,390.21 4.77,157.34 44.85,218.63 45.85,248.03 1,29.4 4.43,53.44 -1.05,76.86 -5.48,23.43 -26.91,69.77 -0.5,180.89 26.41,111.12 30.91,281.5 29.03,309.45 -0.65,9.74 -2.24,14.62 -2.24,14.62 -3.14,8.41 -4.57,19.58 -3.64,29.59 1.1,11.84 -4.95,16.14 -11.56,25.29 -6.6,9.14 -14.31,37.12 -24.77,52.18 -10.46,15.06 -27.53,20.44 -34.68,23.13 -7.16,2.69 -6.61,20.98 0,24.21 6.6,3.23 24.77,4.84 63.86,4.84 39.08,0 79.82,0 86.43,-6.45 6.61,-6.46 12.11,-23.67 6.06,-52.72 -6.06,-29.05 -13.22,-59.18 -11.57,-66.17 1.66,-7 5.2,-22.32 3.31,-42.5 -1.34,-14.24 -0.64,-39.89 -0.64,-39.89 -1.06,-25.59 -0.33,-60.98 7.64,-95.24 0,0 48.74,-152.14 45.75,-230.87 -2.99,-78.74 -26.91,-120.6 -12.95,-164.45 13.95,-43.85 29.69,-189.04 27.7,-287.71 -2,-98.66 22.92,-142.31 21.92,-219.05 0,0 -0.75,-4.48 4.49,-4.48 5.23,0 4.48,4.48 4.48,4.48 -0.99,76.74 23.92,120.39 21.93,219.05 -1.99,98.67 13.74,243.86 27.7,287.71 13.95,43.85 -9.97,85.71 -12.96,164.45 -2.99,78.73 45.76,230.87 45.76,230.87 6.54,28.14 8.19,57 7.98,80.6 -0.1,9.37 -0.54,42.36 -1.68,54.53 -1.9,20.18 1.65,35.5 3.3,42.5 1.65,6.99 -5.5,37.12 -11.56,66.17 -6.05,29.05 -0.55,46.26 6.06,52.72 6.6,6.45 47.34,6.45 86.43,6.45 39.09,0 57.26,-1.61 63.86,-4.84 6.61,-3.23 7.16,-21.52 0,-24.21 -7.15,-2.69 -24.22,-8.07 -34.68,-23.13 -10.46,-15.06 -18.17,-43.04 -24.78,-52.18 -6.6,-9.15 -12.66,-13.45 -11.56,-25.29 0.93,-10.01 -0.5,-21.18 -3.63,-29.59 0,0 -1.6,-4.88 -2.25,-14.62 -0.5,-7.57 -0.54,-25.62 0.2,-50.05 l 0.09,-0.01 c 1.94,-63.09 9.64,-176.06 29.44,-259.39 26.41,-111.12 4.99,-157.46 -0.5,-180.89 -5.48,-23.42 -2.04,-47.46 -1.04,-76.86 0.99,-29.4 41.08,-90.69 45.85,-248.03 4,-132.19 -31.76,-353 -40.4,-390.21 -9.11,-39.17 -17.46,-72.64 -19.73,-104.2 -2.96,-41.21 8.49,-120 8.83,-149.86 0.34,-30.66 15.67,-53.73 15.67,-53.73 20.19,-27.66 31.56,-56.8 31.56,-56.8 9.65,23.18 23.18,44.73 33.98,58.22 13.75,17.15 14.46,29.09 31.73,80.48 17.27,51.39 75.81,116.81 99.34,134.89 23.54,18.07 156.66,134.7 170.02,147.02 13.35,12.33 14.86,23.88 23.38,37.65 8.52,13.76 27.98,29.33 34.79,33.52 6.8,4.19 18.36,14.71 22.17,18.09 3.81,3.39 33.49,26.44 38.55,28.88 5.07,2.43 12.31,2.98 15.1,0.2 2.79,-2.79 2.19,-6.36 2.19,-6.36 0,0 15.62,11.73 21.1,15.66 5.57,3.99 12.22,2 14.87,-0.88 1.88,-2.04 2.59,-6.25 2.59,-6.25 2.24,1.84 10.92,9.36 17.78,3.38 6.86,-5.98 -3.26,-18.34 -3.26,-18.34 3.37,1.44 7.09,0.65 9.9,-1.73 z" fill="#4f5c70" />
                  </G>
                  <G id="g154">
                    <G id="g135">
                      <G id="g132">
                        <G id="g108">
                          <G id="g94">
                            <G id="g88">
                              <Path id="path87" d="m 2235.48,1727.58 c 0,0 -18.29,-6.06 -38.31,17.28 -16.34,19.04 -33.25,41.8 -33.76,46.55 -0.76,7.15 3.1,19.63 23.16,26.26 20.06,6.62 33.64,21.92 59.3,0.69 25.66,-21.24 31.42,-38.75 31.53,-52.05 0.1,-13.3 -22.97,-34.11 -41.92,-38.73 z" fill="#9299a5" />
                            </G>
                            <G id="g89">
                              <Path id="path88" d="m 2214.32,1720.87 c 0,0 -22.81,8.97 -29.75,13.02 -10.22,5.96 -59.09,14.65 -66.17,7.41 -2.16,-2.2 -2.25,-4.18 -1.69,-5.38 1.13,-2.44 6.52,-3.08 10.13,-3.02 5.36,0.1 32.08,-1.7 43.68,-5.92 14.05,-5.09 33.2,-9.18 43.8,-6.11 z" fill="#9299a5" />
                            </G>
                            <G id="g90">
                              <Path id="path89" d="m 2146.93,1803.61 c 0,0 -21.31,24.92 -26.96,33.99 -5.65,9.08 -16.98,24.65 -12.7,29.4 3.3,3.66 14.55,-11.72 23.37,-22.33 5.35,-6.44 19.91,-23.16 22.5,-27.33 2.9,-4.67 4.35,-8.54 -6.21,-13.73 z" fill="#9299a5" />
                            </G>
                            <G id="g91">
                              <Path id="path90" d="m 2163.32,1818.39 c 0,0 -23.59,27.67 -31.24,36.5 -7.65,8.83 -19.13,24.49 -20.26,26.37 -1.13,1.87 -2.21,4.86 0.12,6.87 2.12,1.83 6.23,0.28 11.74,-4.57 5.52,-4.86 43.97,-47.73 46.67,-50.94 0,0 5.59,-5.86 2.17,-7.65 -3.82,-2.01 -5.9,-3.27 -9.2,-6.58 z" fill="#9299a5" />
                            </G>
                            <G id="g92">
                              <Path id="path91" d="m 2183.18,1829.18 c 0,0 -28.65,32.47 -32.43,36.06 -3.78,3.6 -12.84,12.94 -14.36,14.98 -1.51,2.03 -5.22,7.24 -1.64,10.26 3.58,3.02 9.36,-1.09 15.87,-6.78 6.99,-6.11 29.05,-27.79 34.55,-33.28 0,0 10.85,-10.55 12.68,-13.84 1.82,-3.3 -5.12,0.33 -14.67,-7.4 z" fill="#9299a5" />
                            </G>
                            <G id="g93">
                              <Path id="path92" d="m 2207.45,1839.8 c 0,0 -16.72,17.18 -22.8,22.87 -6.09,5.69 -15.82,14.3 -11.99,18.32 4.89,5.11 21.37,-10.46 27.35,-15.39 5.99,-4.94 19.46,-17.82 22.71,-22.13 3.26,-4.31 -1.44,1.74 -15.27,-3.67 z" fill="#9299a5" />
                            </G>
                          </G>
                          <G id="g95">
                            <Path id="path94" d="m 2556.39,1187.18 c 0,0 -5.79,-78.33 22.14,-110.34 27.93,-32.02 52.28,-32.36 97.23,-41.89 0,0 24.35,109.32 -119.37,152.23 z" fillOpacity={1} fill={getMuscleColor('left_rear_delt_upper', '#9299a5')} onPress={interactive ? () => handlePress('left_rear_delt_upper') : undefined} opacity={isSelected('left_rear_delt_upper') ? 1 : 0.85} />
                          </G>
                          <G id="g96">
                            <Path id="path95" d="m 2686.39,1029.71 c 0,0 42.33,-32.52 100.23,-48.19 0,0 63.37,-11.06 63.55,-101.82 0,0 -0.1,-8.43 5.09,-8.39 5.64,0.04 4.54,4.31 4.93,9.91 0.36,5.14 -3.92,417.04 -3.92,417.04 -27.08,-24.36 -52.79,-118.7 -58.41,-142.71 0,0 -29.33,-98.94 -111.47,-125.84 z" fill={getMuscleColor('left_neck_trap', '#9299a5')} onPress={interactive ? () => handlePress('left_neck_trap') : undefined} opacity={isSelected('left_neck_trap') ? 1 : 0.85} />
                          </G>
                          <G id="g97">
                            <Path id="path96" d="m 2807.63,1252.89 c 8.5,22.17 23.07,50.28 46.42,68.52 v 25.89 c 0,92.63 -108.98,238.91 -108.98,238.91 0,0 15.67,-105.41 -53.81,-171.48 -33.95,-32.28 -46.97,-86.07 -46.97,-86.07 -25.25,-67.76 -24.98,-152.16 -24.98,-152.16 0,0 80.12,26.56 136.11,29.9 37.62,2.23 52.21,46.49 52.21,46.49 q -0.3,-0.77 -0.59,-1.54 z" fill={getMuscleColor('left_mid_trap', '#9299a5')} onPress={interactive ? () => handlePress('left_mid_trap') : undefined} opacity={isSelected('left_mid_trap') ? 1 : 0.85} />
                          </G>
                          <G id="g98">
                            <Path id="path97" d="m 2695.38,1048.94 c 81.23,54.67 91.41,141.86 91.41,141.86 -96.04,0.37 -150.02,-26.99 -150.02,-26.99 0,0 62.46,-34.91 58.63,-114.61 z" fill={getMuscleColor('left_upper_trap', '#9299a5')} onPress={interactive ? () => handlePress('left_upper_trap') : undefined} opacity={isSelected('left_upper_trap') ? 1 : 0.85} />
                          </G>
                          <G id="g99">
                            <Path id="path98" d="m 2855.67,1418.39 c 0,0 -10.3,76.21 -100.04,178.55 0,0 39.16,97.46 98.42,152.43 0,0 5.24,-299.16 1.62,-330.98 z" fill={getMuscleColor('left_lats', '#9299a5')} onPress={interactive ? () => handlePress('left_lats') : undefined} opacity={isSelected('left_lats') ? 1 : 0.85} />
                          </G>
                          <G id="g100">
                            <Path id="path99" d="m 2719.19,1627.25 c -6.63,8.56 -14.86,18.43 -20.3,26.75 0,0 13.27,-47.5 -6.27,-216.45 0,0 27.42,32.6 39.42,104.88 0,0 4.36,62.59 -12.85,84.82 z" fill={getMuscleColor('left_rhomboids', '#9299a5')} onPress={interactive ? () => handlePress('left_rhomboids') : undefined} opacity={isSelected('left_rhomboids') ? 1 : 0.85} />
                          </G>
                          <G id="g101">
                            <Path id="path100" d="m 2605.77,1176.5 c 0,0 -60.28,40.36 -54.15,104.73 6.13,64.37 24.95,94.03 4.27,128.73 0,0 53.39,-9.15 63.42,-58.94 10.04,-49.78 -12,-92.27 -13.54,-174.52 z" fill={getMuscleColor('left_infraspinatus', '#9299a5')} onPress={interactive ? () => handlePress('left_infraspinatus') : undefined} opacity={isSelected('left_infraspinatus') ? 1 : 0.85} />
                          </G>
                          <G id="g102">
                            <Path id="path101" d="m 2547.54,1215.15 c 0,0 -55.61,61.61 -59.06,166.21 0,0 42.71,-76.97 59.06,-166.21 z" fillOpacity={1} fill={getMuscleColor('left_teres_major', '#9299a5')} onPress={interactive ? () => handlePress('left_teres_major') : undefined} opacity={isSelected('left_teres_major') ? 1 : 0.85} />
                          </G>
                          <G id="g103">
                            <Path id="path102" d="m 2541.41,1293.23 c 0,0 12.09,75.52 4.42,100.05 -7.66,24.52 -24.86,35.15 -37.12,34.09 -12.26,-1.06 -11.75,-31.71 5.11,-63.38 16.86,-31.68 24.86,-50.75 27.59,-70.76 z" fill={getMuscleColor('left_rear_delt', '#9299a5')} onPress={interactive ? () => handlePress('left_rear_delt') : undefined} opacity={isSelected('left_rear_delt') ? 1 : 0.85} />
                          </G>
                          <G id="g104">
                            <Path id="path103" d="m 2484.87,1409.96 c 0,0 -50.06,40.19 -68.63,74.08 -16.16,29.51 -46.83,107.79 -78.84,148.49 -7.96,10.13 -33.55,41.04 -33.55,41.04 0,0 69.8,-60.88 100.98,-101.49 31.51,-41.03 57.9,-58.92 80.04,-162.12 z" fill={getMuscleColor('left_triceps', '#9299a5')} onPress={interactive ? () => handlePress('left_triceps') : undefined} opacity={isSelected('left_triceps') ? 1 : 0.85} />
                          </G>
                          <G id="g105">
                            <Path id="path104" d="m 2561.09,1429.08 c 2.33,-9.21 -64.37,12.77 -73.56,36.78 -9.2,24.01 -31.27,77.61 -88.66,130.57 0,0 35.77,-19.67 52.62,-26.56 16.86,-6.9 84.3,-40.49 109.6,-140.79 z" fill={getMuscleColor('left_brachioradialis', '#9299a5')} onPress={interactive ? () => handlePress('left_brachioradialis') : undefined} opacity={isSelected('left_brachioradialis') ? 1 : 0.85} />
                          </G>
                          <G id="g106">
                            <Path id="path105" d="m 2555.89,1470.25 c 0,0 -25.72,77.14 -110.02,119.54 -79.62,40.05 -172.67,137.08 -172.67,137.08 0,0 104.28,-75.81 161.44,-104.39 60.28,-30.14 108.54,-84.8 121.25,-152.23 z" fill={getMuscleColor('left_forearm_extensors', '#9299a5')} onPress={interactive ? () => handlePress('left_forearm_extensors') : undefined} opacity={isSelected('left_forearm_extensors') ? 1 : 0.85} />
                          </G>
                          <G id="g107">
                            <Path id="path106" d="m 2408.58,1654.16 c 0,0 -80.2,52.18 -103.7,69.22 -23.51,17.04 -13.19,20.43 -6.2,20.66 6.99,0.24 19.73,-9.59 35.83,-24.23 18.57,-16.89 74.07,-65.65 74.07,-65.65 z" fill={getMuscleColor('left_forearm_outer_back', '#9299a5')} onPress={interactive ? () => handlePress('left_forearm_outer_back') : undefined} opacity={isSelected('left_forearm_outer_back') ? 1 : 0.85} />
                          </G>
                        </G>
                        <G id="g129" fill="#9299a5" fillOpacity={1}>
                          <G id="g115" fill="#9299a5" fillOpacity={1}>
                            <G id="g109" fill="#9299a5" fillOpacity={1}>
                              <Path id="path108" d="m 3501.66,1727.58 c 0,0 18.28,-6.06 38.3,17.28 16.34,19.04 33.25,41.8 33.76,46.55 0.76,7.15 -3.1,19.63 -23.16,26.26 -20.06,6.62 -33.63,21.92 -59.3,0.69 -25.66,-21.24 -31.42,-38.75 -31.52,-52.05 -0.1,-13.3 22.96,-34.11 41.92,-38.73 z" fillOpacity={1} fill="#9299a5" />
                            </G>
                            <G id="g110" fill="#9299a5" fillOpacity={1}>
                              <Path id="path109" d="m 3522.81,1720.87 c 0,0 22.81,8.97 29.76,13.02 10.21,5.96 59.09,14.65 66.16,7.41 2.16,-2.2 2.25,-4.18 1.7,-5.38 -1.14,-2.44 -6.53,-3.08 -10.14,-3.02 -5.36,0.1 -32.07,-1.7 -43.68,-5.92 -14.04,-5.09 -33.2,-9.18 -43.8,-6.11 z" fillOpacity={1} fill="#9299a5" />
                            </G>
                            <G id="g111" fill="#9299a5" fillOpacity={1}>
                              <Path id="path110" d="m 3590.2,1803.61 c 0,0 21.31,24.92 26.96,33.99 5.65,9.08 16.98,24.65 12.7,29.4 -3.29,3.66 -14.55,-11.72 -23.37,-22.33 -5.34,-6.44 -19.91,-23.16 -22.5,-27.33 -2.9,-4.67 -4.35,-8.54 6.21,-13.73 z" fillOpacity={1} fill="#9299a5" />
                            </G>
                            <G id="g112" fill="#9299a5" fillOpacity={1}>
                              <Path id="path111" d="m 3573.81,1818.39 c 0,0 23.59,27.67 31.24,36.5 7.66,8.83 19.14,24.49 20.26,26.37 1.13,1.87 2.21,4.86 -0.12,6.87 -2.12,1.83 -6.22,0.28 -11.74,-4.57 -5.51,-4.86 -43.96,-47.73 -46.66,-50.94 0,0 -5.6,-5.86 -2.18,-7.65 3.82,-2.01 5.9,-3.27 9.2,-6.58 z" fillOpacity={1} fill="#9299a5" />
                            </G>
                            <G id="g113" fill="#9299a5" fillOpacity={1}>
                              <Path id="path112" d="m 3553.95,1829.18 c 0,0 28.65,32.47 32.43,36.06 3.79,3.6 12.84,12.94 14.36,14.98 1.52,2.03 5.23,7.24 1.64,10.26 -3.58,3.02 -9.36,-1.09 -15.87,-6.78 -6.99,-6.11 -29.05,-27.79 -34.55,-33.28 0,0 -10.85,-10.55 -12.67,-13.84 -1.83,-3.3 5.11,0.33 14.66,-7.4 z" fillOpacity={1} fill="#9299a5" />
                            </G>
                            <G id="g114" fill="#9299a5" fillOpacity={1}>
                              <Path id="path113" d="m 3529.68,1839.8 c 0,0 16.72,17.18 22.81,22.87 6.08,5.69 15.82,14.3 11.98,18.32 -4.89,5.11 -21.36,-10.46 -27.35,-15.39 -5.98,-4.94 -19.45,-17.82 -22.71,-22.13 -3.25,-4.31 1.44,1.74 15.27,-3.67 z" fillOpacity={1} fill="#9299a5" />
                            </G>
                          </G>
                          <G id="g116" fill="#9299a5" fillOpacity={1}>
                            <Path id="path115" d="m 3180.74,1185.18 c 0,0 5.79,-78.33 -22.14,-110.34 -27.92,-32.02 -52.27,-32.36 -97.23,-41.89 0,0 -24.35,109.32 119.37,152.23 z" fillOpacity={1} fill={getMuscleColor('right_rear_delt_upper', '#9299a5')} onPress={interactive ? () => handlePress('right_rear_delt_upper') : undefined} opacity={isSelected('right_rear_delt_upper') ? 1 : 0.85} />
                          </G>
                          <G id="g117" fill="#9299a5" fillOpacity={1}>
                            <Path id="path116" d="m 3050.74,1029.71 c 0,0 -42.33,-32.52 -100.23,-48.19 0,0 -63.37,-11.06 -63.54,-101.82 0,0 0.09,-8.43 -5.1,-8.39 -5.64,0.04 -4.53,4.31 -4.93,9.91 -0.36,5.14 2.49,417.89 2.49,417.89 27.07,-24.35 54.22,-119.55 59.84,-143.56 0,0 29.33,-98.94 111.47,-125.84 z" fillOpacity={1} fill={getMuscleColor('right_neck_trap', '#9299a5')} onPress={interactive ? () => handlePress('right_neck_trap') : undefined} opacity={isSelected('right_neck_trap') ? 1 : 0.85} />
                          </G>
                          <G id="g118" fill="#9299a5" fillOpacity={1}>
                            <Path id="path117" d="m 2929.51,1252.89 c -8.51,22.17 -23.08,50.28 -46.43,68.52 v 25.89 c 0,92.63 108.98,238.91 108.98,238.91 0,0 -15.66,-105.41 53.81,-171.48 33.95,-32.28 46.97,-86.07 46.97,-86.07 25.25,-67.76 24.98,-152.16 24.98,-152.16 0,0 -80.12,26.56 -136.11,29.9 -37.61,2.23 -52.2,46.49 -52.2,46.49 q 0.29,-0.77 0.58,-1.54 z" fillOpacity={1} fill={getMuscleColor('right_mid_trap', '#9299a5')} onPress={interactive ? () => handlePress('right_mid_trap') : undefined} opacity={isSelected('right_mid_trap') ? 1 : 0.85} />
                          </G>
                          <G id="g119" fill="#9299a5" fillOpacity={1}>
                            <Path id="path118" d="m 3041.75,1048.94 c -81.22,54.67 -91.41,141.86 -91.41,141.86 96.04,0.37 150.02,-26.99 150.02,-26.99 0,0 -62.46,-34.91 -58.63,-114.61 z" fillOpacity={1} fill={getMuscleColor('right_upper_trap', '#9299a5')} onPress={interactive ? () => handlePress('right_upper_trap') : undefined} opacity={isSelected('right_upper_trap') ? 1 : 0.85} />
                          </G>
                          <G id="g120" fill="#9299a5" fillOpacity={1}>
                            <Path id="path119" d="m 2881.47,1418.39 c 0,0 10.29,76.21 100.03,178.55 0,0 -39.16,97.46 -98.42,152.43 0,0 -5.24,-299.16 -1.61,-330.98 z" fillOpacity={1} fill={getMuscleColor('right_lats', '#9299a5')} onPress={interactive ? () => handlePress('right_lats') : undefined} opacity={isSelected('right_lats') ? 1 : 0.85} />
                          </G>
                          <G id="g121" fill="#9299a5" fillOpacity={1}>
                            <Path id="path120" d="m 3014.68,1600.51 c 6.63,8.56 14.85,18.42 20.29,26.74 0,0 -10,-20.75 9.54,-189.7 0,0 -27.41,32.6 -39.42,104.88 0,0 -7.62,35.85 9.59,58.08 z" fillOpacity={1} fill={getMuscleColor('right_rhomboids', '#9299a5')} onPress={interactive ? () => handlePress('right_rhomboids') : undefined} opacity={isSelected('right_rhomboids') ? 1 : 0.85} />
                          </G>
                          <G id="g122" fill="#9299a5" fillOpacity={1}>
                            <Path id="path121" d="m 3131.36,1176.5 c 0,0 60.28,40.36 54.15,104.73 -6.13,64.37 -24.95,94.03 -4.27,128.73 0,0 -53.38,-9.15 -63.42,-58.94 -10.04,-49.78 12,-92.27 13.54,-174.52 z" fillOpacity={1} fill={getMuscleColor('right_infraspinatus', '#9299a5')} onPress={interactive ? () => handlePress('right_infraspinatus') : undefined} opacity={isSelected('right_infraspinatus') ? 1 : 0.85} />
                          </G>
                          <G id="g123" fill="#9299a5" fillOpacity={1}>
                            <Path id="path122" d="m 3189.6,1215.15 c 0,0 55.6,61.61 59.05,166.21 0,0 -42.71,-76.97 -59.05,-166.21 z" fillOpacity={1} fill={getMuscleColor('right_teres_major', '#9299a5')} onPress={interactive ? () => handlePress('right_teres_major') : undefined} opacity={isSelected('right_teres_major') ? 1 : 0.85} />
                          </G>
                          <G id="g124" fill="#9299a5" fillOpacity={1}>
                            <Path id="path123" d="m 3195.73,1293.23 c 0,0 -12.09,75.52 -4.43,100.05 7.66,24.52 24.86,35.15 37.12,34.09 12.26,-1.06 11.75,-31.71 -5.11,-63.38 -16.86,-31.68 -24.86,-50.75 -27.58,-70.76 z" fillOpacity={1} fill={getMuscleColor('right_rear_delt', '#9299a5')} onPress={interactive ? () => handlePress('right_rear_delt') : undefined} opacity={isSelected('right_rear_delt') ? 1 : 0.85} />
                          </G>
                          <G id="g125" fill="#9299a5" fillOpacity={1}>
                            <Path id="path124" d="m 3252.26,1409.96 c 0,0 50.07,40.19 68.63,74.08 16.16,29.51 46.83,107.79 78.84,148.49 7.97,10.13 33.55,41.04 33.55,41.04 0,0 -69.79,-60.88 -100.98,-101.49 -31.51,-41.03 -57.9,-58.92 -80.04,-162.12 z" fillOpacity={1} fill={getMuscleColor('right_triceps', '#9299a5')} onPress={interactive ? () => handlePress('right_triceps') : undefined} opacity={isSelected('right_triceps') ? 1 : 0.85} />
                          </G>
                          <G id="g126" fill="#9299a5" fillOpacity={1}>
                            <Path id="path125" d="m 3176.04,1429.08 c -2.32,-9.21 64.37,12.77 73.56,36.78 9.2,24.01 31.27,77.61 88.66,130.57 0,0 -35.76,-19.67 -52.62,-26.56 -16.86,-6.9 -84.29,-40.49 -109.6,-140.79 z" fillOpacity={1} fill={getMuscleColor('right_brachioradialis', '#9299a5')} onPress={interactive ? () => handlePress('right_brachioradialis') : undefined} opacity={isSelected('right_brachioradialis') ? 1 : 0.85} />
                          </G>
                          <G id="g127" fill="#9299a5" fillOpacity={1}>
                            <Path id="path126" d="m 3181.24,1470.25 c 0,0 25.73,77.14 110.02,119.54 79.62,40.05 172.67,137.08 172.67,137.08 0,0 -104.28,-75.81 -161.43,-104.39 -60.28,-30.14 -108.55,-84.8 -121.26,-152.23 z" fillOpacity={1} fill={getMuscleColor('right_forearm_extensors', '#9299a5')} onPress={interactive ? () => handlePress('right_forearm_extensors') : undefined} opacity={isSelected('right_forearm_extensors') ? 1 : 0.85} />
                          </G>
                          <G id="g128" fill="#9299a5" fillOpacity={1}>
                            <Path id="path127" d="m 3328.55,1654.16 c 0,0 80.21,52.18 103.71,69.22 23.5,17.04 13.18,20.43 6.19,20.66 -6.98,0.24 -19.73,-9.59 -35.82,-24.23 -18.57,-16.89 -74.08,-65.65 -74.08,-65.65 z" fillOpacity={1} fill={getMuscleColor('right_forearm_outer_back', '#9299a5')} onPress={interactive ? () => handlePress('right_forearm_outer_back') : undefined} opacity={isSelected('right_forearm_outer_back') ? 1 : 0.85} />
                          </G>
                        </G>
                        <G id="g130">
                          <Path id="path129" d="m 2933.58,954.19 c 0,0 -35.25,-14.94 -35.25,-81.18 0,0 31.16,15.11 33.55,35.88 2.38,20.78 0.04,30.35 1.7,45.3 z" fill="#9299a5" />
                        </G>
                        <G id="g131">
                          <Path id="path130" d="m 2803.82,954.19 c 0,0 35.25,-14.94 35.25,-81.18 0,0 -31.17,15.11 -33.55,35.88 -2.39,20.78 -0.04,30.35 -1.7,45.3 z" fill="#9299a5" />
                        </G>
                      </G>
                      <G id="g133">
                        <Path id="path132" d="m 2684.45,1957.61 c 0,0 26.41,-32.73 92.11,-35.25 75.46,-2.89 95.53,-86.85 69.66,-141.2 -21.11,-44.36 -49.75,-43.56 -102.49,-153.91 0,0 -99.09,97.41 -59.28,330.36 z" fill="#9299a5" />
                      </G>
                      <G id="g134">
                        <Path id="path133" d="m 3060.07,1950.46 c 0,0 -33.8,-25.58 -99.5,-28.1 -75.46,-2.89 -95.53,-86.85 -69.66,-141.2 21.11,-44.36 49.76,-43.56 102.5,-153.91 0,0 106.47,90.25 66.66,323.21 z" fill="#9299a5" />
                      </G>
                    </G>
                    <G id="g144">
                      <G id="g136">
                        <Path id="path135" d="m 2825.34,2251.45 c 7.5,-29.29 0,-151.21 0.68,-183.23 0.68,-32.01 16.35,-156.66 16.35,-156.66 0,0 -34.92,32.29 -81.92,30.93 0,0 60.8,113.14 64.88,308.63 z" fill={getMuscleColor('left_glute_max', '#9299a5')} onPress={interactive ? () => handlePress('left_glute_max') : undefined} opacity={isSelected('left_glute_max') ? 1 : 0.85} />
                      </G>
                      <G id="g137">
                        <Path id="path136" d="m 2744.73,1943.31 c 0,0 102.51,258.83 46.66,446.83 0,0 -40.77,-55.86 -43.59,-119.88 -11.58,-262.24 -7.11,-262.07 -3.07,-326.95 z" fill={getMuscleColor('left_adductor', '#9299a5')} onPress={interactive ? () => handlePress('left_adductor') : undefined} opacity={isSelected('left_adductor') ? 1 : 0.85} />
                      </G>
                      <G id="g138">
                        <Path id="path137" d="m 2730.76,1946.03 c 0,0 -8.17,109.51 -7.49,135.47 0.68,25.96 6.39,194.21 -25.62,255.51 0,0 -91.53,-334.44 33.11,-390.98 z" fill={getMuscleColor('left_inner_hamstring', '#9299a5')} onPress={interactive ? () => handlePress('left_inner_hamstring') : undefined} opacity={isSelected('left_inner_hamstring') ? 1 : 0.85} />
                      </G>
                      <G id="g139">
                        <Path id="path138" d="m 2660.61,1886.09 c 0,0 13.31,61.98 3.93,95.36 -9.38,33.38 -18.24,150.54 -12.11,185.28 0,0 -24.52,-138.96 8.18,-280.64 z" fill={getMuscleColor('left_outer_hamstring', '#9299a5')} onPress={interactive ? () => handlePress('left_outer_hamstring') : undefined} opacity={isSelected('left_outer_hamstring') ? 1 : 0.85} />
                      </G>
                      <G id="g140">
                        <Path id="path139" d="m 2803.14,2483.52 c 6.8,27.87 12.17,54.4 11.41,76.23 -3.02,85.96 -14.5,120.99 -34.06,122.61 -19.56,1.62 -31.5,-13.27 -29.06,-104.87 0.71,-26.38 0.24,-52.34 -0.9,-77.62 0,0 -3.5,-90.4 2.71,-152.81 0,0 21.76,46.23 34.02,59.51 0,0 10.61,55.36 15.88,76.95 z" fill={getMuscleColor('left_soleus', '#9299a5')} onPress={interactive ? () => handlePress('left_soleus') : undefined} opacity={isSelected('left_soleus') ? 1 : 0.85} />
                      </G>
                      <G id="g141">
                        <Path id="path140" d="m 2735.53,2619.01 c -1.15,49.56 -27.15,20.95 -37.88,8.17 -10.73,-12.77 -25.46,-61.64 -21.38,-120.9 1.62,-23.46 9.11,-52.42 17.57,-78.84 0,0 13.59,-32.19 8.82,-73.4 0,0 16.7,-18.39 19.28,-52.86 0,0 18.45,108.72 13.59,317.83 z" fill={getMuscleColor('left_lateral_calf', '#9299a5')} onPress={interactive ? () => handlePress('left_lateral_calf') : undefined} opacity={isSelected('left_lateral_calf') ? 1 : 0.85} />
                      </G>
                      <G id="g142">
                        <Path id="path141" d="m 2796.33,2682.47 c 0,0 -7.67,7.72 -16.86,12.32 -9.2,4.6 -25.16,13.77 -25.67,195.64 0,0 11.88,-147.11 42.53,-207.96 z" fill={getMuscleColor('left_medial_calf', '#9299a5')} onPress={interactive ? () => handlePress('left_medial_calf') : undefined} opacity={isSelected('left_medial_calf') ? 1 : 0.85} />
                      </G>
                      <G id="g143">
                        <Path id="path142" d="m 2727.87,2957.37 c -7.66,-194.13 -36.27,-320.31 -36.27,-320.31 0,0 14.81,14.82 18.14,25.54 3.32,10.73 26.61,61.31 20.69,289.15 z" fill={getMuscleColor('left_achilles_tendon', '#9299a5')} onPress={interactive ? () => handlePress('left_achilles_tendon') : undefined} opacity={isSelected('left_achilles_tendon') ? 1 : 0.85} />
                      </G>
                    </G>
                    <G id="g153">
                      <G id="g145">
                        <Path id="path144" d="m 2914.02,2251.45 c -7.49,-29.29 0,-151.21 -0.68,-183.23 -0.68,-32.01 -16.35,-156.66 -16.35,-156.66 0,0 34.93,32.29 81.93,30.93 0,0 -60.8,113.14 -64.89,308.63 z" fill={getMuscleColor('right_glute_max', '#9299a5')} onPress={interactive ? () => handlePress('right_glute_max') : undefined} opacity={isSelected('right_glute_max') ? 1 : 0.85} />
                      </G>
                      <G id="g146">
                        <Path id="path145" d="m 2994.64,1943.31 c 0,0 -102.52,258.83 -46.66,446.83 0,0 40.76,-55.86 43.59,-119.88 11.58,-262.24 7.11,-262.07 3.07,-326.95 z" fill={getMuscleColor('right_adductor', '#9299a5')} onPress={interactive ? () => handlePress('right_adductor') : undefined} opacity={isSelected('right_adductor') ? 1 : 0.85} />
                      </G>
                      <G id="g147">
                        <Path id="path146" d="m 3008.6,1946.03 c 0,0 8.18,109.51 7.5,135.47 -0.68,25.96 -6.4,194.21 25.62,255.51 0,0 91.53,-334.44 -33.12,-390.98 z" fill={getMuscleColor('right_inner_hamstring', '#9299a5')} onPress={interactive ? () => handlePress('right_inner_hamstring') : undefined} opacity={isSelected('right_inner_hamstring') ? 1 : 0.85} />
                      </G>
                      <G id="g148">
                        <Path id="path147" d="m 3078.76,1886.09 c 0,0 -13.31,61.98 -3.93,95.36 9.38,33.38 18.23,150.54 12.1,185.28 0,0 24.52,-138.96 -8.17,-280.64 z" fill={getMuscleColor('right_outer_hamstring', '#9299a5')} onPress={interactive ? () => handlePress('right_outer_hamstring') : undefined} opacity={isSelected('right_outer_hamstring') ? 1 : 0.85} />
                      </G>
                      <G id="g149">
                        <Path id="path148" d="m 2936.23,2483.52 c -6.8,27.87 -12.18,54.4 -11.41,76.23 3.01,85.96 14.5,120.99 34.06,122.61 19.56,1.62 31.49,-13.27 29.05,-104.87 -0.7,-26.38 -0.24,-52.34 0.91,-77.62 0,0 3.5,-90.4 -2.72,-152.81 0,0 -21.75,46.23 -34.02,59.51 0,0 -10.61,55.36 -15.87,76.95 z" fill={getMuscleColor('right_soleus', '#9299a5')} onPress={interactive ? () => handlePress('right_soleus') : undefined} opacity={isSelected('right_soleus') ? 1 : 0.85} />
                      </G>
                      <G id="g150">
                        <Path id="path149" d="m 3003.83,2619.01 c 1.15,49.56 27.16,20.95 37.89,8.17 10.72,-12.77 25.46,-61.64 21.37,-120.9 -1.62,-23.46 -9.1,-52.42 -17.56,-78.84 0,0 -13.59,-32.19 -8.82,-73.4 0,0 -16.7,-18.39 -19.28,-52.86 0,0 -18.46,108.72 -13.6,317.83 z" fill={getMuscleColor('right_lateral_calf', '#9299a5')} onPress={interactive ? () => handlePress('right_lateral_calf') : undefined} opacity={isSelected('right_lateral_calf') ? 1 : 0.85} />
                      </G>
                      <G id="g151">
                        <Path id="path150" d="m 2943.04,2682.47 c 0,0 7.66,7.72 16.86,12.32 9.19,4.6 25.16,13.77 25.67,195.64 0,0 -11.88,-147.11 -42.53,-207.96 z" fill={getMuscleColor('right_medial_calf', '#9299a5')} onPress={interactive ? () => handlePress('right_medial_calf') : undefined} opacity={isSelected('right_medial_calf') ? 1 : 0.85} />
                      </G>
                      <G id="g152">
                        <Path id="path151" d="m 3011.49,2957.37 c 7.67,-194.13 36.28,-320.31 36.28,-320.31 0,0 -14.82,14.82 -18.14,25.54 -3.32,10.73 -26.61,61.31 -20.69,289.15 z" fill={getMuscleColor('right_achilles_tendon', '#9299a5')} onPress={interactive ? () => handlePress('right_achilles_tendon') : undefined} opacity={isSelected('right_achilles_tendon') ? 1 : 0.85} />
                      </G>
                    </G>
                  </G>
                </G>
              </G>
            </G>
          </G>
        </G>
      </Svg>
    </View>
  );
}

TrainingBodyEngine.MUSCLE_GROUPS = MUSCLE_GROUPS;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
