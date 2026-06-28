import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Svg, { Line } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../constants/theme';
import PoseOverlay from '../../components/tracking/PoseOverlay';
import TrackingHUD from '../../components/tracking/TrackingHUD';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function ScanGrid() {
  const gridSpacing = 40;
  const lines = [];
  for (let x = 0; x <= SCREEN_WIDTH; x += gridSpacing) {
    lines.push(
      <Line
        key={`v-${x}`}
        x1={x} y1={0}
        x2={x} y2={SCREEN_HEIGHT}
        stroke="white"
        strokeWidth={0.5}
        strokeOpacity={0.05}
      />
    );
  }
  for (let y = 0; y <= SCREEN_HEIGHT; y += gridSpacing) {
    lines.push(
      <Line
        key={`h-${y}`}
        x1={0} y1={y}
        x2={SCREEN_WIDTH} y2={y}
        stroke="white"
        strokeWidth={0.5}
        strokeOpacity={0.05}
      />
    );
  }
  return (
    <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
      {lines}
    </Svg>
  );
}

export default function LiveTrackingScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar hidden />

      {/* Camera placeholder */}
      <View style={styles.cameraPlaceholder}>
        <View style={styles.cameraDark} />
      </View>

      {/* Scan grid overlay */}
      <ScanGrid />

      {/* Pose Overlay */}
      <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.poseContainer}>
        <PoseOverlay
          width={SCREEN_WIDTH * 0.6}
          height={SCREEN_HEIGHT * 0.45}
        />
      </Animated.View>

      {/* Top Overlay */}
      <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.topOverlay}>
        <View style={styles.topLeft}>
          <Text style={styles.topLabel}>CURRENT EXERCISE</Text>
          <Text style={styles.topExercise}>Bicep Curl</Text>
        </View>
        <View style={styles.topRight}>
          <Text style={styles.topLabel}>TIME ELAPSED</Text>
          <Text style={styles.topTime}>02:34</Text>
        </View>
      </Animated.View>

      {/* Side Data Stream */}
      <View style={styles.sideData}>
        <Text style={styles.sideLabel}>HEART RATE</Text>
        <View style={styles.miniBars}>
          {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
            <View
              key={i}
              style={[styles.miniBar, { height: 24 * h, backgroundColor: colors.primary }]}
            />
          ))}
        </View>
        <Text style={styles.sideBPM}>142 BPM</Text>
      </View>

      {/* Bottom HUD */}
      <TrackingHUD
        reps={16}
        formScore={87}
        feedback="Great form! Keep your elbows tucked."
        onPause={() => {}}
        onEnd={() => router.push('/exercise/summary')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
  },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraDark: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
    opacity: 0.6,
  },
  poseContainer: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    right: '20%',
    alignItems: 'center',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.xxxl + 16,
    paddingHorizontal: spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topLeft: {
    gap: spacing.xs,
  },
  topLabel: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
  },
  topExercise: {
    ...typography.displayLG,
    color: colors.onSurface,
    fontSize: 32,
  },
  topRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  topTime: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  sideData: {
    position: 'absolute',
    left: spacing.lg,
    top: '40%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sideLabel: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
    fontSize: 8,
  },
  miniBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
  },
  miniBar: {
    width: 4,
    borderRadius: 2,
  },
  sideBPM: {
    ...typography.labelSM,
    color: colors.primary,
    fontSize: 9,
  },
});
