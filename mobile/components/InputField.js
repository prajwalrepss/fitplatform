import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * InputField — Glassmorphic dark input with icon & focus glow
 *
 * Props:
 *   label       - string   (e.g. "Email Address")
 *   icon        - string   (MaterialCommunityIcons name)
 *   value       - string
 *   onChangeText- fn
 *   placeholder - string
 *   secureTextEntry - bool
 *   keyboardType    - string
 *   autoCapitalize  - string
 *   error       - string   (shown below the field)
 */
export default function InputField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const glowShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {label}
      </Text>

      {/* Input Container */}
      <Animated.View
        style={[
          styles.inputContainer,
          focused && styles.inputContainerFocused,
          {
            shadowColor: '#8eff71',
            shadowOpacity: glowShadowOpacity,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 4 },
          },
        ]}
      >
        {/* Left Icon */}
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={focused ? '#00f1fd' : '#ababab'}
          style={styles.icon}
        />

        {/* Text Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(171, 171, 171, 0.3)"
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          selectionColor="#8eff71"
        />

        {/* Password Toggle */}
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidden(!hidden)}
            hitSlop={10}
            style={styles.eyeButton}
          >
            <MaterialCommunityIcons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="rgba(171, 171, 171, 0.5)"
            />
          </Pressable>
        )}
      </Animated.View>

      {/* Bottom Glow Line */}
      {focused && <View style={styles.glowLine} />}

      {/* Error Text */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#ababab',
    marginBottom: 8,
    marginLeft: 16,
  },
  labelFocused: {
    color: '#00f1fd',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 31, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    // Elevation for Android
    elevation: 0,
  },
  inputContainerFocused: {
    backgroundColor: 'rgba(31, 31, 31, 0.8)',
    elevation: 8,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Manrope_400Regular',
    color: '#ffffff',
    padding: 0,
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
  glowLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#8eff71',
    shadowColor: '#8eff71',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    color: '#ff7351',
    marginTop: 6,
    marginLeft: 16,
  },
});
