import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * NeonButton — Primary & Ghost variants with scale-on-press animation
 *
 * Props:
 *   title       - string
 *   onPress     - fn
 *   variant     - 'primary' | 'secondary' | 'ghost'  (default: 'primary')
 *   icon        - string   (MaterialCommunityIcons name, optional)
 *   loading     - bool
 *   disabled    - bool
 */
export default function NeonButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  const buttonStyles = [
    styles.baseButton,
    isPrimary && styles.primaryButton,
    isSecondary && styles.secondaryButton,
    isGhost && styles.ghostButton,
    disabled && styles.disabledButton,
  ];

  const textStyles = [
    styles.baseText,
    isPrimary && styles.primaryText,
    isSecondary && styles.secondaryText,
    isGhost && styles.ghostText,
    disabled && styles.disabledText,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => buttonStyles}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isPrimary ? '#064200' : '#8eff71'}
          />
        ) : (
          <View style={styles.contentRow}>
            <Text style={textStyles}>{title}</Text>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={22}
                color={isPrimary ? '#064200' : isSecondary ? '#004145' : '#8eff71'}
                style={styles.icon}
              />
            )}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  // ── Primary (Neon Green) ──
  primaryButton: {
    backgroundColor: '#8eff71',
    // Neon glow shadow
    shadowColor: '#8eff71',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },

  // ── Secondary (Neon Blue / Cyan) ──
  secondaryButton: {
    backgroundColor: '#00f1fd',
    shadowColor: '#00f1fd',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  // ── Ghost ──
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.2)',
  },

  // ── Disabled ──
  disabledButton: {
    opacity: 0.3,
    shadowOpacity: 0,
    elevation: 0,
  },

  // ── Text ──
  baseText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_700Bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  primaryText: {
    color: '#064200',
  },
  secondaryText: {
    color: '#004145',
  },
  ghostText: {
    color: '#ababab',
    fontSize: 14,
  },
  disabledText: {
    color: '#555555',
  },

  // ── Icon ──
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    marginLeft: 4,
  },
});
