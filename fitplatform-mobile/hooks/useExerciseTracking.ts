import { useState, useEffect, useRef, useCallback } from 'react';
import { Point2D, ExerciseConfig, getFormScore, getPrimaryAngle, smoothAngle } from '../utils/angles';

// Min time between reps (ms)
const MIN_REP_DURATION = 600;
// Min time in down phase before counting (ms)
const MIN_DOWN_PHASE_DURATION = 200;
// Slow down warning threshold (ms between reps)
const SLOW_DOWN_THRESHOLD = 1500;
// Slow down audio throttle (ms)
const SLOW_DOWN_AUDIO_INTERVAL = 8000;

interface UseExerciseTrackingProps {
  exercise: ExerciseConfig;
  targetSets: number;
  targetReps: number;
  landmarks: Point2D[];
}

export function useExerciseTracking({
  exercise,
  targetSets,
  targetReps,
  landmarks,
}: UseExerciseTrackingProps) {
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [streak, setStreak] = useState(0);
  const [formScore, setFormScore] = useState(100);
  const [feedback, setFeedback] = useState('Position your body in the camera frame.');
  const [compensationAlert, setCompensationAlert] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [setHistory, setSetHistory] = useState<any[]>([]);

  // Internal tracking refs matching website implementation
  const repPhaseRef = useRef<'idle' | 'down' | 'up'>('idle');
  const lastRepTimeRef = useRef<number>(0);
  const downPhaseStartRef = useRef<number>(0);
  const angleBufferRef = useRef<number[]>([]);
  const lastSlowDownSpeechRef = useRef<number>(0);
  const frameScoresRef = useRef<number[]>([]);
  const lastCompensationTimeRef = useRef<Record<string, number>>({});
  const compensationTimersRef = useRef<Record<string, number | null>>({});

  // -------------------------------------------------------------
  // Rep Counter State Machine
  // -------------------------------------------------------------
  const countRep = useCallback((angle: number, currentScore: number) => {
    const { phases } = exercise;
    const phase = repPhaseRef.current;
    const HYSTERESIS = 4;
    const now = Date.now();

    if (phase === 'idle' || phase === 'up') {
      const threshold = phases.down.angle;
      const crossed = phases.down.direction === 'below'
        ? angle < threshold - HYSTERESIS
        : angle > threshold + HYSTERESIS;
      if (crossed) {
        repPhaseRef.current = 'down';
        downPhaseStartRef.current = now;
      }
    } else if (phase === 'down') {
      // Require minimum time in down phase
      const downDuration = now - downPhaseStartRef.current;
      if (downDuration < MIN_DOWN_PHASE_DURATION) return;

      const threshold = phases.up.angle;
      const crossed = phases.up.direction === 'below'
        ? angle < threshold - HYSTERESIS
        : angle > threshold + HYSTERESIS;
      if (crossed) {
        // Enforce minimum rep duration
        const timeSinceLastRep = now - lastRepTimeRef.current;
        if (lastRepTimeRef.current > 0 && timeSinceLastRep < MIN_REP_DURATION) {
          return; // Too fast, ignore
        }

        repPhaseRef.current = 'up';
        lastRepTimeRef.current = now;

        // Slow down check
        if (lastRepTimeRef.current > 0 && timeSinceLastRep < SLOW_DOWN_THRESHOLD && timeSinceLastRep >= MIN_REP_DURATION) {
          if (now - lastSlowDownSpeechRef.current > SLOW_DOWN_AUDIO_INTERVAL) {
            lastSlowDownSpeechRef.current = now;
            setFeedback('Slow down for better form.');
          }
        }

        // Count the rep
        const avgFrameScore = frameScoresRef.current.length > 0
          ? Math.round(frameScoresRef.current.reduce((a, b) => a + b, 0) / frameScoresRef.current.length)
          : currentScore;

        frameScoresRef.current = [];
        angleBufferRef.current = [];

        setCurrentRep((prevRep) => {
          const nextRep = prevRep + 1;
          const isStreak = avgFrameScore >= 80;
          setStreak((prevStreak) => (isStreak ? prevStreak + 1 : 0));

          setFeedback(`Rep ${nextRep} of ${targetReps}`);

          // Check if set is complete
          if (nextRep >= targetReps) {
            setTimeout(() => {
              const avgScore = avgFrameScore; // average score of the set
              const setData = {
                setNumber: currentSet,
                avgScore,
              };
              setSetHistory((prev) => [...prev, setData]);

              if (currentSet >= targetSets) {
                setIsSessionComplete(true);
                setFeedback('Session complete! Great work!');
              } else {
                setCurrentSet((prevSet) => prevSet + 1);
                setCurrentRep(0);
                setFeedback(`Set ${currentSet} complete! Prepare for Set ${currentSet + 1}.`);
              }
              repPhaseRef.current = 'idle';
            }, 500);
          }

          return nextRep;
        });
      }
    }
  }, [exercise, targetReps, currentSet, targetSets]);

  // -------------------------------------------------------------
  // Compensation Detection
  // -------------------------------------------------------------
  const detectCompensation = useCallback((lmarks: Point2D[]) => {
    if (!exercise.compensationRules) return;
    const now = Date.now();

    for (const rule of exercise.compensationRules) {
      if (rule.check(lmarks)) {
        if (!compensationTimersRef.current[rule.id]) {
          compensationTimersRef.current[rule.id] = now;
        } else if (now - (compensationTimersRef.current[rule.id] || 0) > 500) {
          const lastTime = lastCompensationTimeRef.current[rule.id] || 0;
          if (now - lastTime > 5000) {
            lastCompensationTimeRef.current[rule.id] = now;
            setCompensationAlert(rule.message);
            setFeedback(rule.message);
            
            setTimeout(() => {
              setCompensationAlert((current) => (current === rule.message ? null : current));
            }, 3000);
          }
        }
      } else {
        compensationTimersRef.current[rule.id] = null;
      }
    }
  }, [exercise]);

  // -------------------------------------------------------------
  // Main frame processing loop
  // -------------------------------------------------------------
  useEffect(() => {
    if (!landmarks || landmarks.length === 0) return;

    // Calculate form score
    const score = getFormScore(landmarks, exercise);
    setFormScore(score);
    frameScoresRef.current.push(score);
    if (frameScoresRef.current.length > 30) frameScoresRef.current.shift();

    // Smoothed primary angle
    const rawAngle = getPrimaryAngle(landmarks, exercise);
    if (rawAngle !== null) {
      angleBufferRef.current.push(rawAngle);
      if (angleBufferRef.current.length > 5) angleBufferRef.current.shift();
      const smoothedAngle = smoothAngle(angleBufferRef.current);

      countRep(smoothedAngle, score);
    }

    // Detect posture compensations
    detectCompensation(landmarks);
  }, [landmarks, exercise, countRep, detectCompensation]);

  const toggleMute = () => setIsMuted(!isMuted);

  const resetSession = () => {
    setCurrentSet(1);
    setCurrentRep(0);
    setStreak(0);
    setFormScore(100);
    setFeedback('Position your body in the camera frame.');
    setCompensationAlert(null);
    setIsSessionComplete(false);
    setSetHistory([]);
    repPhaseRef.current = 'idle';
    lastRepTimeRef.current = 0;
    downPhaseStartRef.current = 0;
    angleBufferRef.current = [];
    frameScoresRef.current = [];
    lastCompensationTimeRef.current = {};
    compensationTimersRef.current = {};
  };

  return {
    currentSet,
    currentRep,
    streak,
    formScore,
    feedback,
    compensationAlert,
    isMuted,
    isSessionComplete,
    setHistory,
    toggleMute,
    resetSession,
  };
}
