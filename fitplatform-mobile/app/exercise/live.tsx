import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Line } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, typography, spacing } from '../../constants/theme';
import PoseOverlay from '../../components/tracking/PoseOverlay';
import TrackingHUD from '../../components/tracking/TrackingHUD';
import CameraView from '../../components/tracking/CameraView';
import { usePoseDetection } from '../../hooks/usePoseDetection';
import { useExerciseTracking } from '../../hooks/useExerciseTracking';
import { exercises } from '../../data/exercises';
import { EXERCISES } from '../../constants/exerciseThresholds';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function getThresholdId(name: string): string {
  const norm = name.toLowerCase();
  if (norm.includes('bicep')) return 'bicep-curls';
  if (norm.includes('squat')) return 'squats';
  if (norm.includes('shoulder')) return 'shoulder-press';
  if (norm.includes('lunge')) return 'lunges';
  if (norm.includes('lateral')) return 'lateral-raises';
  if (norm.includes('knee')) return 'knee-extensions';
  return 'bicep-curls';
}

export default function LiveTrackingScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  
  // Find current exercise based on URL parameters or default to Bicep Curls
  const currentExercise = useMemo(() => {
    const exerciseId = Number(id) || 1;
    return exercises.find((e) => e.id === exerciseId) || exercises[0];
  }, [id]);

  // Find VIZO tracking configuration
  const trackingConfig = useMemo(() => {
    const thresholdId = getThresholdId(currentExercise.name);
    return EXERCISES.find((e) => e.id === thresholdId) || EXERCISES[0];
  }, [currentExercise]);

  const [trackingActive, setTrackingActive] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [bpm, setBpm] = useState(138);

  // 1. Initialize Pose Detection
  const landmarks = usePoseDetection({
    active: trackingActive,
    exerciseId: trackingConfig.id,
  });

  // 2. Initialize Exercise Tracking Engine
  const {
    currentSet,
    currentRep,
    formScore,
    feedback,
    compensationAlert,
    isSessionComplete,
    setHistory,
    resetSession,
  } = useExerciseTracking({
    exercise: trackingConfig,
    targetSets: trackingConfig.targetSets,
    targetReps: trackingConfig.targetReps,
    landmarks,
  });

  // Timer logic
  useEffect(() => {
    if (!trackingActive || isSessionComplete) return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [trackingActive, isSessionComplete]);

  // Heart rate mock fluctuation
  useEffect(() => {
    if (!trackingActive || isSessionComplete) return;
    const interval = setInterval(() => {
      setBpm(135 + Math.floor(Math.random() * 10));
    }, 1500);
    return () => clearInterval(interval);
  }, [trackingActive, isSessionComplete]);

  // Auto-transition to summary screen when session completes
  useEffect(() => {
    if (isSessionComplete) {
      handleCompleteSession();
    }
  }, [isSessionComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePauseToggle = () => {
    setTrackingActive((prev) => !prev);
  };

  const handleCompleteSession = () => {
    // Navigate to summary screen passing real computed stats
    const totalReps = setHistory.length * trackingConfig.targetReps + currentRep;
    const avgForm = setHistory.length > 0
      ? Math.round(setHistory.reduce((sum, item) => sum + item.avgScore, 0) / setHistory.length)
      : formScore;

    router.push({
      pathname: '/exercise/summary',
      params: {
        reps: String(totalReps),
        duration: formatTime(elapsed),
        form: `${avgForm}%`,
      },
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar hidden />

      {/* Real-time Camera View & Grid Overlay */}
      <CameraView
        status={trackingActive ? 'active' : 'initializing'}
      />

      {/* Dynamic Pose Overlay driven by computed landmarks */}
      <Animated.View entering={FadeIn.delay(300).duration(600)} style={styles.poseContainer}>
        <PoseOverlay
          landmarks={landmarks}
          width={SCREEN_WIDTH * 0.75}
          height={SCREEN_HEIGHT * 0.5}
        />
      </Animated.View>

      {/* Top Overlay */}
      <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.topOverlay}>
        <View style={styles.topLeft}>
          <Text style={styles.topLabel}>CURRENT EXERCISE</Text>
          <Text style={styles.topExercise}>{currentExercise.name}</Text>
          <Text style={styles.topSetInfo}>
            SET {currentSet}/{trackingConfig.targetSets} • REP {currentRep}/{trackingConfig.targetReps}
          </Text>
        </View>
        <View style={styles.topRight}>
          <Text style={styles.topLabel}>TIME ELAPSED</Text>
          <Text style={styles.topTime}>{formatTime(elapsed)}</Text>
        </View>
      </Animated.View>

      {/* Side Data Stream */}
      <View style={styles.sideData}>
        <Text style={styles.sideLabel}>HEART RATE</Text>
        <View style={styles.miniBars}>
          {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
            <View
              key={i}
              style={[
                styles.miniBar,
                {
                  height: 24 * h * (trackingActive ? 1 : 0.4),
                  backgroundColor: trackingActive ? colors.primary : colors.surfaceContainerHighest,
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.sideBPM}>{trackingActive ? `${bpm} BPM` : '-- BPM'}</Text>
      </View>

      {/* On-screen Compensation Alert Warning overlay */}
      {compensationAlert && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertBannerText}>⚠️ {compensationAlert.toUpperCase()}</Text>
        </View>
      )}

      {/* Bottom HUD - Connected to Live Tracker State */}
      <TrackingHUD
        reps={currentRep}
        formScore={formScore}
        feedback={trackingActive ? feedback : 'Tracking is currently paused.'}
        onPause={handlePauseToggle}
        onEnd={handleCompleteSession}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
  },
  poseContainer: {
    position: 'absolute',
    top: '18%',
    left: '12%',
    right: '12%',
    alignItems: 'center',
    justifyContent: 'center',
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
    ...typography.displayMD,
    color: colors.onSurface,
    fontSize: 28,
  },
  topSetInfo: {
    ...typography.labelMD,
    color: colors.primary,
    marginTop: 2,
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
  alertBanner: {
    position: 'absolute',
    bottom: '38%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
    borderRadius: 9999,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBannerText: {
    ...typography.labelMD,
    color: colors.destructive,
    fontWeight: '700',
    letterSpacing: 1.0,
  },
});
