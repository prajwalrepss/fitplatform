import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../theme';

/**
 * VitalisInput — Glassmorphic inset-shadow input field
 *
 * Matches the Vitalis signup design:
 *   - Semi-transparent surface-container background
 *   - Inset shadow + subtle border
 *   - Floating label inside container (label-caps)
 *   - Indigo focus glow
 *   - Optional icon, password toggle, right label
 *
 * Props:
 *   label, icon, value, onChangeText, placeholder,
 *   secureTextEntry, keyboardType, autoCapitalize,
 *   error, rightLabel, onRightLabelPress, variant
 *
 * variant: 'standard' (icon-left) | 'stacked' (label-inside, no icon)
 */
export default function VitalisInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  rightLabel,
  onRightLabelPress,
  variant = 'stacked',
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.05)', Colors.primary],
  });

  // ── Stacked variant (signup-style: label inside container) ──
  if (variant === 'stacked') {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.stackedContainer,
            {
              borderColor,
              backgroundColor: focused
                ? Colors.inputBackgroundFocused
                : Colors.inputBackground,
            },
          ]}
        >
          {/* Label row */}
          <View style={styles.stackedLabelRow}>
            <Text style={[styles.stackedLabel, focused && styles.labelFocused]}>
              {label}
            </Text>
            {rightLabel && (
              <Pressable onPress={onRightLabelPress} hitSlop={8}>
                <Text style={styles.rightLabel}>{rightLabel}</Text>
              </Pressable>
            )}
          </View>

          {/* Input row */}
          <View style={styles.stackedInputRow}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={Colors.surfaceVariant}
              secureTextEntry={hidden}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={styles.stackedInput}
              selectionColor={Colors.primary}
            />
            {secureTextEntry && (
              <Pressable
                onPress={() => setHidden(!hidden)}
                hitSlop={10}
                style={styles.eyeButton}
              >
                <MaterialIcons
                  name={hidden ? 'visibility' : 'visibility-off'}
                  size={22}
                  color={Colors.onSurfaceVariant}
                />
              </Pressable>
            )}
          </View>
        </Animated.View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  // ── Standard variant (login-style: icon on left, external label) ──
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, focused && styles.labelFocused]}>
          {label}
        </Text>
        {rightLabel && (
          <Pressable onPress={onRightLabelPress} hitSlop={8}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </Pressable>
        )}
      </View>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: focused
              ? Colors.inputBackgroundFocused
              : Colors.inputBackground,
          },
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={focused ? Colors.primary : 'rgba(199,196,215,0.5)'}
            style={styles.icon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(199,196,215,0.3)"
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          selectionColor={Colors.primary}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden(!hidden)}
            hitSlop={10}
            style={styles.eyeButton}
          >
            <MaterialIcons
              name={hidden ? 'visibility-off' : 'visibility'}
              size={20}
              color="rgba(199,196,215,0.5)"
            />
          </Pressable>
        )}
      </Animated.View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.marginMobile,
  },

  // ── Standard variant ──
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.sm,
  },
  label: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  labelFocused: {
    color: Colors.primary,
  },
  rightLabel: {
    ...Typography.labelCaps,
    color: Colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.radius,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderWidth: 1,
    // Inset shadow illusion
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginRight: Spacing.sm + 4,
  },
  input: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.onSurface,
    padding: 0,
  },

  // ── Stacked variant (signup) ──
  stackedContainer: {
    borderRadius: Spacing.radiusMd,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderWidth: 1,
    // Inset shadow
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  stackedLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stackedLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  stackedInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedInput: {
    flex: 1,
    ...Typography.bodyLg,
    color: Colors.onSurface,
    padding: 0,
  },

  // ── Shared ──
  eyeButton: {
    marginLeft: Spacing.sm,
    padding: 4,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: 6,
    marginLeft: Spacing.sm,
  },
});
