// ============================================================
// FitPlatform — Workout Page (Orchestrator)
// Routes between ExerciseLibrary → ExerciseScreen → RestScreen → SummaryScreen
// ============================================================
import { useReducer, useRef } from 'react';
import { sessionReducer } from '../components/workout/reducer.js';
import { INITIAL_STATE } from '../components/workout/constants.js';
import { enableSpeech } from '../components/workout/utils.js';
import ExerciseLibrary from '../components/workout/ExerciseLibrary.jsx';
import ExerciseScreen from '../components/workout/ExerciseScreen.jsx';
import RestScreen from '../components/workout/RestScreen.jsx';
import SummaryScreen from '../components/workout/SummaryScreen.jsx';
import '../components/workout/WorkoutStyles.css';

export default function Workout() {
  const [state, dispatch] = useReducer(sessionReducer, INITIAL_STATE);

  // Shared refs for ExerciseScreen (persist across re-renders)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const animFrameRef = useRef(null);
  const repPhaseRef = useRef('idle');
  const lastCompensationTimeRef = useRef({});
  const frameScoresRef = useRef([]);
  const formScoreRef = useRef(0);
  const compensationAlertRef = useRef(null);

  // Enable speech engine when starting a session
  const wrappedDispatch = (action) => {
    if (action.type === 'START_SESSION') {
      enableSpeech();
      // Reset refs for new session
      repPhaseRef.current = 'idle';
      lastCompensationTimeRef.current = {};
      frameScoresRef.current = [];
      formScoreRef.current = 0;
      compensationAlertRef.current = null;
    }
    dispatch(action);
  };

  const renderScreen = () => {
    switch (state.screen) {
      case 'exercise':
        return (
          <ExerciseScreen
            state={state}
            dispatch={wrappedDispatch}
            videoRef={videoRef}
            canvasRef={canvasRef}
            poseLandmarkerRef={poseLandmarkerRef}
            animFrameRef={animFrameRef}
            repPhaseRef={repPhaseRef}
            lastCompensationTimeRef={lastCompensationTimeRef}
            frameScoresRef={frameScoresRef}
            formScoreRef={formScoreRef}
            compensationAlertRef={compensationAlertRef}
          />
        );
      case 'rest':
        return <RestScreen state={state} dispatch={wrappedDispatch} />;
      case 'summary':
        return <SummaryScreen state={state} dispatch={wrappedDispatch} />;
      case 'home':
      default:
        return <ExerciseLibrary state={state} dispatch={wrappedDispatch} />;
    }
  };

  return (
    <div className="workout-module" style={{ minHeight: '100%', position: 'relative' }}>
      {renderScreen()}
    </div>
  );
}
