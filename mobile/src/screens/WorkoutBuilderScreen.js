import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import VitalisCard from '../components/VitalisCard';
import VitalisChip from '../components/VitalisChip';
import VitalisButton from '../components/VitalisButton';
import BodyEngine from '../components/BodyEngine';
import { Colors, Typography, Spacing } from '../theme';
import Screens from '../constants/screens';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

const EXERCISES = [
  { name: 'Bench Press', muscles: ['Chest', 'Triceps'], icon: 'fitness-center' },
  { name: 'Deadlift', muscles: ['Back', 'Legs'], icon: 'fitness-center' },
  { name: 'Squat', muscles: ['Legs', 'Core'], icon: 'fitness-center' },
  { name: 'Overhead Press', muscles: ['Shoulders', 'Triceps'], icon: 'fitness-center' },
  { name: 'Barbell Row', muscles: ['Back', 'Biceps'], icon: 'fitness-center' },
  { name: 'Pull-up', muscles: ['Back', 'Biceps'], icon: 'fitness-center' },
];

export default function WorkoutBuilderScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedExercises, setSelectedExercises] = useState([]);

  const filtered = activeCategory === 'All'
    ? EXERCISES
    : EXERCISES.filter((e) => e.muscles.includes(activeCategory));

  const toggleExercise = (name) => {
    setSelectedExercises((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Build Your Workout</Text>
          <Text style={styles.subtitle}>Select exercises for your session</Text>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map((cat) => (
            <VitalisChip
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* BodyEngine */}
        <View style={styles.section}>
          <BodyEngine
            style={styles.bodyEngine}
            selectedMuscles={activeCategory !== 'All' ? [activeCategory] : []}
          />
        </View>

        {/* Exercise Cards */}
        <View style={styles.exerciseList}>
          {filtered.map((exercise) => {
            const isSelected = selectedExercises.includes(exercise.name);
            return (
              <VitalisCard
                key={exercise.name}
                variant="solid"
                style={[styles.exerciseCard, isSelected && styles.exerciseCardActive]}
              >
                <View style={styles.exerciseRow}>
                  <View style={styles.exerciseIconContainer}>
                    <MaterialIcons name={exercise.icon} size={22} color={Colors.primaryContainer} />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseMuscles}>{exercise.muscles.join(' · ')}</Text>
                  </View>
                  <MaterialIcons
                    name={isSelected ? 'check-circle' : 'radio-button-unchecked'}
                    size={24}
                    color={isSelected ? Colors.primary : Colors.outlineVariant}
                    onPress={() => toggleExercise(exercise.name)}
                  />
                </View>
              </VitalisCard>
            );
          })}
        </View>

        {/* Start Button */}
        {selectedExercises.length > 0 && (
          <View style={styles.floatingCta}>
            <VitalisButton
              title={`Start Session (${selectedExercises.length})`}
              icon="arrow-forward"
              onPress={() =>
                navigation.navigate(Screens.WORKOUT_SESSION, {
                  exercises: selectedExercises,
                })
              }
              variant="primary"
            />
          </View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  header: {
    paddingTop: 56,
    paddingHorizontal: Spacing.marginMobile,
    paddingBottom: Spacing.lg,
  },
  title: { ...Typography.headlineLg, color: Colors.onSurface },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginTop: Spacing.xs },
  chipRow: {
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  section: { paddingHorizontal: Spacing.marginMobile, marginBottom: Spacing.lg },
  bodyEngine: { minHeight: 160 },
  exerciseList: { paddingHorizontal: Spacing.marginMobile, gap: Spacing.sm + 4 },
  exerciseCard: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
  exerciseCardActive: { borderColor: 'rgba(192,193,255,0.3)' },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm + 4 },
  exerciseIconContainer: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(128,131,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  exerciseInfo: { flex: 1, gap: 2 },
  exerciseName: { ...Typography.bodyMd, color: Colors.onSurface, fontFamily: 'HankenGrotesk_600SemiBold' },
  exerciseMuscles: { ...Typography.caption, color: Colors.onSurfaceVariant },
  floatingCta: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.xl,
  },
});
