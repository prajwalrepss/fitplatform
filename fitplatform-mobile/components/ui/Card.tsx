import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'low' | 'high';
}

export default function Card({ children, style, variant = 'low' }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'high' ? styles.high : styles.low,
        shadows.greenGlow,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  low: {
    backgroundColor: colors.surfaceContainerLow,
  },
  high: {
    backgroundColor: colors.surfaceContainerHigh,
  },
});
