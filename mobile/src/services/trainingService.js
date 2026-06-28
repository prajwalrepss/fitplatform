import api from './api';

export const trainingAPI = {
  getProfile: () => api.get('/training/profile'),
  getToday: () => api.get('/training/today'),
  getWeek: () => api.get('/training/week'),
  complete: (data) => api.post('/training/complete', data),
  changeSplit: (split) => api.patch('/training/split', { split }),
  getHistory: (page = 1, limit = 20) => api.get(`/training/history?page=${page}&limit=${limit}`),
  getInsight: (params) => api.get('/training/insight', { params }),
};

export default trainingAPI;
