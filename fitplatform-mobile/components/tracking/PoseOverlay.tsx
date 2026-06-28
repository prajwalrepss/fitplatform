import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../../constants/theme';

interface PoseOverlayProps {
  width?: number;
  height?: number;
  color?: string;
}

// Static stick figure pose data (normalized 0-1 coordinates)
const joints = [
  { id: 'head', x: 0.5, y: 0.08 },
  { id: 'neck', x: 0.5, y: 0.18 },
  { id: 'lShoulder', x: 0.38, y: 0.22 },
  { id: 'rShoulder', x: 0.62, y: 0.22 },
  { id: 'lElbow', x: 0.28, y: 0.36 },
  { id: 'rElbow', x: 0.72, y: 0.36 },
  { id: 'lWrist', x: 0.22, y: 0.50 },
  { id: 'rWrist', x: 0.78, y: 0.50 },
  { id: 'lHip', x: 0.42, y: 0.52 },
  { id: 'rHip', x: 0.58, y: 0.52 },
  { id: 'lKnee', x: 0.38, y: 0.72 },
  { id: 'rKnee', x: 0.62, y: 0.72 },
  { id: 'lAnkle', x: 0.36, y: 0.92 },
  { id: 'rAnkle', x: 0.64, y: 0.92 },
];

const bones: [string, string][] = [
  ['head', 'neck'],
  ['neck', 'lShoulder'],
  ['neck', 'rShoulder'],
  ['lShoulder', 'lElbow'],
  ['rShoulder', 'rElbow'],
  ['lElbow', 'lWrist'],
  ['rElbow', 'rWrist'],
  ['lShoulder', 'lHip'],
  ['rShoulder', 'rHip'],
  ['lHip', 'rHip'],
  ['lHip', 'lKnee'],
  ['rHip', 'rKnee'],
  ['lKnee', 'lAnkle'],
  ['rKnee', 'rAnkle'],
];

export default function PoseOverlay({ width = 200, height = 300, color = colors.primary }: PoseOverlayProps) {
  const jointMap = Object.fromEntries(joints.map(j => [j.id, j]));

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Bones */}
        {bones.map(([from, to], i) => {
          const a = jointMap[from];
          const b = jointMap[to];
          return (
            <Line
              key={`bone-${i}`}
              x1={a.x * width}
              y1={a.y * height}
              x2={b.x * width}
              y2={b.y * height}
              stroke={color}
              strokeWidth={2}
              strokeOpacity={0.6}
            />
          );
        })}
        {/* Joints */}
        {joints.map((j) => (
          <Circle
            key={j.id}
            cx={j.x * width}
            cy={j.y * height}
            r={6}
            fill={color}
            opacity={0.9}
          />
        ))}
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
