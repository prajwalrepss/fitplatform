import axios from 'axios';
import { clearAll, getToken } from '../utils/storage';
import { getBaseUrl, getActiveNetworkInfo } from '../config/apiConfig';

const api = axios.create({
  baseURL: getBaseUrl(),
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
    // Dynamically resolve base URL on every request to avoid early native module race conditions
    config.baseURL = getBaseUrl();

    const token = await getToken();
    if (token) {
      config.headers = config.headers ?? {};
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
    const requestLeftDevice = response
      ? 'Yes (backend responded)'
      : request
        ? 'Yes (no response received)'
        : 'No (setup error before send)';

    // Retrieve active configuration variables dynamically on failure
    const networkInfo = getActiveNetworkInfo();

    console.error('============================================================');
    console.error('❌ API REQUEST ERROR DIAGNOSTICS');
    console.error(`• Endpoint:            ${endpoint}`);
    console.error(`• Method:              ${method}`);
    console.error(`• Request URL:         ${requestUrl}`);
    console.error(`• Base URL:            ${baseURL}`);
    console.error(`• Environment:         ${networkInfo.env.toUpperCase()}`);
    console.error(`• Selected Host:       ${networkInfo.host}`);
    console.error(`• Selected Port:       ${networkInfo.port}`);
    console.error(`• Status Code:         ${statusCode}`);
    console.error(`• Axios Error Code:    ${errorCode}`);
    console.error(`• Response Body:       ${responseBody}`);
    console.error(`• Request Timeout:     ${timeout}ms`);
    console.error(`• Authentication:      ${authState}`);
    console.error(`• Left Device:         ${requestLeftDevice}`);
    console.error(`• Backend Responded:   ${response ? 'Yes' : 'No'}`);
    console.error('============================================================');

    if (response?.status === 401) {
      await clearAll();
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
  const startTime = Date.now();
  try {
    const activeBaseUrl = getBaseUrl();
    const healthUrl = activeBaseUrl.replace('/api', '/health');
    const res = await axios.get(healthUrl, { timeout: 3000 });
    const responseTime = Date.now() - startTime;
    return { ok: true, status: res.data?.status || 'ok', responseTime };
  } catch (err) {
    const responseTime = Date.now() - startTime;
    return { ok: false, error: err, responseTime };
  }
};

export default api;
