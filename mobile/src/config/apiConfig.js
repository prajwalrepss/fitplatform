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

// Resolve the correct backend IP address or domain based on environment/device
const resolveHost = () => {
  if (ENV === 'production') {
    return 'api.vitalis.fit'; // Example production domain
  }

  // --- Development Mode ---
  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      // Robust regex matches http://, https://, exp:// protocols and grabs host IP
      const match = scriptURL.match(/^(?:https?|exp):\/\/([^:/]+)/i);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (err) {
    console.warn('[apiConfig] Error parsing scriptURL:', err);
  }

  // Fallbacks if scriptURL parser fails
  if (Platform.OS === 'android') {
    // Emulator loopback IP (maps to host localhost)
    return '10.0.2.2';
  }
  
  // iOS Simulator or default development machine LAN IP
  return '192.168.1.10';
};

export const HOST = resolveHost();

// Construct the complete Base API URL
export const BASE_URL = ENV === 'production'
  ? `https://${HOST}/api`
  : `http://${HOST}:${PORT}/api`;

console.log(`[apiConfig] Active Environment: ${ENV.toUpperCase()}`);
console.log(`[apiConfig] Target Host:         ${HOST}`);
console.log(`[apiConfig] Target Port:         ${PORT}`);
console.log(`[apiConfig] Configured Base URL: ${BASE_URL}`);
