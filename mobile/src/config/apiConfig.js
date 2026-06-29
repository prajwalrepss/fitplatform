import { NativeModules, Platform } from 'react-native';

/**
 * apiConfig.js
 * Centralized API configuration layer for Vitalis Mobile.
 * Manages hosts, ports, and environment environments.
 */

// Active Environment: 'development' | 'production' | 'staging'
export const ENV = __DEV__ ? 'development' : 'production';

// Target Port for the backend Express server
export const PORT = 5000;

// Memoized IP resolved dynamically at runtime (avoids bridge initialization race condition)
let resolvedIp = null;

/**
 * Dynamically resolves the base URL at runtime.
 * Evaluates NativeModules.SourceCode.scriptURL lazily during request interceptors,
 * ensuring the React Native native-bridge is fully initialized.
 */
export const getBaseUrl = () => {
  if (ENV === 'production') {
    return 'https://api.vitalis.fit/api';
  }

  // --- Development Mode ---
  if (resolvedIp) {
    return `http://${resolvedIp}:${PORT}/api`;
  }

  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      // Robust regex matches http://, https://, exp:// protocols and extracts host IP
      const match = scriptURL.match(/^(?:https?|exp):\/\/([^:/]+)/i);
      if (match && match[1]) {
        const ip = match[1];
        // Only memoize if it's a valid local IP address and not localhost / loopback
        if (ip !== 'localhost' && ip !== '127.0.0.1' && ip !== '10.0.2.2') {
          resolvedIp = ip;
          console.log(`[apiConfig] Resolved dev server IP dynamically: ${ip}`);
          return `http://${ip}:${PORT}/api`;
        }
      }
    }
  } catch (err) {
    console.warn('[apiConfig] Error parsing scriptURL:', err);
  }

  // Fallbacks if scriptURL parser fails or is not yet initialized
  if (Platform.OS === 'android') {
    // Emulator loopback IP (maps to host localhost)
    return `http://10.0.2.2:${PORT}/api`;
  }
  
  // iOS Simulator or default development machine LAN IP
  return `http://localhost:${PORT}/api`;
};

/**
 * Returns structured metadata about the currently active environment and resolved host.
 * Safely runs on-demand for accurate real-time logging diagnostics.
 */
export const getActiveNetworkInfo = () => {
  const url = getBaseUrl();
  const match = url.match(/^(https?):\/\/([^:/]+)(?::(\d+))?/i);
  return {
    baseUrl: url,
    host: match ? match[2] : 'Unknown',
    port: match && match[3] ? Number(match[3]) : (url.startsWith('https') ? 443 : 80),
    env: ENV,
  };
};
