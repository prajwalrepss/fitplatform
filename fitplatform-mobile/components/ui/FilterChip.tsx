import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  outlined?: boolean;
}

export default function FilterChip({ label, active, onPress, outlined = false }: FilterChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (outlined) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.96); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[
          styles.outlinedChip,
          active && styles.outlinedChipActive,
          animatedStyle,
        ]}
      >
        <Text style={[styles.outlinedText, active && styles.outlinedTextActive]}>
          {label}
        </Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[styles.chip, active && styles.chipActive, animatedStyle]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
  outlinedChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    marginRight: spacing.sm,
  },
  outlinedChipActive: {
    borderColor: colors.primary + '33',
  },
  outlinedText: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
  },
  outlinedTextActive: {
    color: colors.primary,
  },
});
