import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing } from '../theme';
import GoogleLogo from './GoogleLogo';

/**
 * VitalisButton — Primary, Google, Ghost, and Outline variants
 *
 * Primary:  Gradient pill (#e1e0ff → #c0c1ff) with inner highlight
 * Google:   Dark surface outlined pill with Google SVG
 * Ghost:    Text-only link
 * Outline:  Bordered pill with transparent background
 */
export default function VitalisButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const isPrimary = variant === 'primary';
  const isGoogle = variant === 'google';
  const isGhost = variant === 'ghost';
  const isOutline = variant === 'outline';

  // ── Primary ──
  if (isPrimary) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
        >
          <LinearGradient
            colors={[Colors.buttonGradientStart, Colors.buttonGradientEnd]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.primaryButton, disabled && styles.disabled]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.onPrimary} />
            ) : (
              <View style={styles.contentRow}>
                <Text style={styles.primaryText}>{title}</Text>
                {icon && (
                  <MaterialIcons
                    name={icon}
                    size={22}
                    color={Colors.onPrimary}
                    style={styles.icon}
                  />
                )}
              </View>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  // ── Google ──
  if (isGoogle) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          style={[styles.googleButton, disabled && styles.disabled]}
        >
          <View style={styles.contentRow}>
            <GoogleLogo size={20} />
            <Text style={styles.googleText}>{title}</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // ── Outline ──
  if (isOutline) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          style={[styles.outlineButton, disabled && styles.disabled]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <View style={styles.contentRow}>
              {icon && (
                <MaterialIcons
                  name={icon}
                  size={20}
                  color={Colors.primary}
                  style={styles.icon}
                />
              )}
              <Text style={styles.outlineText}>{title}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  }

  // ── Ghost ──
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.ghostButton, style]}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={18}
          color={Colors.primary}
          style={{ marginRight: 6 }}
        />
      )}
      <Text style={[styles.ghostText, disabled && { opacity: 0.3 }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  icon: {
    marginLeft: 4,
  },

  // ── Primary ──
  primaryButton: {
    height: 60,
    borderRadius: Spacing.radiusXl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    // Inner top highlight + shadow
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.8)',
  },
  primaryText: {
    ...Typography.headlineSm,
    color: Colors.onPrimary,
  },

  // ── Google ──
  googleButton: {
    backgroundColor: Colors.surfaceContainerLow,
    height: 52,
    borderRadius: Spacing.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    elevation: 4,
  },
  googleText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },

  // ── Outline ──
  outlineButton: {
    height: 52,
    borderRadius: Spacing.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: 'transparent',
  },
  outlineText: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },

  // ── Ghost ──
  ghostButton: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    ...Typography.bodyMd,
    color: Colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(192,193,255,0.3)',
  },

  // ── Disabled ──
  disabled: {
    opacity: 0.3,
  },
});
