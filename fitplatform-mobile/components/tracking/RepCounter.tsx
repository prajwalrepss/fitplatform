import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

interface RepCounterProps {
  count: number;
}

export default function RepCounter({ count }: RepCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>REPS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    ...typography.displayXL,
    color: colors.primary,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  label: {
    ...typography.labelLG,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
});
