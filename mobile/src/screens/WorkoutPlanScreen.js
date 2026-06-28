/**
 * WorkoutPlanScreen - Vitalis Workout Plan Overview
 * Implements the Stitch design with live backend integration and manual override.
 */
import React, { useMemo, useState, useEffect, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  StatusBar, Dimensions, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Typography } from '../theme';
import TrainingBodyEngine from '../components/BodyEngine';
import WorkoutPickerSheet from '../components/WorkoutPickerSheet';
import trainingAPI from '../services/trainingService';
import { getWorkoutInsight } from '../services/insightService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BODY_ENGINE_HEIGHT = Math.round(SCREEN_HEIGHT * 0.40);

const PRIMARY = '#6C63FF';
const TEXT_WHITE = '#FFFFFF';
const TEXT_SEC = '#B8C0D9';
const TEXT_MUT = '#7B8BA5';
const CARD_BG = '#111B2E';
const BORDER = 'rgba(255,255,255,0.06)';

// Muscle IDs for each workout type
const PUSH_MUSCLES = ['chest_upper','chest_mid','chest_lower','serratus_anterior','delts_front','delts_side','triceps_long','triceps_lateral','triceps_medial'];
const PULL_MUSCLES = ['lats','teres_major','rhomboids','traps_upper','traps_middle','traps_lower','erector_spinae','delts_rear','biceps_long','biceps_short','brachialis','brachioradialis','forearm_flexors','forearm_extensors'];
const LEGS_MUSCLES = ['glute_max','glute_med','glute_min','quad_rectus','quad_vastus_lateral','quad_vastus_medial','quad_vastus_inter','ham_biceps','ham_semitendinosus','ham_semimembranosus','adductor_magnus','gracilis','pectineus','tfl','calf_gastro','calf_soleus'];
const UPPER_MUSCLES = [...new Set([...PUSH_MUSCLES, ...PULL_MUSCLES])];
const LOWER_MUSCLES = [...LEGS_MUSCLES];
const FULL_BODY_MUSCLES = [...new Set([...UPPER_MUSCLES, ...LOWER_MUSCLES])];

const WORKOUT_MUSCLES_MAP = {
  'push': PUSH_MUSCLES, 'pull': PULL_MUSCLES, 'legs': LEGS_MUSCLES,
  'upper': UPPER_MUSCLES, 'lower': LOWER_MUSCLES,
  'full body': FULL_BODY_MUSCLES, 'work': FULL_BODY_MUSCLES,
  'chest': ['chest_upper','chest_mid','chest_lower','serratus_anterior','delts_front','triceps_lateral','triceps_medial'],
  'back': ['lats','teres_major','rhomboids','traps_middle','traps_lower','erector_spinae','delts_rear','biceps_long','biceps_short'],
  'shoulders': ['delts_front','delts_side','delts_rear','rotator_cuff','traps_upper'],
  'arms': ['biceps_long','biceps_short','brachialis','brachioradialis','triceps_long','triceps_lateral','triceps_medial','forearm_flexors','forearm_extensors'],
  'sh/ar': ['delts_front','delts_side','delts_rear','biceps_long','biceps_short','triceps_long','triceps_lateral','forearm_flexors'],
  'ch/bk': ['chest_upper','chest_mid','chest_lower','lats','teres_major','rhomboids','traps_middle'],
  'rest': [],
};

const WORKOUT_TARGET_LABELS = {
  'push': 'Chest, Shoulders, Triceps', 'pull': 'Back, Biceps, Forearms',
  'legs': 'Quads, Hamstrings, Glutes, Calves', 'upper': 'Chest, Back, Shoulders, Arms',
  'lower': 'Quads, Hamstrings, Glutes, Calves', 'full body': 'Full Body', 'work': 'Full Body',
  'chest': 'Chest, Front Delts, Triceps', 'back': 'Back, Rear Delts, Biceps',
  'shoulders': 'Shoulders, Traps', 'arms': 'Biceps, Triceps, Forearms',
  'sh/ar': 'Shoulders, Arms', 'ch/bk': 'Chest, Back', 'rest': 'Recovery Day',
};

const WORKOUT_EXERCISE_COUNTS = {
  'push': 12, 'pull': 11, 'legs': 10, 'upper': 14, 'lower': 10,
  'full body': 12, 'work': 12, 'chest': 10, 'back': 10,
  'shoulders': 8, 'arms': 8, 'sh/ar': 10, 'ch/bk': 12, 'rest': 0,
};

const DAY_LABELS_SHORT = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

const DEFAULT_SPLIT = {
  id: '1', name: 'Push Pull Legs', difficulty: 'Intermediate', duration: '60-75 min',
  weeklySchedule: [
    { day: 'Day 1', target: 'Push' }, { day: 'Day 2', target: 'Pull' },
    { day: 'Day 3', target: 'Legs' }, { day: 'Day 4', target: 'Rest' },
    { day: 'Day 5', target: 'Push' }, { day: 'Day 6', target: 'Pull' },
    { day: 'Day 7', target: 'Legs' },
  ],
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getMusclesForTarget(target) {
  if (!target) return [];
  return WORKOUT_MUSCLES_MAP[target.toLowerCase().trim()] ?? [];
}

function getLabelForTarget(target) {
  if (!target) return '';
  return WORKOUT_TARGET_LABELS[target.toLowerCase().trim()] ?? target;
}

const ActiveDot = memo(() => <View style={chipStyles.activeDot} />);

const DayChip = memo(({ label, status, workoutTarget, completed }) => {
  const isToday = status === 'today';
  const isPast = status === 'past';
  const isRest = workoutTarget?.toLowerCase() === 'rest';
  const isFuture = status === 'future';
  return (
    <View style={[chipStyles.chip, isToday && chipStyles.chipToday, isFuture && chipStyles.chipFuture]}>
      <Text style={[chipStyles.chipLabel, isToday && chipStyles.chipLabelToday, (isPast || isFuture) && chipStyles.chipLabelMuted]}>
        {label}
      </Text>
      {completed && <MaterialIcons name="check" size={12} color={PRIMARY} />}
      {isRest && !completed && <MaterialIcons name="bedtime" size={12} color={TEXT_SEC} />}
      {isToday && <ActiveDot />}
    </View>
  );
});

const ProgramProgress = memo(({ weekNum = 1, totalWeeks = 12 }) => {
  const pct = Math.round((Math.max(0, weekNum - 1) / totalWeeks) * 100);
  return (
    <View style={cardStyles.progressCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text style={cardStyles.sectionLabelText}>PROGRAM PROGRESS</Text>
        <Text style={[Typography.bodyLg, { fontFamily: 'HankenGrotesk_700Bold', color: TEXT_WHITE }]}>{pct}%</Text>
      </View>
      <View style={cardStyles.progressTrack}>
        <View style={[cardStyles.progressFill, { width: pct + '%' }]} />
      </View>
      <Text style={[Typography.bodyMd, { color: TEXT_SEC }]}>Week {weekNum} of {totalWeeks}</Text>
    </View>
  );
});

const AiInsightPanel = memo(({ text }) => {
  return (
    <View style={cardStyles.insightCard}>
      <MaterialIcons name="psychology" size={22} color={PRIMARY} style={{ marginTop: 2 }} />
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={cardStyles.insightLabel}>AI INSIGHT</Text>
        <Text style={cardStyles.insightText}>{text}</Text>
      </View>
    </View>
  );
});

const StatTile = memo(({ icon, value, label, fullWidth }) => (
  <View style={[cardStyles.statTile, fullWidth && cardStyles.statTileFull]}>
    <MaterialIcons name={icon} size={18} color={PRIMARY} style={{ marginBottom: 4 }} />
    {fullWidth ? (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    ) : (
      <>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </>
    )}
  </View>
));

export default function WorkoutPlanScreen({ navigation, route }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overrideTarget, setOverrideTarget] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [completing, setCompleting] = useState(false);

  // Load backend profile & data
  const loadData = async () => {
    try {
      const res = await trainingAPI.getProfile();
      setProfile(res.data);
      
      // If profile doesn't have a split, assign route parameter split or default
      if (!res.data.selectedSplit) {
        const initialSplit = route?.params?.split ?? DEFAULT_SPLIT;
        await trainingAPI.changeSplit(initialSplit);
        const updated = await trainingAPI.getProfile();
        setProfile(updated.data);
      }
    } catch (err) {
      console.log('[WorkoutPlanScreen] Error loading training profile:', err.message);
      // Setup default mock values locally in case backend is offline
      setProfile({
        currentWeek: 3,
        currentDay: 1,
        dayStreak: 14,
        weeklyCompletion: 82,
        completedWorkouts: 24,
        recoveryStatus: 'Ready',
        selectedSplit: route?.params?.split ?? DEFAULT_SPLIT,
        trainingHistory: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute active split and target workouts
  const activeSplit = profile?.selectedSplit ?? DEFAULT_SPLIT;

  const todayTarget = useMemo(() => {
    if (!activeSplit?.weeklySchedule?.length) return 'Rest';
    const jsDay = new Date().getDay();
    const idx = jsDay === 0 ? 6 : jsDay - 1;
    return activeSplit.weeklySchedule[idx]?.target ?? 'Rest';
  }, [activeSplit]);

  // Workout targets based on override or schedule
  const currentTarget = overrideTarget ?? todayTarget;
  const isOverridden = overrideTarget !== null;

  // Active muscle groups to highlight on the body engine
  const activeMuscles = useMemo(() => getMusclesForTarget(currentTarget), [currentTarget]);

  // Load dynamic AI insights
  useEffect(() => {
    const fetchInsight = async () => {
      // Find previous target in history if available
      const previousTarget = profile?.trainingHistory?.[profile.trainingHistory.length - 1]?.target ?? undefined;
      const text = await getWorkoutInsight({
        target: currentTarget,
        recovery: profile?.recoveryStatus ?? 'Ready',
        previousTarget,
      });
      setAiInsight(text);
    };
    if (profile) {
      fetchInsight();
    }
  }, [currentTarget, profile]);

  const scheduleWithStatus = useMemo(() => {
    const jsDay = new Date().getDay();
    const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
    const history = profile?.trainingHistory || [];

    // Find Mon of current week to identify completed days
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const thisWeekEntries = history.filter((h) => {
      const d = new Date(h.completedAt || h.date);
      return d >= monday && d <= sunday;
    });

    return (activeSplit.weeklySchedule ?? []).map((entry, idx) => ({
      ...entry,
      dayLabel: DAY_LABELS_SHORT[idx] ?? ('D' + (idx + 1)),
      status: idx < todayIdx ? 'past' : idx === todayIdx ? 'today' : 'future',
      completed: thisWeekEntries.some((h) => h.dayIndex === idx),
    }));
  }, [activeSplit, profile]);

  const handleStartWorkout = useCallback(async () => {
    if (currentTarget.toLowerCase() === 'rest') {
      Alert.alert('Rest Day', "Today is programmed as a recovery day. Make sure you stretch and stay hydrated!");
      return;
    }
    
    // Complete the workout via POST /training/complete
    setCompleting(true);
    try {
      await trainingAPI.complete({
        target: currentTarget,
        musclesTrained: activeMuscles,
        durationMin: 60,
      });
      Alert.alert(
        'Workout Completed!',
        `Nice job completing your ${currentTarget} session today! Progress updated.`,
        [{ text: 'OK', onPress: () => loadData() }]
      );
      setOverrideTarget(null);
    } catch (err) {
      console.log('[WorkoutPlanScreen] Complete workout failed:', err.message);
      Alert.alert('Error', 'Failed to save workout completion to the server.');
    } finally {
      setCompleting(false);
    }
  }, [currentTarget, activeMuscles]);

  const heroLabel = getLabelForTarget(currentTarget);
  const exerciseCount = WORKOUT_EXERCISE_COUNTS[currentTarget.toLowerCase().trim()] ?? 0;
  const isRestDay = currentTarget.toLowerCase() === 'rest';

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor="#081625" />
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#081625" />
      <View style={styles.ambientLeft} pointerEvents="none" />
      <View style={styles.ambientRight} pointerEvents="none" />

      {/* Header top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.topBarIcon} hitSlop={10}>
          <MaterialIcons name="bubble-chart" size={24} color={TEXT_WHITE} />
        </Pressable>
        <Text style={styles.topBarTitle}>VITALIS</Text>
        <View style={styles.topBarRight}>
          <Pressable hitSlop={10}>
            <MaterialIcons name="notifications-none" size={24} color={TEXT_SEC} />
          </Pressable>
          <View style={styles.avatarRing}>
            <View style={styles.avatarPlaceholder} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Greetings */}
        <View style={{ gap: 6 }}>
          <Text style={styles.greetingTitle}>{getGreeting()}, Prajwal</Text>
          <Text style={styles.greetingSubtitle}>{'WEEK ' + (profile?.currentWeek ?? 1) + ' - ' + activeSplit.name.toUpperCase()}</Text>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlowBlob} />
          <View style={{ gap: 12, zIndex: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={styles.diffBadge}>
                <View style={styles.diffDot} />
                <Text style={styles.diffText}>{(activeSplit.difficulty ?? 'INTERMEDIATE').toUpperCase()}</Text>
              </View>
              {isOverridden && (
                <View style={styles.overrideBadge}>
                  <Text style={styles.overrideBadgeText}>OVERRIDE ACTIVE</Text>
                </View>
              )}
            </View>

            {isOverridden && (
              <Text style={styles.scheduledTodayText}>
                SCHEDULED: {todayTarget.toUpperCase()}
              </Text>
            )}

            <Text style={styles.heroWorkoutName}>{currentTarget.toUpperCase()}</Text>
            <Text style={styles.heroTargetMuscles}>{heroLabel}</Text>
            {!isRestDay && (
              <View style={styles.heroMeta}>
                <View style={styles.heroMetaItem}>
                  <MaterialIcons name="schedule" size={14} color={TEXT_SEC} />
                  <Text style={styles.heroMetaText}>{activeSplit.duration ?? '60-75 MIN'}</Text>
                </View>
                <View style={styles.heroMetaItem}>
                  <MaterialIcons name="format-list-bulleted" size={14} color={TEXT_SEC} />
                  <Text style={styles.heroMetaText}>{exerciseCount + ' EXERCISES'}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Action buttons row */}
          <View style={styles.btnRow}>
            <Pressable
              style={({ pressed }) => [styles.startBtn, pressed && styles.startBtnPressed, isRestDay && styles.startBtnRest]}
              onPress={handleStartWorkout}
              disabled={completing}
            >
              {completing ? (
                <ActivityIndicator size="small" color={TEXT_WHITE} />
              ) : (
                <Text style={styles.startBtnText}>{isRestDay ? 'VIEW RECOVERY' : 'START WORKOUT'}</Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.changeBtn, pressed && styles.changeBtnPressed]}
              onPress={() => setPickerVisible(true)}
            >
              <Text style={styles.changeBtnText}>CHANGE WORKOUT</Text>
            </Pressable>
          </View>
        </View>

        {/* Body Engine */}
        <View style={styles.bodyEngineSection}>
          <TrainingBodyEngine
            selectedMuscles={activeMuscles}
            interactive={false}
            highlightColor={PRIMARY}
            height={BODY_ENGINE_HEIGHT}
          />
        </View>

        {/* Weekly Timeline */}
        <View style={{ gap: 12 }}>
          <Text style={styles.sectionLabel}>THIS WEEK</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingBottom: 4 }}>
            {scheduleWithStatus.map((entry, idx) => (
              <DayChip key={idx} label={entry.dayLabel} status={entry.status} workoutTarget={entry.target} completed={entry.completed} />
            ))}
          </ScrollView>
        </View>

        {/* Program Progress */}
        <ProgramProgress weekNum={profile?.currentWeek ?? 1} totalWeeks={12} />
        <AiInsightPanel text={aiInsight} />

        {/* Dynamic Stats Grid */}
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <StatTile icon="local-fire-department" value={String(profile?.dayStreak ?? 0)} label="DAY STREAK" />
          <StatTile icon="battery-charging-full" value={profile?.recoveryStatus ?? 'Ready'} label="RECOVERY" />
          <StatTile icon="done-all" value={(profile?.weeklyCompletion ?? 0) + '%'} label="WEEKLY COMPLETION" fullWidth />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Workout Selection Bottom Sheet Picker */}
      <WorkoutPickerSheet
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        weeklySchedule={activeSplit?.weeklySchedule || []}
        currentWorkoutTarget={currentTarget}
        onSelectWorkout={(selectedTarget) => {
          if (selectedTarget.toLowerCase() === todayTarget.toLowerCase()) {
            setOverrideTarget(null); // Clear override to fall back to schedule
          } else {
            setOverrideTarget(selectedTarget);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#081625' },
  center: { justifyContent: 'center', alignItems: 'center' },
  ambientLeft: {
    position: 'absolute', left: '-15%', top: '20%',
    width: SCREEN_WIDTH * 0.7, height: SCREEN_WIDTH * 0.7,
    borderRadius: SCREEN_WIDTH * 0.35, backgroundColor: 'rgba(108,99,255,0.08)', zIndex: 0,
  },
  ambientRight: {
    position: 'absolute', right: '-20%', top: '5%',
    width: SCREEN_WIDTH * 0.6, height: SCREEN_WIDTH * 0.6,
    borderRadius: SCREEN_WIDTH * 0.3, backgroundColor: 'rgba(108,99,255,0.05)', zIndex: 0,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 52,
    paddingBottom: 12,
    backgroundColor: 'rgba(8,22,37,0.9)', zIndex: 50,
  },
  topBarIcon: { padding: 4 },
  topBarTitle: { ...Typography.headlineSm, color: TEXT_WHITE, letterSpacing: -0.5 },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarRing: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden',
  },
  avatarPlaceholder: { flex: 1, backgroundColor: '#1c2b3c' },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, gap: 24 },
  greetingTitle: { ...Typography.displayLgMobile, color: TEXT_WHITE },
  greetingSubtitle: { ...Typography.labelCaps, color: TEXT_MUT, letterSpacing: 2 },
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: BORDER,
    padding: 28, overflow: 'hidden', gap: 20,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  heroGlowBlob: {
    position: 'absolute', right: -60, top: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(108,99,255,0.1)',
  },
  diffBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
    backgroundColor: 'rgba(108,99,255,0.1)', borderWidth: 1, borderColor: 'rgba(108,99,255,0.2)',
    borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4,
  },
  diffDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: PRIMARY,
    shadowColor: PRIMARY, shadowOpacity: 0.5, shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 }, elevation: 3,
  },
  diffText: { ...Typography.labelCaps, color: PRIMARY, letterSpacing: 2 },
  overrideBadge: {
    backgroundColor: 'rgba(255, 179, 0, 0.1)',
    borderWidth: 1, borderColor: 'rgba(255, 179, 0, 0.3)',
    borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3,
  },
  overrideBadgeText: {
    fontFamily: 'HankenGrotesk_700Bold', fontSize: 8, color: '#FFB300',
    letterSpacing: 1,
  },
  scheduledTodayText: {
    fontFamily: 'HankenGrotesk_700Bold', fontSize: 10, color: TEXT_MUT,
    letterSpacing: 1.5, marginBottom: -4,
  },
  heroWorkoutName: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 56, lineHeight: 60, letterSpacing: -2, color: TEXT_WHITE,
  },
  heroTargetMuscles: { ...Typography.bodyLg, color: TEXT_SEC },
  heroMeta: { flexDirection: 'row', gap: 20, marginTop: 4 },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroMetaText: { ...Typography.labelCaps, color: TEXT_SEC, letterSpacing: 1.5 },
  btnRow: {
    flexDirection: 'row', gap: 10, marginTop: 4,
  },
  startBtn: {
    flex: 1,
    backgroundColor: PRIMARY, borderRadius: 9999, paddingVertical: 14, alignItems: 'center',
    shadowColor: PRIMARY, shadowOpacity: 0.4, shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 }, elevation: 6, zIndex: 2,
  },
  startBtnRest: {
    backgroundColor: '#1E293B',
    shadowOpacity: 0,
  },
  startBtnPressed: { opacity: 0.9, shadowOpacity: 0.2 },
  startBtnText: {
    fontFamily: 'HankenGrotesk_700Bold', fontSize: 13, letterSpacing: 1.5,
    color: TEXT_WHITE, textTransform: 'uppercase',
  },
  changeBtn: {
    flex: 1,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 9999, paddingVertical: 14, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  changeBtnPressed: { backgroundColor: 'rgba(255,255,255,0.06)' },
  changeBtnText: {
    fontFamily: 'HankenGrotesk_700Bold', fontSize: 13, letterSpacing: 1.5,
    color: TEXT_SEC, textTransform: 'uppercase',
  },
  bodyEngineSection: {
    width: '100%', height: BODY_ENGINE_HEIGHT, backgroundColor: CARD_BG,
    borderRadius: 24, borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionLabel: { ...Typography.labelCaps, color: TEXT_SEC, letterSpacing: 2.5 },
  statValue: { ...Typography.headlineLg, color: TEXT_WHITE },
  statLabel: { ...Typography.labelCaps, color: TEXT_SEC, letterSpacing: 2, flexShrink: 1 },
});

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9999,
    backgroundColor: '#0D1322', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  chipToday: { backgroundColor: 'rgba(108,99,255,0.15)', borderColor: 'rgba(108,99,255,0.3)' },
  chipFuture: { opacity: 0.5 },
  chipLabel: {
    fontFamily: 'HankenGrotesk_700Bold', fontSize: 10,
    letterSpacing: 1.5, color: TEXT_SEC, textTransform: 'uppercase',
  },
  chipLabelToday: { color: PRIMARY },
  chipLabelMuted: { color: TEXT_MUT },
  activeDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: PRIMARY,
    shadowColor: PRIMARY, shadowOpacity: 0.8, shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 }, elevation: 4,
  },
});

const cardStyles = StyleSheet.create({
  progressCard: {
    backgroundColor: CARD_BG, borderRadius: 24, borderWidth: 1, borderColor: BORDER,
    padding: 24, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  sectionLabelText: { ...Typography.labelCaps, color: TEXT_SEC, letterSpacing: 2 },
  progressTrack: {
    width: '100%', height: 8, backgroundColor: '#081625', borderRadius: 9999, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: PRIMARY, borderRadius: 9999,
    shadowColor: PRIMARY, shadowOpacity: 0.5, shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 }, elevation: 2,
  },
  insightCard: {
    backgroundColor: CARD_BG, borderRadius: 24, borderLeftWidth: 2, borderLeftColor: PRIMARY,
    borderWidth: 1, borderColor: BORDER, padding: 24,
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  insightLabel: { ...Typography.labelCaps, color: PRIMARY, letterSpacing: 2 },
  insightText: { ...Typography.bodyMd, color: TEXT_SEC, lineHeight: 24 },
  statTile: {
    flex: 1, backgroundColor: CARD_BG, borderRadius: 24, borderWidth: 1, borderColor: BORDER,
    padding: 20, gap: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statTileFull: { flex: undefined, width: '100%' },
});
