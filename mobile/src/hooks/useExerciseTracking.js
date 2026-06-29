import { useCallback, useEffect, useRef, useState } from 'react';
import { getFormScore, getPrimaryAngle, smoothAngle } from '../utils/angles';

const MIN_REP_DURATION = 600;
const MIN_DOWN_PHASE_DURATION = 200;
const SLOW_DOWN_THRESHOLD = 1500;
const SLOW_DOWN_FEEDBACK_INTERVAL = 8000;

export function useExerciseTracking({ exercise, targetSets, targetReps, landmarks }) {
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [streak, setStreak] = useState(0);
  const [formScore, setFormScore] = useState(100);
  const [feedback, setFeedback] = useState('Position your body in the camera frame.');
  const [compensationAlert, setCompensationAlert] = useState(null);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [setHistory, setSetHistory] = useState([]);

  const repPhaseRef = useRef('idle');
  const lastRepTimeRef = useRef(0);
  const downPhaseStartRef = useRef(0);
  const angleBufferRef = useRef([]);
  const lastSlowDownFeedbackRef = useRef(0);
  const frameScoresRef = useRef([]);
  const lastCompensationTimeRef = useRef({});
  const compensationTimersRef = useRef({});
  const setCompletionPendingRef = useRef(false);

  const resetSession = useCallback(() => {
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
    setCompletionPendingRef.current = false;
  }, []);

  useEffect(() => {
    resetSession();
  }, [exercise?.id, resetSession]);

  const countRep = useCallback((angle, currentScore) => {
    const phase = repPhaseRef.current;
    const hysteresis = 4;
    const now = Date.now();

    if (phase === 'idle' || phase === 'up') {
      const threshold = exercise.phases.down.angle;
      const crossed = exercise.phases.down.direction === 'below'
        ? angle < threshold - hysteresis
        : angle > threshold + hysteresis;
      if (crossed) {
        repPhaseRef.current = 'down';
        downPhaseStartRef.current = now;
      }
      return;
    }

    if (phase !== 'down') return;
    if (setCompletionPendingRef.current) return;

    const downDuration = now - downPhaseStartRef.current;
    if (downDuration < MIN_DOWN_PHASE_DURATION) return;

    const threshold = exercise.phases.up.angle;
    const crossed = exercise.phases.up.direction === 'below'
      ? angle < threshold - hysteresis
      : angle > threshold + hysteresis;
    if (!crossed) return;

    const timeSinceLastRep = now - lastRepTimeRef.current;
    if (lastRepTimeRef.current > 0 && timeSinceLastRep < MIN_REP_DURATION) return;

    repPhaseRef.current = 'up';
    lastRepTimeRef.current = now;

    if (
      lastRepTimeRef.current > 0 &&
      timeSinceLastRep < SLOW_DOWN_THRESHOLD &&
      timeSinceLastRep >= MIN_REP_DURATION &&
      now - lastSlowDownFeedbackRef.current > SLOW_DOWN_FEEDBACK_INTERVAL
    ) {
      lastSlowDownFeedbackRef.current = now;
      setFeedback('Slow down for cleaner reps.');
    }

    const avgFrameScore = frameScoresRef.current.length > 0
      ? Math.round(frameScoresRef.current.reduce((sum, value) => sum + value, 0) / frameScoresRef.current.length)
      : currentScore;

    frameScoresRef.current = [];
    angleBufferRef.current = [];

    setCurrentRep((prevRep) => {
      const nextRep = prevRep + 1;
      const cleanRep = avgFrameScore >= 80;
      setStreak((prevStreak) => (cleanRep ? prevStreak + 1 : 0));
      setFeedback(`Rep ${nextRep} of ${targetReps}`);

      if (nextRep >= targetReps) {
        setCompletionPendingRef.current = true;
        setTimeout(() => {
          setSetHistory((prev) => [...prev, { setNumber: currentSet, avgScore: avgFrameScore }]);

          if (currentSet >= targetSets) {
            setIsSessionComplete(true);
            setFeedback('Exercise complete.');
          } else {
            setCurrentSet((prevSet) => prevSet + 1);
            setCurrentRep(0);
            setFeedback(`Set ${currentSet} complete. Prepare for Set ${currentSet + 1}.`);
            setCompletionPendingRef.current = false;
          }
          repPhaseRef.current = 'idle';
        }, 500);
      }

      return nextRep;
    });
  }, [currentSet, exercise, targetReps, targetSets]);

  const detectCompensation = useCallback((currentLandmarks) => {
    if (!exercise?.compensationRules) return;
    const now = Date.now();

    for (const rule of exercise.compensationRules) {
      if (rule.check(currentLandmarks)) {
        if (!compensationTimersRef.current[rule.id]) {
          compensationTimersRef.current[rule.id] = now;
        } else if (now - compensationTimersRef.current[rule.id] > 500) {
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

  useEffect(() => {
    if (!exercise || !landmarks || landmarks.length === 0 || isSessionComplete) return;

    const score = getFormScore(landmarks, exercise);
    setFormScore(score);
    frameScoresRef.current.push(score);
    if (frameScoresRef.current.length > 30) frameScoresRef.current.shift();

    const rawAngle = getPrimaryAngle(landmarks, exercise);
    if (rawAngle !== null) {
      angleBufferRef.current.push(rawAngle);
      if (angleBufferRef.current.length > 5) angleBufferRef.current.shift();
      countRep(smoothAngle(angleBufferRef.current), score);
    }

    detectCompensation(landmarks);
  }, [countRep, detectCompensation, exercise, isSessionComplete, landmarks]);

  return {
    currentSet,
    currentRep,
    streak,
    formScore,
    feedback,
    compensationAlert,
    isSessionComplete,
    setHistory,
    resetSession,
  };
}

export default useExerciseTracking;
