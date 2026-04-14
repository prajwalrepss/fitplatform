import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../constants/theme';
import FilterChip from '../../components/ui/FilterChip';
import ExerciseCard from '../../components/ui/ExerciseCard';
import { SkeletonCard } from '../../components/ui/SkeletonLoader';
import { exercises } from '../../data/exercises';

const MUSCLE_GROUPS = ['All', 'Upper Body', 'Lower Body', 'Core'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function WorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredExercises = exercises.filter((e) => {
    const matchesMuscle = selectedMuscle === 'All' || e.muscle === selectedMuscle;
    const matchesDifficulty = !selectedDifficulty || e.difficulty === selectedDifficulty;
    const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    return matchesMuscle && matchesDifficulty && matchesSearch;
  });

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <View style={styles.header}>
            <Text style={styles.title}>Exercise Library</Text>
            <Ionicons name="options-outline" size={24} color={colors.onSurfaceVariant} />
          </View>
        </BlurView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 72 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]}
      >
        {/* Search */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </Animated.View>

        {/* Filter Chips */}
        <Animated.View entering={FadeInDown.delay(150).duration(300)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {MUSCLE_GROUPS.map((g) => (
              <FilterChip
                key={g}
                label={g}
                active={selectedMuscle === g}
                onPress={() => setSelectedMuscle(g)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Difficulty Pills */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <Text style={styles.intensityLabel}>INTENSITY LEVEL</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {DIFFICULTIES.map((d) => (
              <FilterChip
                key={d}
                label={d}
                active={selectedDifficulty === d}
                onPress={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                outlined
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Exercise Grid */}
        {loading ? (
          <View style={styles.gridRow}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <Animated.View entering={FadeIn.delay(100).duration(400)} style={styles.gridRow}>
            {filteredExercises.map((exercise) => (
              <View key={exercise.id} style={styles.gridItem}>
                <ExerciseCard exercise={exercise} />
              </View>
            ))}
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.xl,
  },
  searchBar: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyLG,
    color: colors.onSurface,
  },
  chipsScroll: {
    flexGrow: 0,
  },
  intensityLabel: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
  },
});
