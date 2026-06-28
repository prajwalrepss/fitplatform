import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import VitalisCard from '../components/VitalisCard';
import VitalisButton from '../components/VitalisButton';
import BodyEngine from '../components/BodyEngine';
import { Colors, Typography, Spacing } from '../theme';
import Screens from '../constants/screens';

export default function WorkoutSummaryScreen({ navigation, route }) {
  const duration = route?.params?.duration || 0;
  const sets = route?.params?.sets || [];
  const exercises = route?.params?.exercises || [];

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  // Calculate volume & distinct muscle groups
  const totalVolume = sets.reduce((acc, curr) => acc + (parseFloat(curr.weight) * parseInt(curr.reps) || 0), 0);
  const totalSets = sets.length;

  const getMusclesWorked = () => {
    const muscles = new Set();
    const muscleMap = {
      'bench press': 'Chest',
      'deadlift': 'Back',
      'squat': 'Legs',
      'overhead press': 'Shoulders',
      'barbell row': 'Back',
      'pull-up': 'Back',
    };
    exercises.forEach((ex) => {
      const match = muscleMap[ex.toLowerCase()];
      if (match) muscles.add(match);
    });
    return Array.from(muscles);
  };

  const musclesWorked = getMusclesWorked();

  const handleFinish = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Screens.HOME }],
    });
  };

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.successIconRing}>
            <MaterialIcons name="done-all" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Workout Summary</Text>
          <Text style={styles.subtitle}>Excellent effort. Data synced to Vitalis.</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <VitalisCard variant="solid" style={styles.statCard}>
            <MaterialIcons name="timer" size={24} color={Colors.primaryContainer} />
            <Text style={styles.statValue}>{formatTime(duration)}</Text>
            <Text style={styles.statLabel}>DURATION</Text>
          </VitalisCard>

          <VitalisCard variant="solid" style={styles.statCard}>
            <MaterialIcons name="fitness-center" size={24} color={Colors.primary} />
            <Text style={styles.statValue}>{totalSets}</Text>
            <Text style={styles.statLabel}>SETS COMPLETED</Text>
          </VitalisCard>

          <VitalisCard variant="solid" style={styles.statCard}>
            <MaterialIcons name="fitness-center" size={24} color={Colors.primaryFixedDim} />
            <Text style={styles.statValue}>{totalVolume} kg</Text>
            <Text style={styles.statLabel}>TOTAL VOLUME</Text>
          </VitalisCard>
        </View>

        {/* Body Engine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MUSCLES TARGETED</Text>
          <BodyEngine style={styles.bodyEngine} selectedMuscles={musclesWorked} />
        </View>

        {/* Exercise Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXERCISES</Text>
          <View style={styles.exerciseList}>
            {exercises.map((ex, i) => {
              const exSets = sets.filter((s) => s.exercise === ex);
              return (
                <VitalisCard key={i} variant="solid" style={styles.exerciseCard}>
                  <View style={styles.exerciseRow}>
                    <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.exerciseName}>{ex}</Text>
                      <Text style={styles.exerciseSetsDetail}>{exSets.length} sets completed</Text>
                    </View>
                  </View>
                </VitalisCard>
              );
            })}
          </View>
        </View>

        {/* Finish CTA */}
        <View style={styles.floatingCta}>
          <VitalisButton
            title="Complete & Save"
            icon="check"
            onPress={handleFinish}
            variant="primary"
          />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 50 },
  header: {
    paddingTop: 64,
    paddingHorizontal: Spacing.marginMobile,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  successIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(128, 131, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.2)',
  },
  title: { ...Typography.headlineLg, color: Colors.onSurface, textAlign: 'center' },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginTop: Spacing.xs, textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  statValue: {
    ...Typography.bodyMd,
    fontFamily: 'HankenGrotesk_700Bold',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  statLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 8,
    letterSpacing: 1.5,
  },
  section: { paddingHorizontal: Spacing.marginMobile, marginBottom: Spacing.lg },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    letterSpacing: 3,
    marginBottom: Spacing.md,
  },
  bodyEngine: { minHeight: 180 },
  exerciseList: { gap: Spacing.sm },
  exerciseCard: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  exerciseName: { ...Typography.bodyMd, color: Colors.onSurface, fontFamily: 'HankenGrotesk_600SemiBold' },
  exerciseSetsDetail: { ...Typography.caption, color: Colors.onSurfaceVariant },
  floatingCta: {
    paddingHorizontal: Spacing.marginMobile,
    marginTop: Spacing.md,
  },
});
