import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CameraStage from '../components/tracking/CameraStage';
import PoseOverlay from '../components/tracking/PoseOverlay';
import TrackingHUD from '../components/tracking/TrackingHUD';
import { resolveTrackingExercise } from '../constants/exerciseThresholds';
import useExerciseTracking from '../hooks/useExerciseTracking';
import usePoseDetection from '../hooks/usePoseDetection';
import Screens from '../constants/screens';
import workoutAPI from '../services/workoutService';
import trainingAPI from '../services/trainingService';
import { Colors, Spacing, Typography } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function normalizeExercises(exercises) {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    return [{
      id: 'bicep-curl',
      name: 'Bicep Curls',
      trackingId: 'bicep-curls',
      weight: 12,
      reps: 12,
      sets: 3,
      muscles: ['arms'],
    }];
  }

  return exercises.map((exercise, index) => {
    if (typeof exercise === 'string') {
      return {
        id: exercise.toLowerCase().replace(/\s+/g, '-'),
        name: exercise,
        trackingId: resolveTrackingExercise(exercise).id,
        weight: 0,
        reps: 12,
        sets: 3,
        muscles: [],
      };
    }

    return {
      id: exercise.id || `exercise-${index}`,
      name: exercise.name || `Exercise ${index + 1}`,
      trackingId: exercise.trackingId || resolveTrackingExercise(exercise.name).id,
      weight: Number(exercise.weight) || 0,
      reps: Number(exercise.reps) || 12,
      sets: Number(exercise.sets) || 3,
      muscles: exercise.muscles || [],
    };
  });
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function WorkoutSessionScreen({ navigation, route }) {
  const exercises = useMemo(() => normalizeExercises(route?.params?.exercises), [route?.params?.exercises]);
  const target = route?.params?.target || 'Work';
  const musclesTrained = route?.params?.musclesTrained || [];
  const liveStarted = route?.params?.liveStarted !== false;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackingActive, setTrackingActive] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [showGo, setShowGo] = useState(false);
  const [restRemaining, setRestRemaining] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [completedSets, setCompletedSets] = useState([]);
  const [syncing, setSyncing] = useState(false);

  const completionHandledRef = useRef(false);
  const currentExercise = exercises[currentIndex];
  const trackingConfig = useMemo(
    () => resolveTrackingExercise(currentExercise?.trackingId || currentExercise?.name),
    [currentExercise]
  );

  const trackingEnabled = trackingActive && countdown === 0 && restRemaining === 0 && !syncing;
  const landmarks = usePoseDetection({
    active: trackingEnabled,
    exerciseId: trackingConfig.id,
  });

  const {
    currentSet,
    currentRep,
    formScore,
    feedback,
    compensationAlert,
    isSessionComplete,
    setHistory,
  } = useExerciseTracking({
    exercise: trackingConfig,
    targetSets: currentExercise.sets,
    targetReps: currentExercise.reps,
    landmarks,
  });

  useEffect(() => {
    completionHandledRef.current = false;
    setCountdown(3);
    setShowGo(false);
  }, [currentIndex]);

  useEffect(() => {
    if (!trackingActive || restRemaining > 0 || syncing || countdown <= 0) return undefined;

    const timer = setInterval(() => {
      setCountdown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, restRemaining, syncing, trackingActive]);

  useEffect(() => {
    if (countdown !== 0 || restRemaining > 0 || syncing) return undefined;
    setShowGo(true);
    const timer = setTimeout(() => setShowGo(false), 650);
    return () => clearTimeout(timer);
  }, [countdown, restRemaining, syncing]);

  useEffect(() => {
    if (!trackingEnabled) return undefined;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [trackingEnabled]);

  const goToNextExercise = useCallback(() => {
    if (currentIndex >= exercises.length - 1) return;
    setRestRemaining(0);
    setTrackingActive(true);
    setCurrentIndex((index) => index + 1);
  }, [currentIndex, exercises.length]);

  useEffect(() => {
    if (restRemaining <= 0) return undefined;
    const timer = setInterval(() => {
      setRestRemaining((value) => {
        if (value <= 1) {
          clearInterval(timer);
          goToNextExercise();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [goToNextExercise, restRemaining]);

  const makeSetsForExercise = useCallback((includePartial = false) => {
    const completeSets = setHistory.map((entry) => ({
      exercise: currentExercise.name,
      exerciseId: currentExercise.id,
      exerciseIndex: currentIndex,
      setNumber: entry.setNumber,
      weight: currentExercise.weight,
      reps: currentExercise.reps,
      formScore: entry.avgScore,
    }));

    if (includePartial && currentRep > 0 && completeSets.length < currentExercise.sets) {
      completeSets.push({
        exercise: currentExercise.name,
        exerciseId: currentExercise.id,
        exerciseIndex: currentIndex,
        setNumber: completeSets.length + 1,
        weight: currentExercise.weight,
        reps: currentRep,
        formScore,
      });
    }

    return completeSets;
  }, [currentExercise, currentIndex, currentRep, formScore, setHistory]);

  const finishWorkout = useCallback(async (setsOverride) => {
    const setsToSave = setsOverride || [
      ...completedSets,
      ...makeSetsForExercise(true),
    ];

    if (setsToSave.length === 0) {
      Alert.alert('No reps recorded', 'Complete at least one rep before finishing the workout.');
      return;
    }

    setSyncing(true);
    try {
      if (liveStarted) {
        for (const set of setsToSave) {
          await workoutAPI.addSetLive(set.exerciseIndex, set.weight, set.reps);
        }
        await workoutAPI.endLive();
      } else {
        await workoutAPI.logWorkout({
          exercises: exercises.map((exercise, exerciseIndex) => ({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: setsToSave
              .filter((set) => set.exerciseIndex === exerciseIndex)
              .map((set) => ({ weight: set.weight, reps: set.reps, completed: true })),
          })).filter((exercise) => exercise.sets.length > 0),
          duration: Math.max(1, Math.round(elapsed / 60)),
        });
      }

      await trainingAPI.complete({
        target,
        musclesTrained,
        durationMin: Math.max(1, Math.round(elapsed / 60)),
      });

      navigation.replace(Screens.WORKOUT_SUMMARY, {
        duration: elapsed,
        sets: setsToSave,
        exercises: exercises.map((exercise) => exercise.name),
        formScore: setsToSave.length
          ? Math.round(setsToSave.reduce((sum, set) => sum + (set.formScore || 0), 0) / setsToSave.length)
          : 0,
      });
    } catch (error) {
      console.log('[WorkoutSessionScreen] Failed to save live workout:', error.message);
      Alert.alert(
        'Workout not saved',
        error.response?.data?.message || 'The backend rejected the live workout save. Please try again.'
      );
    } finally {
      setSyncing(false);
    }
  }, [completedSets, elapsed, exercises, liveStarted, makeSetsForExercise, musclesTrained, navigation, target]);

  useEffect(() => {
    if (!isSessionComplete || completionHandledRef.current) return;

    completionHandledRef.current = true;
    const exerciseSets = makeSetsForExercise(false);
    const nextCompletedSets = [...completedSets, ...exerciseSets];
    setCompletedSets(nextCompletedSets);

    if (currentIndex >= exercises.length - 1) {
      finishWorkout(nextCompletedSets);
    } else {
      setTrackingActive(false);
      setRestRemaining(30);
    }
  }, [completedSets, currentIndex, exercises.length, finishWorkout, isSessionComplete, makeSetsForExercise]);

  const handleSkip = () => {
    const partialSets = makeSetsForExercise(true);
    if (partialSets.length > 0) {
      setCompletedSets((prev) => [...prev, ...partialSets]);
    }

    if (currentIndex >= exercises.length - 1) {
      finishWorkout([...completedSets, ...partialSets]);
    } else {
      setTrackingActive(false);
      setRestRemaining(15);
    }
  };

  const averageForm = completedSets.length
    ? Math.round(completedSets.reduce((sum, set) => sum + (set.formScore || 0), 0) / completedSets.length)
    : formScore;

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <CameraStage active={trackingActive && !syncing} />

      <View style={styles.poseLayer}>
        <PoseOverlay
          landmarks={landmarks}
          width={SCREEN_WIDTH * 0.74}
          height={SCREEN_HEIGHT * 0.48}
        />
      </View>

      <View style={styles.topOverlay}>
        <Pressable style={styles.topIconButton} onPress={() => navigation.goBack()} hitSlop={10}>
          <MaterialIcons name="keyboard-arrow-down" size={28} color={Colors.onSurface} />
        </Pressable>
        <View style={styles.aiBadge}>
          <View style={styles.aiDot} />
          <Text style={styles.aiBadgeText}>AI LIVE</Text>
        </View>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        </View>
      </View>

      <View style={styles.sideMetrics}>
        <Text style={styles.sideLabel}>AVG FORM</Text>
        <Text style={styles.sideValue}>{averageForm}%</Text>
        <View style={styles.signalBars}>
          {[0.35, 0.58, 0.82, 0.64].map((height, index) => (
            <View key={index} style={[styles.signalBar, { height: 28 * height }]} />
          ))}
        </View>
      </View>

      {(countdown > 0 || showGo) && restRemaining === 0 && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownText}>{showGo ? 'GO' : countdown}</Text>
        </View>
      )}

      {restRemaining > 0 && (
        <View style={styles.restOverlay}>
          <Text style={styles.restLabel}>REST</Text>
          <Text style={styles.restTimer}>{restRemaining}s</Text>
          <Pressable style={styles.restButton} onPress={goToNextExercise}>
            <Text style={styles.restButtonText}>SKIP REST</Text>
          </Pressable>
        </View>
      )}

      {compensationAlert && (
        <View style={styles.alertBanner}>
          <MaterialIcons name="warning" size={18} color={Colors.error} />
          <Text style={styles.alertText}>{compensationAlert}</Text>
        </View>
      )}

      <TrackingHUD
        exerciseName={currentExercise.name}
        currentSet={currentSet}
        targetSets={currentExercise.sets}
        currentRep={currentRep}
        targetReps={currentExercise.reps}
        weight={currentExercise.weight}
        formScore={formScore}
        elapsed={formatTime(elapsed)}
        feedback={trackingActive ? feedback : 'Tracking is paused.'}
        paused={!trackingActive}
        onPause={() => setTrackingActive((value) => !value)}
        onSkip={handleSkip}
        onFinish={() => finishWorkout()}
      />

      {syncing && (
        <View style={styles.syncOverlay}>
          <ActivityIndicator color={Colors.primary} size="large" />
          <Text style={styles.syncText}>Saving workout</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  poseLayer: {
    position: 'absolute',
    top: '18%',
    left: '13%',
    right: '13%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topOverlay: {
    position: 'absolute',
    top: 46,
    left: Spacing.marginMobile,
    right: Spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(5, 20, 36, 0.64)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Spacing.radiusFull,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(5, 20, 36, 0.64)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4EDEA3',
  },
  aiBadgeText: {
    ...Typography.labelCaps,
    color: Colors.onSurface,
    fontSize: 10,
  },
  timerBadge: {
    minWidth: 72,
    alignItems: 'center',
    borderRadius: Spacing.radiusFull,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(5, 20, 36, 0.64)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  timerText: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontFamily: 'HankenGrotesk_700Bold',
  },
  sideMetrics: {
    position: 'absolute',
    top: '38%',
    left: Spacing.marginMobile,
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Spacing.radiusMd,
    backgroundColor: 'rgba(5, 20, 36, 0.56)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  sideLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 8,
  },
  sideValue: {
    ...Typography.bodyMd,
    color: Colors.primary,
    fontFamily: 'HankenGrotesk_700Bold',
  },
  signalBars: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  signalBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    opacity: 0.75,
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(1, 15, 31, 0.24)',
  },
  countdownText: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 92,
    lineHeight: 100,
    color: Colors.primary,
    textShadowColor: Colors.primary,
    textShadowRadius: 22,
    textShadowOffset: { width: 0, height: 0 },
  },
  restOverlay: {
    position: 'absolute',
    top: '24%',
    left: Spacing.marginMobile,
    right: Spacing.marginMobile,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderRadius: Spacing.radiusXl,
    backgroundColor: 'rgba(5, 20, 36, 0.78)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  restLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    letterSpacing: 3,
  },
  restTimer: {
    ...Typography.displayLgMobile,
    color: Colors.primary,
    marginVertical: Spacing.sm,
  },
  restButton: {
    borderRadius: Spacing.radiusFull,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(128, 131, 255, 0.18)',
  },
  restButtonText: {
    ...Typography.labelCaps,
    color: Colors.primary,
  },
  alertBanner: {
    position: 'absolute',
    left: Spacing.marginMobile,
    right: Spacing.marginMobile,
    bottom: 286,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Spacing.radiusFull,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(147, 0, 10, 0.24)',
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 171, 0.32)',
  },
  alertText: {
    ...Typography.caption,
    color: Colors.error,
    flex: 1,
  },
  syncOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(1, 15, 31, 0.78)',
    gap: Spacing.md,
  },
  syncText: {
    ...Typography.labelCaps,
    color: Colors.onSurface,
    letterSpacing: 2,
  },
});
