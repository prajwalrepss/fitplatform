import axios from 'axios';
import { NativeModules, Platform } from 'react-native';
import { getToken, removeToken } from '../utils/storage';

// ============================================================================
// API BASE URL
// ============================================================================
// Automatically detects the dev machine's local IP address in development.
// Falls back to standard emulator/localhost mapping.
// ============================================================================
const getBaseUrl = () => {
  if (__DEV__) {
    try {
      const scriptURL = NativeModules.SourceCode?.scriptURL;
      if (scriptURL) {
        const match = scriptURL.match(/^https?:\/\/([^:/]+)(:\d+)?/);
        if (match && match[1]) {
          const ip = match[1];
          console.log(`[API] Detected dev server IP: ${ip}`);
          return `http://${ip}:5000/api`;
        }
      }
    } catch (_) {}

    // Fallbacks if scriptURL detection fails
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }
  }

  // Default fallback (matches active development machine network IP)
  return 'http://192.168.1.10:5000/api';
};

export const BASE_URL = getBaseUrl();

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
// Response Interceptor — handle 401 globally + log detailed diagnostics on error
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestConfig = error.config;
    const response = error.response;
    const request = error.request;

    const endpoint = requestConfig?.url || 'Unknown';
    const method = requestConfig?.method?.toUpperCase() || 'Unknown';
    const requestUrl = requestConfig ? `${requestConfig.baseURL || ''}${requestConfig.url || ''}` : 'Unknown';
    const baseURL = requestConfig?.baseURL || 'Unknown';
    const statusCode = response?.status || 'No Response';
    const errorCode = error.code || 'N/A';
    const responseBody = response?.data ? JSON.stringify(response.data) : 'N/A';
    const timeout = requestConfig?.timeout || 'N/A';
    const authState = requestConfig?.headers?.Authorization ? 'Attached (JWT)' : 'None';
    const requestLeftDevice = !!request ? 'Yes (Sent but no response or connection failed)' : 'No (Setup error or rejected before leaving)';

    console.error('============================================================');
    console.error('❌ API REQUEST ERROR DIAGNOSTICS');
    console.error(`• Endpoint:            ${endpoint}`);
    console.error(`• Method:              ${method}`);
    console.error(`• Request URL:         ${requestUrl}`);
    console.error(`• Base URL:            ${baseURL}`);
    console.error(`• Status Code:         ${statusCode}`);
    console.error(`• Axios Error Code:    ${errorCode}`);
    console.error(`• Response Body:       ${responseBody}`);
    console.error(`• Request Timeout:     ${timeout}ms`);
    console.error(`• Authentication:      ${authState}`);
    console.error(`• Left Device:         ${requestLeftDevice}`);
    console.error('============================================================');

    if (response?.status === 401) {
      await removeToken();
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

// ---------------------------------------------------------------------------
// Single Startup API Health Check
// ---------------------------------------------------------------------------
export const checkHealth = async () => {
  try {
    const healthUrl = BASE_URL.replace('/api', '/health');
    const res = await axios.get(healthUrl, { timeout: 3000 });
    return { ok: true, status: res.data?.status || 'ok' };
  } catch (err) {
    return { ok: false, error: err };
  }
};

export default api;
