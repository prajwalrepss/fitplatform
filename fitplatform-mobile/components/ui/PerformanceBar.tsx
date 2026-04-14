import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

interface PerformanceBarProps {
  value: number; // 0-100
  color?: string;
  trackColor?: string;
}

export default function PerformanceBar({
  value,
  color = colors.amber,
  trackColor = colors.surfaceContainerHigh,
}: PerformanceBarProps) {
  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            width: `${Math.min(100, Math.max(0, value))}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
