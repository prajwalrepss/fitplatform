import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import VitalisCard from '../components/VitalisCard';
import { Colors, Typography, Spacing } from '../theme';

export default function TrainingIntelScreen() {
  const muscleDistribution = [
    { name: 'Chest', percentage: 45, color: Colors.primary },
    { name: 'Back', percentage: 25, color: Colors.primaryContainer },
    { name: 'Legs', percentage: 15, color: Colors.primaryFixedDim },
    { name: 'Core', percentage: 15, color: Colors.outline },
  ];

  const personalRecords = [
    { exercise: 'Bench Press', weight: 105, date: 'June 24' },
    { exercise: 'Squat', weight: 140, date: 'June 20' },
    { exercise: 'Deadlift', weight: 180, date: 'June 15' },
  ];

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Training Intelligence</Text>
          <Text style={styles.subtitle}>Bio-metric insights and training analytics</Text>
        </View>

        {/* Consistency / Activity Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WEEKLY CONSISTENCY</Text>
          <VitalisCard variant="solid" style={styles.card}>
            <View style={styles.daysRow}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const active = i === 1 || i === 3 || i === 4; // Simulated active days
                return (
                  <View key={i} style={styles.dayCol}>
                    <Text style={styles.dayText}>{day}</Text>
                    <View
                      style={[
                        styles.dayIndicator,
                        active && styles.dayIndicatorActive,
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </VitalisCard>
        </View>

        {/* Volume Load progression (simulated with line indicators) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VOLUME TREND (1 MO)</Text>
          <VitalisCard variant="solid" style={styles.card}>
            <View style={styles.chartWrapper}>
              <View style={styles.chartBarGroup}>
                {[45, 60, 55, 75, 90, 85].map((val, i) => (
                  <View key={i} style={styles.chartBarCol}>
                    <View style={styles.chartBarTrack}>
                      <View style={[styles.chartBarFill, { height: `${val}%` }]} />
                    </View>
                    <Text style={styles.chartLabel}>Wk {i + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          </VitalisCard>
        </View>

        {/* Muscle Load Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MUSCLE LOAD DISTRIBUTION</Text>
          <VitalisCard variant="solid" style={styles.card}>
            <View style={styles.muscleLoadList}>
              {muscleDistribution.map((m, i) => (
                <View key={i} style={styles.muscleLoadItem}>
                  <View style={styles.muscleLoadHeader}>
                    <Text style={styles.muscleName}>{m.name}</Text>
                    <Text style={styles.musclePercentage}>{m.percentage}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${m.percentage}%`, backgroundColor: m.color },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </VitalisCard>
        </View>

        {/* Personal Records */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL RECORDS</Text>
          <View style={styles.prList}>
            {personalRecords.map((pr, i) => (
              <VitalisCard key={i} variant="solid" style={styles.prCard}>
                <View style={styles.prRow}>
                  <View style={styles.prIconRing}>
                    <MaterialIcons name="emoji-events" size={20} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prExercise}>{pr.exercise}</Text>
                    <Text style={styles.prDate}>{pr.date}</Text>
                  </View>
                  <Text style={styles.prWeight}>{pr.weight} kg</Text>
                </View>
              </VitalisCard>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 50 },
  header: {
    paddingTop: 56,
    paddingHorizontal: Spacing.marginMobile,
    paddingBottom: Spacing.lg,
  },
  title: { ...Typography.headlineLg, color: Colors.onSurface },
  subtitle: { ...Typography.bodyMd, color: Colors.onSurfaceVariant, marginTop: Spacing.xs },
  section: { paddingHorizontal: Spacing.marginMobile, marginBottom: Spacing.lg },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    letterSpacing: 3,
    marginBottom: Spacing.md,
  },
  card: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.lg },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayCol: { alignItems: 'center', gap: Spacing.sm },
  dayText: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, fontSize: 10 },
  dayIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(128, 131, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.1)',
  },
  dayIndicatorActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  chartWrapper: {
    height: 120,
    justifyContent: 'flex-end',
  },
  chartBarGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.xs,
  },
  chartBarTrack: {
    width: 12,
    height: 80,
    borderRadius: 6,
    backgroundColor: 'rgba(128, 131, 255, 0.05)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: Colors.primaryContainer,
    borderRadius: 6,
  },
  chartLabel: {
    ...Typography.caption,
    color: Colors.onSurfaceVariant,
    fontSize: 9,
  },
  muscleLoadList: { gap: Spacing.md },
  muscleLoadItem: { gap: Spacing.xs },
  muscleLoadHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  muscleName: { ...Typography.bodyMd, color: Colors.onSurface, fontFamily: 'HankenGrotesk_600SemiBold' },
  musclePercentage: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(128, 131, 255, 0.05)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  prList: { gap: Spacing.sm },
  prCard: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
  prRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  prIconRing: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 131, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prExercise: { ...Typography.bodyMd, color: Colors.onSurface, fontFamily: 'HankenGrotesk_600SemiBold' },
  prDate: { ...Typography.caption, color: Colors.onSurfaceVariant },
  prWeight: { ...Typography.headlineSm, color: Colors.primary },
});
