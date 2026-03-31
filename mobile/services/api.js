import axios from 'axios';
import { getToken, removeToken } from '../utils/storage';

// ============================================================================
// API BASE URL
// ============================================================================
// For Android Emulator: use 10.0.2.2 (maps to host machine's localhost)
// For iOS Simulator:    use localhost
// For Physical Device:  use your machine's local network IP (e.g. 192.168.1.x)
// ============================================================================
const BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Request Interceptor — attach Bearer token to every outgoing request
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response Interceptor — handle 401 globally (expired / invalid token)
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      // Navigation reset handled in App.js auth state listener
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Auth API methods
// ---------------------------------------------------------------------------
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export default api;
