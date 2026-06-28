import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radius, spacing } from '../../constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

function SkeletonItem({ width = '100%', height = 20, borderRadius = radius.md, style }: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.surfaceContainerHigh,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonItem width={52} height={52} borderRadius={radius.md} />
      <SkeletonItem height={16} style={{ marginTop: spacing.md }} />
      <SkeletonItem width="60%" height={12} style={{ marginTop: spacing.sm }} />
      <View style={styles.row}>
        <SkeletonItem width={60} height={20} borderRadius={radius.sm} />
        <SkeletonItem width={60} height={20} borderRadius={radius.sm} />
      </View>
    </View>
  );
}

export function SkeletonRow() {
  return (
    <View style={styles.skeletonRow}>
      <SkeletonItem width={44} height={44} borderRadius={radius.md} />
      <View style={styles.rowContent}>
        <SkeletonItem width="70%" height={14} />
        <SkeletonItem width="40%" height={10} style={{ marginTop: spacing.xs }} />
      </View>
    </View>
  );
}

export default SkeletonItem;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.xl,
    padding: spacing.lg,
    margin: spacing.xs + 2,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  skeletonRow: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  rowContent: {
    flex: 1,
  },
});
