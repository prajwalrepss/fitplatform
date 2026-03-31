import client from './client';

export const authAPI = {
    register: (data) => client.post('/auth/register', data),
    login: (data) => client.post('/auth/login', data),
    me: () => client.get('/auth/me'),
};

export const workoutAPI = {
    start: () => client.post('/workout/start'),
    end: () => client.post('/workout/end'),
    status: () => client.get('/workout/status'),
    addExercise: (id) => client.post(`/workout/exercise/${id}`),
    history: () => client.get('/workout/history'),
};

export const exerciseAPI = {
    getAll: () => client.get('/exercises'),
};

export const muscleAPI = {
    getAll: () => client.get('/muscles'),
    getData: (range = '7d') => client.get(`/muscle?range=${range}`),
    getToday: () => client.get('/muscle?range=today'),
};

export const splitsAPI = {
    getAll: () => client.get('/splits'),
};

export const caloriesAPI = {
    add: (data) => client.post('/calories/add', data),
    today: () => client.get('/calories/today'),
    last7Days: () => client.get('/calories/last7days'),
};

export const analyticsAPI = {
    summary: () => client.get('/analytics/summary'),
    weekly: () => client.get('/analytics/weekly'),
    topExercises: () => client.get('/analytics/exercises/top'),
    muscles: () => client.get('/analytics/muscles'),
    streak: () => client.get('/analytics/streak'),
};

export const buddyAPI = {
    createProfile: (data) => client.post('/buddy/profile', data),
    getMyProfile: () => client.get('/buddy/profile/me'),
    updateDetails: (data) => client.put('/buddy/profile/details', data),
    getPublicProfile: (userId) => client.get(`/buddy/profile/${userId}`),
    getDefaultPrompts: () => client.get('/buddy/prompts/default'),
    discover: () => client.get('/buddy/discover'),
    sendRequest: (userId) => client.post(`/buddy/request/${userId}`),
    accept: (requestId) => client.post(`/buddy/accept/${requestId}`),
    reject: (requestId) => client.post(`/buddy/reject/${requestId}`),
    getRequests: () => client.get('/buddy/requests'),
    getBuddies: () => client.get('/buddy/list'),
};

export const setsAPI = {
    add: (data) => client.post('/sets/add', data),
    history: (exerciseId) => client.get(`/sets/history/${exerciseId}`),
    best: (exerciseId) => client.get(`/sets/best/${exerciseId}`),
    progress: (exerciseId) => client.get(`/sets/progress/${exerciseId}`),
};

// ========================================
// NEW DASHBOARD FEATURE APIs
// ========================================

export const sessionAPI = {
    getAll: () => client.get('/sessions'),
    create: (data) => client.post('/sessions', data),
    update: (id, data) => client.put(`/sessions/${id}`, data),
    delete: (id) => client.delete(`/sessions/${id}`),
    complete: (id) => client.post(`/sessions/${id}/complete`),
    getUpcoming: () => client.get('/sessions/upcoming'),
};

export const nutritionAPI = {
    getPlan: () => client.get('/nutrition/plan'),
    updatePlan: (data) => client.put('/nutrition/plan', data),
    getTodayLog: () => client.get('/nutrition/today'),
    logMeal: (meal) => client.post('/nutrition/log-meal', meal),
    getHistory: () => client.get('/nutrition/history'),
    deleteMeal: (mealId) => client.delete(`/nutrition/meal/${mealId}`),
};

export const hydrationAPI = {
    getToday: () => client.get('/hydration/today'),
    addWater: (amountMl) => client.post('/hydration/add', { amountMl }),
    getHistory: () => client.get('/hydration/history'),
};

export const dashboardAPI = {
    getMetrics: () => client.get('/dashboard/metrics'),
};

export const liveWorkoutAPI = {
    startLive: () => client.post('/workout/live/start'),
    addExerciseLive: (exerciseId, exerciseName) => client.post('/workout/live/add-exercise', { exerciseId, exerciseName }),
    addSetLive: (exerciseIndex, weight, reps) => client.post('/workout/live/add-set', { exerciseIndex, weight, reps }),
    endLive: () => client.post('/workout/live/end'),
    getLiveStatus: () => client.get('/workout/live/status'),
    cancelLive: () => client.delete('/workout/live/cancel'),
    logWorkout: (data) => client.post('/workout/log', data),
};
