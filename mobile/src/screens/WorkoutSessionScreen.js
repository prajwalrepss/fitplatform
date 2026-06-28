import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import VitalisCard from '../components/VitalisCard';
import VitalisInput from '../components/VitalisInput';
import VitalisButton from '../components/VitalisButton';
import { Colors, Typography, Spacing } from '../theme';
import Screens from '../constants/screens';

export default function WorkoutSessionScreen({ navigation, route }) {
  const exercises = route?.params?.exercises || ['Bench Press'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sets, setSets] = useState([]);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const logSet = () => {
    if (!weight || !reps) return;
    setSets((prev) => [...prev, { exercise: exercises[currentIndex], weight, reps }]);
    setWeight('');
    setReps('');
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const finishWorkout = () => {
    clearInterval(timerRef.current);
    navigation.navigate(Screens.WORKOUT_SUMMARY, {
      duration: elapsed,
      sets,
      exercises,
    });
  };

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        {/* Timer Bar */}
        <View style={styles.timerBar}>
          <Text style={styles.timerLabel}>ELAPSED</Text>
          <Text style={styles.timerValue}>{formatTime(elapsed)}</Text>
        </View>

        {/* Current Exercise */}
        <VitalisCard style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseIconRing}>
              <MaterialIcons name="fitness-center" size={28} color={Colors.primaryContainer} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseCount}>
                Exercise {currentIndex + 1} of {exercises.length}
              </Text>
              <Text style={styles.exerciseName}>{exercises[currentIndex]}</Text>
            </View>
          </View>

          {/* Set Logger */}
          <View style={styles.setInputRow}>
            <View style={{ flex: 1 }}>
              <VitalisInput
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                placeholder="0"
                keyboardType="numeric"
                variant="stacked"
              />
            </View>
            <View style={{ flex: 1 }}>
              <VitalisInput
                label="Reps"
                value={reps}
                onChangeText={setReps}
                placeholder="0"
                keyboardType="numeric"
                variant="stacked"
              />
            </View>
          </View>

          <VitalisButton
            title="Log Set"
            icon="add"
            onPress={logSet}
            variant="outline"
          />

          {/* Logged Sets */}
          {sets
            .filter((s) => s.exercise === exercises[currentIndex])
            .map((s, i) => (
              <View key={i} style={styles.loggedSet}>
                <Text style={styles.setNumber}>Set {i + 1}</Text>
                <Text style={styles.setDetail}>{s.weight} kg × {s.reps} reps</Text>
              </View>
            ))}
        </VitalisCard>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {currentIndex < exercises.length - 1 ? (
            <VitalisButton
              title="Next Exercise"
              icon="arrow-forward"
              onPress={nextExercise}
              variant="outline"
            />
          ) : null}
          <VitalisButton
            title="Complete Workout"
            icon="check"
            onPress={finishWorkout}
            variant="primary"
          />
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56 },
  timerBar: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.marginMobile,
    marginBottom: Spacing.md,
  },
  timerLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, letterSpacing: 3 },
  timerValue: { ...Typography.displayLgMobile, color: Colors.primary, marginTop: Spacing.xs },
  exerciseCard: { marginHorizontal: Spacing.marginMobile, marginBottom: Spacing.md },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  exerciseIconRing: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(128,131,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  exerciseCount: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  exerciseName: { ...Typography.headlineSm, color: Colors.onSurface, marginTop: 2 },
  setInputRow: { flexDirection: 'row', gap: Spacing.sm + 4, marginBottom: Spacing.sm },
  loggedSet: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: Spacing.sm, borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant, marginTop: Spacing.sm,
  },
  setNumber: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  setDetail: { ...Typography.bodyMd, color: Colors.onSurface, fontFamily: 'HankenGrotesk_600SemiBold' },
  bottomActions: {
    marginTop: 'auto',
    paddingHorizontal: Spacing.marginMobile,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm + 4,
  },
});
