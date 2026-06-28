import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing } from '../theme';
import VitalisChip from '../components/VitalisChip';
import TrainingBodyEngine from '../components/BodyEngine';
import SplitCardCarousel from '../components/SplitCardCarousel';
import SplitDetails from '../components/SplitDetails';
import Screens from '../constants/screens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Body Engine height taking up a generous part of the screen
const BODY_ENGINE_HEIGHT = Math.round(SCREEN_HEIGHT * 0.44);

// ────────────────────────────────────────────────────────────────────────────
// MUSCLE FILTER OPTIONS
// ────────────────────────────────────────────────────────────────────────────
const MUSCLE_FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'chest', label: 'CHEST' },
  { id: 'back', label: 'BACK' },
  { id: 'legs', label: 'LEGS' },
  { id: 'shoulders', label: 'SHOULDERS' },
  { id: 'arms', label: 'ARMS' },
];

// ────────────────────────────────────────────────────────────────────────────
// EXPANDED SAMPLE SPLIT DATA
// ────────────────────────────────────────────────────────────────────────────
const SAMPLE_SPLITS = [
  {
    id: '1',
    name: 'Push Pull Legs',
    difficulty: 'Intermediate',
    trainingGoal: 'Hypertrophy',
    duration: '60–75 min',
    frequency: '6 Days/Week',
    recoveryRating: '8.5/10',
    primaryMuscles: 'Chest, Back, Legs, Shoulders',
    trainingStyle: 'Hypertrophy',
    weeklyVolume: '24 Sets',
    communityCount: '2,400 active lifters',
    weeklySchedule: [
      { day: 'Day 1', target: 'Push' },
      { day: 'Day 2', target: 'Pull' },
      { day: 'Day 3', target: 'Legs' },
      { day: 'Day 4', target: 'Rest' },
      { day: 'Day 5', target: 'Push' },
      { day: 'Day 6', target: 'Pull' },
      { day: 'Day 7', target: 'Legs' },
    ],
    description: 'A high-frequency split designed for maximum hypertrophy through movement-pattern specialization.',
    users: ['JD', 'AS', '+12'],
    muscleGroups: ['chest', 'back', 'legs', 'shoulders'],
  },
  {
    id: '2',
    name: 'Upper / Lower',
    difficulty: 'Intermediate',
    trainingGoal: 'Strength',
    duration: '50–65 min',
    frequency: '4 Days/Week',
    recoveryRating: '9.2/10',
    primaryMuscles: 'Chest, Back, Legs',
    trainingStyle: 'Strength',
    weeklyVolume: '18 Sets',
    communityCount: '1,800 active lifters',
    weeklySchedule: [
      { day: 'Day 1', target: 'Upper' },
      { day: 'Day 2', target: 'Lower' },
      { day: 'Day 3', target: 'Rest' },
      { day: 'Day 4', target: 'Upper' },
      { day: 'Day 5', target: 'Lower' },
      { day: 'Day 6', target: 'Rest' },
      { day: 'Day 7', target: 'Rest' },
    ],
    description: 'Balanced upper-lower split for compound strength and hypertrophy with optimal recovery windows.',
    users: ['MK', 'TL', '+8'],
    muscleGroups: ['chest', 'back', 'legs'],
  },
  {
    id: '3',
    name: 'Bro Split',
    difficulty: 'Advanced',
    trainingGoal: 'Hypertrophy',
    duration: '60–70 min',
    frequency: '5 Days/Week',
    recoveryRating: '7.8/10',
    primaryMuscles: 'Chest, Back, Legs, Shoulders, Arms',
    trainingStyle: 'Hypertrophy',
    weeklyVolume: '20 Sets',
    communityCount: '4,200 active lifters',
    weeklySchedule: [
      { day: 'Day 1', target: 'Chest' },
      { day: 'Day 2', target: 'Back' },
      { day: 'Day 3', target: 'Legs' },
      { day: 'Day 4', target: 'Shoulders' },
      { day: 'Day 5', target: 'Arms' },
      { day: 'Day 6', target: 'Rest' },
      { day: 'Day 7', target: 'Rest' },
    ],
    description: 'Classic bodybuilding split targeting each muscle group once per week with maximum volume.',
    users: ['RJ', 'DP', '+22'],
    muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'arms'],
  },
  {
    id: '4',
    name: 'Full Body',
    difficulty: 'Beginner',
    trainingGoal: 'Athletic',
    duration: '45–55 min',
    frequency: '3 Days/Week',
    recoveryRating: '9.5/10',
    primaryMuscles: 'Chest, Back, Legs, Shoulders, Arms',
    trainingStyle: 'Athletic',
    weeklyVolume: '12 Sets',
    communityCount: '920 active lifters',
    weeklySchedule: [
      { day: 'Day 1', target: 'Work' },
      { day: 'Day 2', target: 'Rest' },
      { day: 'Day 3', target: 'Work' },
      { day: 'Day 4', target: 'Rest' },
      { day: 'Day 5', target: 'Work' },
      { day: 'Day 6', target: 'Rest' },
      { day: 'Day 7', target: 'Rest' },
    ],
    description: 'Efficient full-body training for balanced development. Ideal for athletic conditioning.',
    users: ['AK', 'LM', '+6'],
    muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'arms'],
  },
  {
    id: '5',
    name: 'Arnold Split',
    difficulty: 'Elite',
    trainingGoal: 'Powerbuilding',
    duration: '70–85 min',
    frequency: '6 Days/Week',
    recoveryRating: '6.8/10',
    primaryMuscles: 'Chest, Back, Legs, Shoulders, Arms',
    trainingStyle: 'Powerbuilding',
    weeklyVolume: '28 Sets',
    communityCount: '3,100 active lifters',
    weeklySchedule: [
      { day: 'Day 1', target: 'Ch/Bk' },
      { day: 'Day 2', target: 'Sh/Ar' },
      { day: 'Day 3', target: 'Legs' },
      { day: 'Day 4', target: 'Ch/Bk' },
      { day: 'Day 5', target: 'Sh/Ar' },
      { day: 'Day 6', target: 'Legs' },
      { day: 'Day 7', target: 'Rest' },
    ],
    description: 'Arnold Schwarzenegger split combining antagonist muscle groups for elite volume loading.',
    users: ['BW', 'SC', '+31'],
    muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'arms'],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// MUSCLE FOCUS DISPLAY NAMES
// ────────────────────────────────────────────────────────────────────────────
const MUSCLE_DISPLAY_NAMES = {
  chest: 'Pectoralis Major',
  back: 'Latissimus Dorsi',
  legs: 'Quadriceps Femoris',
  shoulders: 'Deltoid Complex',
  arms: 'Biceps Brachii',
};

/**
 * TrainingStyleDiscoveryScreen — Split Engine 2 Design
 *
 * Visually replicates the Split Engine 2 design layout exactly:
 *   - Header (VITALIS Top bar with avatar, help and menu icons)
 *   - Title ("Choose Your Training Style")
 *   - Large Body Engine (interactive front and back silhouettes, exact spacing)
 *   - Horizontal muscle filter chips
 *   - Horizontal swipeable Split Carousel
 *   - Weekly workout breakdown details panel
 *   - Main action Select Split Button
 */
export default function TrainingStyleDiscoveryScreen({ navigation }) {
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [activeSplit, setActiveSplit] = useState(SAMPLE_SPLITS[0]);

  // Derive splits matching the selected muscle filter
  const filteredSplits = SAMPLE_SPLITS.filter(
    (split) => selectedMuscle === 'all' || split.muscleGroups.includes(selectedMuscle)
  );

  // Auto-select first matching split in the filtered list if the current one isn't in it
  useEffect(() => {
    if (filteredSplits.length > 0 && !filteredSplits.find(s => s.id === activeSplit.id)) {
      setActiveSplit(filteredSplits[0]);
    }
  }, [selectedMuscle]);

  // Handle muscle group taps from BodyEngine
  const handleMusclePress = useCallback((muscleId, muscleGroup) => {
    if (muscleGroup && muscleGroup !== 'unknown') {
      setSelectedMuscle(muscleGroup);
    }
  }, []);

  // Handle chip filter taps
  const handleFilterPress = useCallback((filterId) => {
    setSelectedMuscle(filterId);
  }, []);

  // Handle split change from carousel swipe
  const handleSplitChange = useCallback((split) => {
    setActiveSplit(split);
  }, []);

  // Handle Select Split action
  const handleSelectSplit = useCallback((split) => {
    const selected = split || activeSplit;
    navigation.navigate(Screens.WORKOUT_PLAN, { split: selected });
  }, [activeSplit, navigation]);

  // Derive muscles to highlight on the BodyEngine
  const getHighlightedMuscles = () => {
    return activeSplit ? activeSplit.muscleGroups : [];
  };

  const muscleFocus = selectedMuscle === 'all'
    ? activeSplit.name
    : (MUSCLE_DISPLAY_NAMES[selectedMuscle] || 'Target Muscles');

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#051424" />

      {/* ── Top App Bar (Header) ── */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.openDrawer?.()}
          >
            <MaterialIcons name="menu" size={24} color="#c0c1ff" />
          </Pressable>
        </View>
        <Text style={styles.topBarTitle}>VITALIS</Text>
        <View style={styles.topBarRight}>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="help-outline" size={22} color="#c7c4d7" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="share" size={22} color="#c7c4d7" />
          </Pressable>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatarImage}
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx0Yw2hPD2cwzkhxS-4h-nzk0rOOcT-oQj1siHN536w0VAfw6uOOo1xbEwsrntKVa7LN1sgxMZkBaZsLhS4RnGng0D3NbEowvTpUpjq-QioB4-rViIoCyMmeSZCdjhsMCGd0CfzdHRr3w8wEfDtp9QUP9n-d3yNyS6z4RanL2q_uMvXrNZtzjE_YKLe0BJLSJGPmPj1vHtidFj22bdpO_eguc9yEPV92E8MLe6rCepTxtM0xjVGQ2qq16d1qnmn3zVmJAzUjqXy5k',
              }}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ── Title Section ── */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Choose Your Training Style</Text>
          <Text style={styles.subtitle}>Different paths. One goal. Your best self.</Text>
        </View>

        {/* ── Large Body Engine (Hero) ── */}
        <View style={styles.bodyEngineContainer}>
          <TrainingBodyEngine
            selectedMuscles={getHighlightedMuscles()}
            onMusclePress={handleMusclePress}
            highlightColor="#6D5DF6"
            interactive
            height={BODY_ENGINE_HEIGHT}
          />
          <View style={styles.viewLabels}>
            <Text style={styles.viewLabel}>FRONT</Text>
            <Text style={styles.viewLabel}>BACK</Text>
          </View>

          {/* Floating Muscle Focus read-out */}
          <View style={styles.focusBadge}>
            <View style={styles.focusDot} />
            <Text style={styles.focusText}>{muscleFocus}</Text>
          </View>
        </View>

        {/* ── Horizontal Muscle Filter Chips ── */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {MUSCLE_FILTERS.map((filter) => (
              <VitalisChip
                key={filter.id}
                label={filter.label}
                active={selectedMuscle === filter.id}
                onPress={() => handleFilterPress(filter.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Horizontal Swipeable Split Carousel ── */}
        <SplitCardCarousel
          splits={filteredSplits}
          activeSplitId={activeSplit.id}
          onSplitChange={handleSplitChange}
          onSelectSplit={handleSelectSplit}
        />

        {/* ── Weekly Workout Plan Details Card ── */}
        <SplitDetails split={activeSplit} />

        {/* ── Select Split Button ── */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.selectButton,
              pressed && styles.selectButtonPressed,
            ]}
            onPress={() => handleSelectSplit()}
          >
            <LinearGradient
              colors={['#6C63FF', '#564CE6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.selectButtonText}>SELECT SPLIT</Text>
          </Pressable>
        </View>

        {/* Bottom padding spacer to clear bottom tabbar */}
        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#051424',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 104, // to clear topbar
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: 48,
    paddingBottom: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(5, 20, 36, 0.85)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(192,193,255,0.06)',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  topBarTitle: {
    ...Typography.headlineLg,
    color: '#d4e4fa',
    letterSpacing: -1,
    fontSize: 20,
    fontWeight: '800',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.2)',
    marginLeft: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Title Section
  titleSection: {
    paddingHorizontal: Spacing.marginMobile,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  mainTitle: {
    ...Typography.displayLgMobile,
    color: Colors.onSurface,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    opacity: 0.7,
    textAlign: 'center',
    fontSize: 13,
  },

  // Body Engine
  bodyEngineContainer: {
    alignItems: 'center',
    marginTop: 4,
    position: 'relative',
  },
  viewLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '75%',
    marginTop: -8,
  },
  viewLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    opacity: 0.4,
    letterSpacing: 4,
    fontSize: 9,
  },
  focusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(109,93,246,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(109,93,246,0.2)',
    marginTop: 12,
    gap: 8,
  },
  focusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6D5DF6',
  },
  focusText: {
    ...Typography.labelCaps,
    color: '#9D8FFF',
    fontSize: 10,
    letterSpacing: 1,
  },

  // Filters
  filterContainer: {
    marginVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: Spacing.marginMobile,
    gap: 8,
  },

  // CTA Button at the bottom
  ctaContainer: {
    paddingHorizontal: Spacing.marginMobile,
    marginTop: 8,
    marginBottom: 16,
  },
  selectButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: 'hidden',
  },
  selectButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  selectButtonText: {
    ...Typography.labelCaps,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});
