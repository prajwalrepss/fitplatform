import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, typography, spacing, radius } from '../../constants/theme';

const TAB_CONFIG: { name: string; icon: keyof typeof Ionicons.glyphMap; iconFilled: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { name: '(tabs)/index', icon: 'home-outline', iconFilled: 'home', label: 'Home' },
  { name: '(tabs)/workouts', icon: 'barbell-outline', iconFilled: 'barbell', label: 'Workouts' },
  { name: '(tabs)/social', icon: 'heart-outline', iconFilled: 'heart', label: 'Social' },
  { name: '(tabs)/profile', icon: 'person-circle-outline', iconFilled: 'person-circle', label: 'Profile' },
];

// Use 'any' for the tab bar props to avoid complex type issues with expo-router
export default function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom || 8 }]}>
      <BlurView intensity={20} tint="dark" style={styles.blur}>
        <View style={styles.container}>
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG[index] || TAB_CONFIG[0];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tab}
              >
                {isFocused && <View style={styles.activeIndicator} />}
                <Ionicons
                  name={isFocused ? config.iconFilled : config.icon}
                  size={24}
                  color={isFocused ? colors.primary : colors.onSurfaceVariant}
                  style={{ opacity: isFocused ? 1 : 0.6 }}
                />
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? colors.primary : colors.onSurfaceVariant },
                    { opacity: isFocused ? 1 : 0.6 },
                  ]}
                >
                  {config.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  blur: {
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14,14,14,0.85)',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 2,
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,255,133,0.15)',
  },
  label: {
    ...typography.labelSM,
    marginTop: spacing.xs,
  },
});
