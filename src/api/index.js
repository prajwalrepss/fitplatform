import client from './client';

export const authAPI = {
    register: (data) => client.post('/auth/register', data),
    login: (data) => client.post('/auth/login', data),
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
