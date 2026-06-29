import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Colors } from '../../theme';

const LANDMARK_BONES = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
];

const LANDMARK_JOINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

export default function PoseOverlay({
  width = 220,
  height = 340,
  color = Colors.primary,
  landmarks,
}) {
  if (!landmarks || landmarks.length === 0) {
    return <View style={[styles.container, { width, height }]} />;
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {LANDMARK_BONES.map(([from, to], index) => {
          const a = landmarks[from];
          const b = landmarks[to];
          if (!a || !b) return null;
          return (
            <Line
              key={`bone-${index}`}
              x1={a.x * width}
              y1={a.y * height}
              x2={b.x * width}
              y2={b.y * height}
              stroke={color}
              strokeWidth={3}
              strokeOpacity={0.64}
              strokeLinecap="round"
            />
          );
        })}

        {LANDMARK_JOINTS.map((idx) => {
          const joint = landmarks[idx];
          if (!joint) return null;
          return (
            <Circle
              key={`joint-${idx}`}
              cx={joint.x * width}
              cy={joint.y * height}
              r={5}
              fill={color}
              opacity={0.9}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
