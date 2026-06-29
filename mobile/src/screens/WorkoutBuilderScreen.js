import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import TrainingBodyEngine from '../components/BodyEngine';
import { Colors, Spacing, Typography } from '../theme';
import workoutAPI from '../services/workoutService';
import Screens from '../constants/screens';

const EXERCISE_LIBRARY = [
  { id: 'bench-press', name: 'Bench Press', category: 'Chest', muscles: ['chest', 'triceps'], trackingId: 'shoulder-press', weight: 40, reps: 10, sets: 3 },
  { id: 'push-up', name: 'Push-up', category: 'Chest', muscles: ['chest', 'triceps'], trackingId: 'shoulder-press', weight: 0, reps: 12, sets: 3 },
  { id: 'barbell-row', name: 'Barbell Row', category: 'Back', muscles: ['back', 'biceps'], trackingId: 'bicep-curls', weight: 35, reps: 10, sets: 3 },
  { id: 'pull-up', name: 'Pull-up', category: 'Back', muscles: ['back', 'biceps'], trackingId: 'bicep-curls', weight: 0, reps: 8, sets: 3 },
  { id: 'squat', name: 'Squat', category: 'Legs', muscles: ['legs', 'core'], trackingId: 'squats', weight: 60, reps: 10, sets: 3 },
  { id: 'lunge', name: 'Lunges', category: 'Legs', muscles: ['legs', 'glutes'], trackingId: 'lunges', weight: 16, reps: 12, sets: 3 },
  { id: 'overhead-press', name: 'Overhead Press', category: 'Shoulders', muscles: ['shoulders', 'triceps'], trackingId: 'shoulder-press', weight: 25, reps: 10, sets: 3 },
  { id: 'lateral-raise', name: 'Lateral Raises', category: 'Shoulders', muscles: ['shoulders'], trackingId: 'lateral-raises', weight: 8, reps: 12, sets: 3 },
  { id: 'bicep-curl', name: 'Bicep Curls', category: 'Arms', muscles: ['arms', 'biceps'], trackingId: 'bicep-curls', weight: 12, reps: 12, sets: 3 },
  { id: 'tricep-extension', name: 'Tricep Extensions', category: 'Arms', muscles: ['arms', 'triceps'], trackingId: 'shoulder-press', weight: 16, reps: 12, sets: 3 },
];

const TARGET_PRESETS = {
  push: ['bench-press', 'overhead-press', 'push-up', 'lateral-raise'],
  pull: ['barbell-row', 'pull-up', 'bicep-curl'],
  legs: ['squat', 'lunge'],
  upper: ['bench-press', 'barbell-row', 'overhead-press', 'bicep-curl'],
  lower: ['squat', 'lunge'],
  chest: ['bench-press', 'push-up'],
  back: ['barbell-row', 'pull-up'],
  shoulders: ['overhead-press', 'lateral-raise'],
  arms: ['bicep-curl', 'tricep-extension'],
  work: ['squat', 'bench-press', 'barbell-row'],
  'full body': ['squat', 'bench-press', 'barbell-row'],
};

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

function normalizeTarget(target) {
  return String(target || 'work').toLowerCase().trim();
}

function cloneExercise(exercise) {
  return { ...exercise, clientId: `${exercise.id}-${Date.now()}-${Math.random().toString(16).slice(2)}` };
}

function getPresetExercises(target) {
  const key = normalizeTarget(target);
  const ids = TARGET_PRESETS[key] || TARGET_PRESETS.work;
  return ids
    .map((id) => EXERCISE_LIBRARY.find((exercise) => exercise.id === id))
    .filter(Boolean)
    .map(cloneExercise);
}

function Stepper({ label, value, unit, min, max, step, onChange }) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControl}>
        <Pressable
          style={styles.stepperButton}
          onPress={() => onChange(Math.max(min, value - step))}
          hitSlop={8}
        >
          <MaterialIcons name="remove" size={18} color={Colors.onSurface} />
        </Pressable>
        <Text style={styles.stepperValue}>
          {value}{unit ? ` ${unit}` : ''}
        </Text>
        <Pressable
          style={styles.stepperButton}
          onPress={() => onChange(Math.min(max, value + step))}
          hitSlop={8}
        >
          <MaterialIcons name="add" size={18} color={Colors.onSurface} />
        </Pressable>
      </View>
    </View>
  );
}

export default function WorkoutBuilderScreen({ navigation, route }) {
  const target = route?.params?.target || 'Work';
  const musclesTrained = route?.params?.musclesTrained || [];
  const split = route?.params?.split;
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedExercises, setSelectedExercises] = useState(() => getPresetExercises(target));
  const [starting, setStarting] = useState(false);

  const selectedIds = useMemo(() => new Set(selectedExercises.map((exercise) => exercise.id)), [selectedExercises]);
  const filteredExercises = useMemo(() => (
    activeCategory === 'All'
      ? EXERCISE_LIBRARY
      : EXERCISE_LIBRARY.filter((exercise) => exercise.category === activeCategory)
  ), [activeCategory]);

  const selectedMuscles = useMemo(() => {
    const muscles = new Set(musclesTrained);
    selectedExercises.forEach((exercise) => exercise.muscles.forEach((muscle) => muscles.add(muscle)));
    return Array.from(muscles);
  }, [musclesTrained, selectedExercises]);

  const updateExercise = (clientId, patch) => {
    setSelectedExercises((prev) =>
      prev.map((exercise) => (exercise.clientId === clientId ? { ...exercise, ...patch } : exercise))
    );
  };

  const addExercise = (exercise) => {
    if (selectedIds.has(exercise.id)) return;
    setSelectedExercises((prev) => [...prev, cloneExercise(exercise)]);
  };

  const removeExercise = (clientId) => {
    setSelectedExercises((prev) => prev.filter((exercise) => exercise.clientId !== clientId));
  };

  const replaceExercise = (clientId) => {
    const current = selectedExercises.find((exercise) => exercise.clientId === clientId);
    const replacement = EXERCISE_LIBRARY.find(
      (exercise) => exercise.category === current?.category && !selectedIds.has(exercise.id)
    ) || EXERCISE_LIBRARY.find((exercise) => !selectedIds.has(exercise.id));

    if (!replacement) {
      Alert.alert('No replacement available', 'All compatible exercises are already in this workout.');
      return;
    }

    setSelectedExercises((prev) =>
      prev.map((exercise) => (exercise.clientId === clientId ? cloneExercise(replacement) : exercise))
    );
  };

  const startLiveSession = async () => {
    if (selectedExercises.length === 0) {
      Alert.alert('Add exercises', 'Choose at least one exercise before starting a live session.');
      return;
    }

    setStarting(true);
    try {
      const status = await workoutAPI.getLiveStatus();
      if (status.data?.data?.active) {
        await workoutAPI.cancelLive();
      }

      await workoutAPI.startLive();
      for (const exercise of selectedExercises) {
        await workoutAPI.addExerciseLive(exercise.id, exercise.name);
      }

      navigation.navigate(Screens.WORKOUT_SESSION, {
        exercises: selectedExercises,
        target,
        musclesTrained: selectedMuscles,
        split,
        liveStarted: true,
      });
    } catch (error) {
      console.log('[WorkoutBuilderScreen] Failed to start live session:', error.message);
      Alert.alert(
        'Live session not started',
        error.response?.data?.message || 'Please log in again and make sure the backend is reachable.'
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={10}>
            <MaterialIcons name="arrow-back" size={22} color={Colors.onSurface} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>{String(target).toUpperCase()} SESSION</Text>
            <Text style={styles.title}>Workout Builder</Text>
          </View>
        </View>

        <View style={styles.bodyPanel}>
          <TrainingBodyEngine
            selectedMuscles={selectedMuscles}
            interactive={false}
            highlightColor={Colors.primaryContainer}
            height={190}
          />
        </View>

        <View style={styles.categoryRail}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContent}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                style={[styles.categoryChip, activeCategory === category && styles.categoryChipActive]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[styles.categoryText, activeCategory === category && styles.categoryTextActive]}>
                  {category.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EXERCISES</Text>
            <Text style={styles.sectionMeta}>{selectedExercises.length} selected</Text>
          </View>

          <View style={styles.libraryGrid}>
            {filteredExercises.map((exercise) => {
              const added = selectedIds.has(exercise.id);
              return (
                <Pressable
                  key={exercise.id}
                  style={[styles.libraryItem, added && styles.libraryItemAdded]}
                  onPress={() => addExercise(exercise)}
                  disabled={added}
                >
                  <MaterialIcons
                    name={added ? 'check-circle' : 'add-circle-outline'}
                    size={18}
                    color={added ? '#4EDEA3' : Colors.primary}
                  />
                  <Text style={styles.libraryName} numberOfLines={1}>{exercise.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SESSION PLAN</Text>
          <View style={styles.planList}>
            {selectedExercises.map((exercise, index) => (
              <View key={exercise.clientId} style={styles.exerciseCard}>
                <View style={styles.exerciseTopRow}>
                  <View style={styles.indexBadge}>
                    <Text style={styles.indexText}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseMeta}>{exercise.category} / AI: {exercise.trackingId}</Text>
                  </View>
                  <Pressable style={styles.smallIconButton} onPress={() => replaceExercise(exercise.clientId)} hitSlop={8}>
                    <MaterialIcons name="swap-horiz" size={20} color={Colors.primary} />
                  </Pressable>
                  <Pressable style={styles.smallIconButton} onPress={() => removeExercise(exercise.clientId)} hitSlop={8}>
                    <MaterialIcons name="close" size={20} color={Colors.error} />
                  </Pressable>
                </View>

                <View style={styles.stepperRow}>
                  <Stepper
                    label="SETS"
                    value={exercise.sets}
                    min={1}
                    max={6}
                    step={1}
                    onChange={(value) => updateExercise(exercise.clientId, { sets: value })}
                  />
                  <Stepper
                    label="REPS"
                    value={exercise.reps}
                    min={1}
                    max={30}
                    step={1}
                    onChange={(value) => updateExercise(exercise.clientId, { reps: value })}
                  />
                  <Stepper
                    label="WEIGHT"
                    value={exercise.weight}
                    unit="kg"
                    min={0}
                    max={250}
                    step={2.5}
                    onChange={(value) => updateExercise(exercise.clientId, { weight: value })}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed, starting && styles.startButtonDisabled]}
          onPress={startLiveSession}
          disabled={starting}
        >
          {starting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <MaterialIcons name="radio-button-checked" size={20} color="#FFFFFF" />
              <Text style={styles.startButtonText}>START LIVE SESSION</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: 56,
    paddingHorizontal: Spacing.marginMobile,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  eyebrow: {
    ...Typography.labelCaps,
    color: Colors.primary,
    letterSpacing: 2,
  },
  title: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    marginTop: 2,
  },
  bodyPanel: {
    height: 210,
    borderRadius: Spacing.radiusXl,
    backgroundColor: 'rgba(5, 20, 36, 0.54)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  categoryRail: {
    marginHorizontal: -Spacing.marginMobile,
    marginBottom: Spacing.lg,
  },
  categoryContent: {
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.sm,
  },
  categoryChip: {
    borderRadius: Spacing.radiusFull,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(18, 33, 49, 0.6)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  categoryChipActive: {
    backgroundColor: 'rgba(128, 131, 255, 0.18)',
    borderColor: 'rgba(192, 193, 255, 0.32)',
  },
  categoryText: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
  },
  categoryTextActive: {
    color: Colors.primary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  sectionMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  libraryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  libraryItem: {
    width: '48%',
    minHeight: 48,
    borderRadius: Spacing.radiusMd,
    backgroundColor: 'rgba(18, 33, 49, 0.62)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  libraryItemAdded: {
    opacity: 0.6,
  },
  libraryName: {
    ...Typography.caption,
    color: Colors.onSurface,
    flex: 1,
  },
  planList: {
    gap: Spacing.md,
  },
  exerciseCard: {
    borderRadius: Spacing.radiusLg,
    backgroundColor: 'rgba(18, 33, 49, 0.72)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  exerciseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  indexBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(192,193,255,0.12)',
  },
  indexText: {
    ...Typography.labelCaps,
    color: Colors.primary,
    letterSpacing: 0,
  },
  exerciseName: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontFamily: 'HankenGrotesk_700Bold',
  },
  exerciseMeta: {
    ...Typography.caption,
    color: Colors.onSurfaceVariant,
  },
  smallIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  stepper: {
    flex: 1,
    gap: Spacing.xs,
  },
  stepperLabel: {
    ...Typography.labelCaps,
    color: Colors.textMuted,
    fontSize: 8,
  },
  stepperControl: {
    minHeight: 44,
    borderRadius: Spacing.radiusMd,
    backgroundColor: 'rgba(5, 20, 36, 0.72)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 34,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    ...Typography.caption,
    color: Colors.onSurface,
    fontFamily: 'HankenGrotesk_700Bold',
    textAlign: 'center',
    flex: 1,
  },
  startButton: {
    height: 54,
    borderRadius: Spacing.radiusLg,
    backgroundColor: Colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.primaryContainer,
    shadowOpacity: 0.36,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  startButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  startButtonDisabled: {
    opacity: 0.72,
  },
  startButtonText: {
    ...Typography.labelCaps,
    color: '#FFFFFF',
    letterSpacing: 1.8,
  },
});
