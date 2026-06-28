import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors, typography, spacing, radius } from '../../constants/theme';
import ProfileCard from '../../components/social/ProfileCard';
import ActionButtons from '../../components/social/ActionButtons';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { mockProfiles } from '../../data/exercises';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function SocialScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const translateX = useSharedValue(0);
  const cardRotation = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const overlayColor = useSharedValue(0); // 0 = none, 1 = green, -1 = red

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const goToNext = (liked: boolean) => {
    if (liked && currentIndex === 0) {
      router.push('/social/match');
    }
    setCurrentIndex((prev) => (prev + 1) % mockProfiles.length);
    translateX.value = 0;
    cardRotation.value = 0;
    overlayOpacity.value = 0;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      cardRotation.value = (e.translationX / SCREEN_WIDTH) * 15;
      if (e.translationX > 0) {
        overlayColor.value = 1;
        overlayOpacity.value = Math.min(e.translationX / SWIPE_THRESHOLD, 0.5);
      } else {
        overlayColor.value = -1;
        overlayOpacity.value = Math.min(Math.abs(e.translationX) / SWIPE_THRESHOLD, 0.5);
      }
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const liked = e.translationX > 0;
        translateX.value = withTiming(liked ? SCREEN_WIDTH : -SCREEN_WIDTH, { duration: 200 });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(goToNext)(liked);
      } else {
        translateX.value = withSpring(0);
        cardRotation.value = withSpring(0);
        overlayOpacity.value = withTiming(0);
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${cardRotation.value}deg` },
    ],
  }));

  const greenOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayColor.value > 0 ? overlayOpacity.value : 0,
  }));

  const redOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayColor.value < 0 ? overlayOpacity.value : 0,
  }));

  const profile = mockProfiles[currentIndex];
  const nextProfile = mockProfiles[(currentIndex + 1) % mockProfiles.length];

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <View style={styles.header}>
            <Text style={styles.title}>Discover</Text>
            <Ionicons name="filter-outline" size={24} color={colors.onSurfaceVariant} />
          </View>
        </BlurView>
      </View>

      <View style={[styles.content, { paddingTop: insets.top + 72 }]}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <SkeletonCard />
          </View>
        ) : (
          <>
            {/* Background card (peek) */}
            <Animated.View entering={FadeIn.duration(300)} style={styles.bgCard}>
              <ProfileCard
                name={nextProfile.name}
                age={nextProfile.age}
                distance={nextProfile.distance}
                frequency={nextProfile.frequency}
                style_type={nextProfile.style}
                streak={nextProfile.streak}
                image={nextProfile.image}
                prompts={nextProfile.prompts}
              />
            </Animated.View>

            {/* Active card */}
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[styles.activeCard, cardAnimatedStyle]}>
                <ProfileCard
                  name={profile.name}
                  age={profile.age}
                  distance={profile.distance}
                  frequency={profile.frequency}
                  style_type={profile.style}
                  streak={profile.streak}
                  image={profile.image}
                  prompts={profile.prompts}
                />
                {/* Swipe overlays */}
                <Animated.View style={[styles.swipeOverlay, styles.greenOverlay, greenOverlayStyle]} />
                <Animated.View style={[styles.swipeOverlay, styles.redOverlay, redOverlayStyle]} />
              </Animated.View>
            </GestureDetector>

            {/* Action Buttons */}
            <ActionButtons
              onPass={() => goToNext(false)}
              onLike={() => goToNext(true)}
              onSuperLike={() => goToNext(true)}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
  },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'hidden',
  },
  headerBlur: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(14,14,14,0.8)',
  },
  title: {
    ...typography.headlineLG,
    color: colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: spacing.xxl,
  },
  loadingWrap: {
    width: '80%',
    height: 400,
  },
  bgCard: {
    position: 'absolute',
    top: 80,
    transform: [{ scale: 0.95 }, { translateY: 12 }],
    opacity: 0.6,
  },
  activeCard: {
    zIndex: 10,
  },
  swipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.xxl + 4,
  },
  greenOverlay: {
    backgroundColor: colors.primary,
  },
  redOverlay: {
    backgroundColor: colors.destructive,
  },
});
