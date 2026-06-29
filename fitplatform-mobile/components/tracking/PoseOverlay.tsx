import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../../constants/theme';

interface Point2D {
  x: number;
  y: number;
  visibility?: number;
}

interface PoseOverlayProps {
  width?: number;
  height?: number;
  color?: string;
  landmarks?: Point2D[];
}

// Static fallback stick figure pose data (normalized 0-1 coordinates)
const staticJoints = [
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

const staticBones: [string, string][] = [
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

const LANDMARK_BONES: [number, number][] = [
  [11, 12], // shoulders
  [11, 13], [13, 15], // left arm
  [12, 14], [14, 16], // right arm
  [11, 23], [12, 24], // torso sides
  [23, 24], // hips
  [23, 25], [25, 27], // left leg
  [24, 26], [26, 28], // right leg
];

const LANDMARK_JOINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

export default function PoseOverlay({
  width = 200,
  height = 300,
  color = colors.primary,
  landmarks,
}: PoseOverlayProps) {
  if (landmarks && landmarks.length > 0) {
    // Draw using real-time dynamic landmarks
    return (
      <View style={[styles.container, { width, height }]}>
        <Svg width={width} height={height}>
          {/* Bones */}
          {LANDMARK_BONES.map(([from, to], i) => {
            const a = landmarks[from];
            const b = landmarks[to];
            if (!a || !b) return null;
            return (
              <Line
                key={`bone-${i}`}
                x1={a.x * width}
                y1={a.y * height}
                x2={b.x * width}
                y2={b.y * height}
                stroke={color}
                strokeWidth={3}
                strokeOpacity={0.6}
                strokeLinecap="round"
              />
            );
          })}
          {/* Joints */}
          {LANDMARK_JOINTS.map((idx) => {
            const j = landmarks[idx];
            if (!j) return null;
            return (
              <Circle
                key={`joint-${idx}`}
                cx={j.x * width}
                cy={j.y * height}
                r={6}
                fill={color}
                opacity={0.9}
              />
            );
          })}
        </Svg>
      </View>
    );
  }

  // Fallback to static joints (e.g. for exercise details screen)
  const jointMap = Object.fromEntries(staticJoints.map(j => [j.id, j]));

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {staticBones.map(([from, to], i) => {
          const a = jointMap[from];
          const b = jointMap[to];
          return (
            <Line
              key={`bone-static-${i}`}
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
        {staticJoints.map((j) => (
          <Circle
            key={`joint-static-${j.id}`}
            cx={j.x * width}
            cy={j.y * height}
            r={5}
            fill={color}
            opacity={0.8}
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
