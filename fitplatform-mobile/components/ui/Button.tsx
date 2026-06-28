import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radius, spacing } from '../../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon';

interface ButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconSize = 20,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  if (variant === 'icon') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.iconButton, animatedStyle, style]}
      >
        {icon && <Ionicons name={icon} size={iconSize} color={colors.onSurface} />}
      </AnimatedPressable>
    );
  }

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[animatedStyle, fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={[colors.primaryDim, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.primaryButton, fullWidth && styles.fullWidth]}
        >
          {icon && <Ionicons name={icon} size={iconSize} color={colors.onPrimary} style={styles.buttonIcon} />}
          {title && <Text style={[styles.primaryText, textStyle]}>{title}</Text>}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.secondaryButton, animatedStyle, fullWidth && styles.fullWidth, style]}
      >
        {icon && <Ionicons name={icon} size={iconSize} color={colors.primaryFixed} style={styles.buttonIcon} />}
        {title && <Text style={[styles.secondaryText, textStyle]}>{title}</Text>}
      </AnimatedPressable>
    );
  }

  // danger
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.dangerButton, animatedStyle, fullWidth && styles.fullWidth, style]}
    >
      {icon && <Ionicons name={icon} size={iconSize} color={colors.destructive} style={styles.buttonIcon} />}
      {title && <Text style={[styles.dangerText, textStyle]}>{title}</Text>}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 8,
  },
  primaryText: {
    ...typography.labelLG,
    color: colors.onPrimary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  secondaryText: {
    ...typography.labelLG,
    color: colors.primaryFixed,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceContainerHigh,
  },
  dangerText: {
    ...typography.labelLG,
    color: colors.destructive,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
});
