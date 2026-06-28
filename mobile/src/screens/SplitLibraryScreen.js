import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../theme';
import VitalisCard from '../components/VitalisCard';
import VitalisChip from '../components/VitalisChip';
import BodyEngine from '../components/BodyEngine';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ────────────────────────────────────────────────────────────────────────────
// MUSCLE FILTER OPTIONS
// ────────────────────────────────────────────────────────────────────────────
const MUSCLE_FILTERS = [
  { id: 'chest', label: 'CHEST' },
  { id: 'back', label: 'BACK' },
  { id: 'legs', label: 'LEGS' },
  { id: 'shoulders', label: 'SHOULDERS' },
  { id: 'arms', label: 'ARMS' },
];

// ────────────────────────────────────────────────────────────────────────────
// SAMPLE SPLIT DATA (will be replaced with backend data)
// ────────────────────────────────────────────────────────────────────────────
const SAMPLE_SPLITS = [
  {
    id: '1',
    name: 'Push Pull Legs',
    intensity: 'INTENSE',
    duration: '65 MIN',
    frequency: '6 DAYS / WEEK',
    description:
      'A high-frequency split designed for maximum hypertrophy through movement-pattern specialization.',
    users: ['JD', 'AS', '+12'],
    muscleGroups: ['chest', 'back', 'legs', 'shoulders'],
  },
  {
    id: '2',
    name: 'Upper / Lower',
    intensity: 'MODERATE',
    duration: '55 MIN',
    frequency: '4 DAYS / WEEK',
    description:
      'Balanced upper-lower split for strength and hypertrophy with optimal recovery.',
    users: ['MK', 'TL', '+8'],
    muscleGroups: ['chest', 'back', 'legs'],
  },
  {
    id: '3',
    name: 'Bro Split',
    intensity: 'HIGH',
    duration: '70 MIN',
    frequency: '5 DAYS / WEEK',
    description:
      'Classic bodybuilding split targeting each muscle group once per week with maximum volume.',
    users: ['RJ', 'DP', '+22'],
    muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'arms'],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// MUSCLE FOCUS DISPLAY NAMES
// ────────────────────────────────────────────────────────────────────────────
const MUSCLE_DISPLAY_NAMES = {
  chest: 'Pectoralis\nMajor',
  back: 'Latissimus\nDorsi',
  legs: 'Quadriceps\nFemoris',
  shoulders: 'Deltoid\nComplex',
  arms: 'Biceps\nBrachii',
};

/**
 * SplitLibraryScreen — Choose Your Style
 *
 * Displays the BodyEngine SVG anatomy with selectable muscle groups,
 * muscle filter chips, focus readout, and split program cards.
 */
export default function SplitLibraryScreen({ navigation }) {
  const [selectedMuscle, setSelectedMuscle] = useState('chest');
  const [activeSplit, setActiveSplit] = useState(SAMPLE_SPLITS[0]);

  // Handle muscle group taps from BodyEngine
  const handleMusclePress = useCallback((muscleId, muscleGroup) => {
    setSelectedMuscle(muscleGroup);
  }, []);

  // Handle chip filter taps
  const handleFilterPress = useCallback((filterId) => {
    setSelectedMuscle(filterId);
  }, []);

  // Handle split card select
  const handleSelectSplit = useCallback((split) => {
    setActiveSplit(split);
    // Future: navigate to WorkoutBuilder or show modal
  }, []);

  const muscleFocus = MUSCLE_DISPLAY_NAMES[selectedMuscle] || 'Select a\nMuscle';

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* ── Top App Bar ── */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.iconButton}
          onPress={() => navigation.openDrawer?.()}
        >
          <MaterialIcons name="menu" size={24} color={Colors.onSurfaceVariant} />
        </Pressable>
        <Text style={styles.topBarTitle}>VITALIS</Text>
        <Pressable style={styles.iconButton}>
          <MaterialIcons name="help-outline" size={24} color={Colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ── Header ── */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Choose Your Style</Text>
          <Text style={styles.headerSubtitle}>
            Different paths. One goal. Your best self.
          </Text>
        </View>

        {/* ── Body Engine Visualization ── */}
        <View style={styles.bodyEngineContainer}>
          <BodyEngine
            selectedMuscles={[selectedMuscle]}
            onMusclePress={handleMusclePress}
            highlightColor="#6D5DF6"
            interactive
          />
          <View style={styles.viewLabels}>
            <Text style={styles.viewLabel}>FRONT</Text>
            <Text style={styles.viewLabel}>BACK</Text>
          </View>
        </View>

        {/* ── Explore by Muscle + Muscle Focus ── */}
        <View style={styles.filterRow}>
          {/* Explore panel */}
          <VitalisCard variant="solid" style={styles.explorePanelCard}>
            <Text style={styles.panelLabel}>EXPLORE BY MUSCLE</Text>
            <View style={styles.chipRow}>
              {MUSCLE_FILTERS.map((filter) => (
                <VitalisChip
                  key={filter.id}
                  label={filter.label}
                  active={selectedMuscle === filter.id}
                  onPress={() => handleFilterPress(filter.id)}
                />
              ))}
            </View>
          </VitalisCard>

          {/* Muscle Focus panel */}
          <VitalisCard variant="solid" style={styles.focusPanelCard}>
            <Text style={styles.panelLabel}>MUSCLE FOCUS</Text>
            <Text style={styles.focusName}>{muscleFocus}</Text>
          </VitalisCard>
        </View>

        {/* ── Split Cards ── */}
        {SAMPLE_SPLITS.map((split) => (
          <SplitCard
            key={split.id}
            split={split}
            isActive={activeSplit.id === split.id}
            onSelect={() => handleSelectSplit(split)}
          />
        ))}

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SPLIT CARD COMPONENT
// ────────────────────────────────────────────────────────────────────────────
function SplitCard({ split, isActive, onSelect }) {
  return (
    <View style={[styles.splitCard, isActive && styles.splitCardActive]}>
      <LinearGradient
        colors={
          isActive
            ? ['rgba(109,93,246,0.08)', 'rgba(5,20,36,0.9)']
            : ['rgba(17,24,39,0.95)', 'rgba(17,24,39,0.95)']
        }
        style={[StyleSheet.absoluteFill, { borderRadius: Spacing.radiusXl + 4 }]}
      />

      {/* Header row */}
      <View style={styles.splitCardHeader}>
        <View style={styles.splitCardMeta}>
          <View style={styles.splitBadgeRow}>
            <View style={styles.intensityBadge}>
              <Text style={styles.intensityText}>{split.intensity}</Text>
            </View>
            <Text style={styles.durationText}>{split.duration}</Text>
          </View>
          <Text style={styles.splitName}>{split.name}</Text>
          <Text style={styles.frequencyText}>{split.frequency}</Text>
        </View>

        {/* Mini body silhouette icon */}
        <View style={styles.splitIconContainer}>
          <MaterialIcons name="accessibility-new" size={48} color="#6D5DF6" />
        </View>
      </View>

      {/* Description */}
      <Text style={styles.splitDescription}>{split.description}</Text>

      {/* Footer: Avatars + Select button */}
      <View style={styles.splitCardFooter}>
        <View style={styles.avatarRow}>
          {split.users.map((user, idx) => (
            <View
              key={idx}
              style={[
                styles.avatar,
                idx > 0 && { marginLeft: -12 },
              ]}
            >
              <Text style={styles.avatarText}>{user}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.selectButton} onPress={onSelect}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
            style={[StyleSheet.absoluteFill, { borderRadius: Spacing.radiusFull }]}
          />
          <Text style={styles.selectButtonText}>SELECT SPLIT</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Top App Bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: 52, // safe area
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  iconButton: {
    padding: Spacing.sm,
  },
  topBarTitle: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    letterSpacing: -1,
  },

  // ── ScrollView ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.marginMobile,
  },

  // ── Header ──
  headerSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.displayLgMobile,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },

  // ── Body Engine ──
  bodyEngineContainer: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  viewLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: -Spacing.sm,
  },
  viewLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
    letterSpacing: 3,
  },

  // ── Explore / Focus panels ──
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  explorePanelCard: {
    flex: 1,
    padding: Spacing.md,
  },
  focusPanelCard: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  panelLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.md,
    letterSpacing: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  focusName: {
    ...Typography.headlineSm,
    color: '#6D5DF6',
    lineHeight: 28,
  },

  // ── Split Cards ──
  splitCard: {
    borderRadius: Spacing.radiusXl + 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainer,
  },
  splitCardActive: {
    borderColor: 'rgba(109,93,246,0.3)',
    shadowColor: '#6D5DF6',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  splitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  splitCardMeta: {
    flex: 1,
  },
  splitBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(109,93,246,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(109,93,246,0.3)',
    borderRadius: 4,
  },
  intensityText: {
    ...Typography.labelCaps,
    fontSize: 10,
    color: '#6D5DF6',
    letterSpacing: 1,
  },
  durationText: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
  },
  splitName: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  frequencyText: {
    ...Typography.labelCaps,
    color: '#6D5DF6',
    letterSpacing: 2,
  },
  splitIconContainer: {
    width: 64,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  splitDescription: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  splitCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 2,
    borderColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarText: {
    ...Typography.labelCaps,
    fontSize: 11,
    color: Colors.onSurface,
  },
  selectButton: {
    backgroundColor: '#6D5DF6',
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: Spacing.radiusFull,
    shadowColor: '#6D5DF6',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: 'hidden',
  },
  selectButtonText: {
    ...Typography.labelCaps,
    fontSize: 13,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
});
