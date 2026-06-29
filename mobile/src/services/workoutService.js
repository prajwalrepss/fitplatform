import api from './api';

export const workoutAPI = {
  startLive: () => api.post('/workouts/live/start'),
  addExerciseLive: (exerciseId, exerciseName) => api.post('/workouts/live/add-exercise', { exerciseId, exerciseName }),
  addSetLive: (exerciseIndex, weight, reps) => api.post('/workouts/live/add-set', { exerciseIndex, weight, reps }),
  endLive: () => api.post('/workouts/live/end'),
  getLiveStatus: () => api.get('/workouts/live/status'),
  cancelLive: () => api.delete('/workouts/live/cancel'),
  logWorkout: (data) => api.post('/workouts/log', data),
  history: () => api.get('/workouts/history'),
};

export default workoutAPI;
