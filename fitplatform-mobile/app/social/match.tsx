import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import Button from '../../components/ui/Button';

function Particle({ index }: { index: number }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  const angle = (index / 12) * Math.PI * 2;
  const distance = 80 + Math.random() * 60;

  useEffect(() => {
    scale.value = withDelay(index * 50, withSpring(1, { damping: 8 }));
    translateX.value = withDelay(
      index * 50,
      withTiming(Math.cos(angle) * distance, { duration: 1500, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      index * 50,
      withTiming(Math.sin(angle) * distance, { duration: 1500, easing: Easing.out(Easing.cubic) })
    );
    opacity.value = withDelay(index * 50 + 500, withTiming(0, { duration: 1000 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, animStyle]} />
  );
}

export default function MatchScreen() {
  const insets = useSafeAreaInsets();

  const avatar1Scale = useSharedValue(0.6);
  const avatar2Scale = useSharedValue(0.6);

  useEffect(() => {
    avatar1Scale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 150 }));
    avatar2Scale.value = withDelay(400, withSpring(1, { damping: 10, stiffness: 150 }));
  }, []);

  const a1Style = useAnimatedStyle(() => ({
    transform: [{ scale: avatar1Scale.value }],
  }));
  const a2Style = useAnimatedStyle(() => ({
    transform: [{ scale: avatar2Scale.value }],
  }));

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Particles */}
      <View style={styles.particleContainer}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </View>

      {/* Avatars */}
      <View style={styles.avatarsRow}>
        <Animated.View style={[styles.avatar, a1Style]}>
          <Ionicons name="person" size={36} color={colors.primary} />
        </Animated.View>
        <Animated.View style={[styles.avatar, styles.avatarOverlap, a2Style]}>
          <Ionicons name="person" size={36} color={colors.secondary} />
        </Animated.View>
      </View>

      {/* Text */}
      <Animated.View entering={FadeIn.delay(600).duration(400)} style={styles.textSection}>
        <Text style={styles.kineticLabel}>KINETIC MATCH</Text>
        <Text style={styles.matchTitle}>It's a Match! 💚</Text>
        <Text style={styles.matchSubtitle}>You and Ayesha both liked each other.</Text>
        <Text style={styles.statsLine}>SYNCHRONY 94% | INTENSITY ELITE</Text>
      </Animated.View>

      {/* CTAs */}
      <Animated.View entering={FadeIn.delay(800).duration(400)} style={styles.ctaSection}>
        <Button
          title="💬 Send a Message"
          variant="primary"
          fullWidth
          onPress={() => router.push('/social/chat/1')}
        />
        <View style={{ height: spacing.md }} />
        <Button
          title="Keep Discovering"
          variant="secondary"
          fullWidth
          onPress={() => router.back()}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  particleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    ...shadows.greenGlow,
  },
  avatarOverlap: {
    marginLeft: -20,
    borderColor: colors.secondary,
    ...shadows.cyanGlow,
  },
  textSection: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  kineticLabel: {
    ...typography.labelLG,
    color: colors.onSurfaceVariant,
    letterSpacing: 4,
  },
  matchTitle: {
    ...typography.displayMD,
    color: colors.primary,
    textAlign: 'center',
  },
  matchSubtitle: {
    ...typography.bodyLG,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  statsLine: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  ctaSection: {
    width: '100%',
  },
});
