import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, spacing } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
}

export default function ActionButtons({ onPass, onLike, onSuperLike }: ActionButtonsProps) {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);

  const as1 = useAnimatedStyle(() => ({ transform: [{ scale: scale1.value }] }));
  const as2 = useAnimatedStyle(() => ({ transform: [{ scale: scale2.value }] }));
  const as3 = useAnimatedStyle(() => ({ transform: [{ scale: scale3.value }] }));

  return (
    <View style={styles.row}>
      <AnimatedPressable
        onPress={onPass}
        onPressIn={() => { scale1.value = withSpring(0.9); }}
        onPressOut={() => { scale1.value = withSpring(1); }}
        style={[styles.passBtn, as1]}
      >
        <Ionicons name="close" size={28} color={colors.destructive} />
      </AnimatedPressable>

      <AnimatedPressable
        onPress={onLike}
        onPressIn={() => { scale2.value = withSpring(0.9); }}
        onPressOut={() => { scale2.value = withSpring(1); }}
        style={[styles.likeBtn, as2]}
      >
        <Ionicons name="heart" size={32} color={colors.onPrimary} />
      </AnimatedPressable>

      <AnimatedPressable
        onPress={onSuperLike}
        onPressIn={() => { scale3.value = withSpring(0.9); }}
        onPressOut={() => { scale3.value = withSpring(1); }}
        style={[styles.superBtn, as3]}
      >
        <Ionicons name="star" size={28} color={colors.onPrimary} />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.xl,
  },
  passBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  superBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
