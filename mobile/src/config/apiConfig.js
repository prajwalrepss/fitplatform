import Constants from 'expo-constants';
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

// Memoized IP resolved dynamically at runtime
let resolvedIp = null;

/**
 * Dynamically resolves the base URL at runtime.
 * Evaluates hostUri, debuggerHost, __bundleURL and scriptURL lazily.
 */
export const getBaseUrl = () => {
  if (ENV === 'production') {
    return 'https://api.vitalis.fit/api';
  }

  if (resolvedIp) {
    return `http://${resolvedIp}:${PORT}/api`;
  }

  // Helper to extract IP from string and memoize it
  const parseIp = (input, sourceName) => {
    if (!input) return null;
    
    // Log the input check for debugging logs
    console.log(`[apiConfig] Checking source: ${sourceName} = "${input}"`);
    
    const match = input.match(/^(?:[a-z0-9\-.]+:\/\/)?([^:/]+)/i);
    if (match && match[1]) {
      const ip = match[1];
      // Only memoize if it's a valid local IP address and not localhost / loopback
      if (ip !== 'localhost' && ip !== '127.0.0.1' && ip !== '10.0.2.2') {
        resolvedIp = ip;
        console.log(`[apiConfig] Successfully resolved LAN IP via ${sourceName}: ${ip}`);
        return ip;
      }
    }
    return null;
  };

  // 1. Check expoConfig hostUri (most common in modern Expo)
  const hostUri = Constants.expoConfig?.hostUri;
  if (parseIp(hostUri, 'Constants.expoConfig.hostUri')) {
    return `http://${resolvedIp}:${PORT}/api`;
  }

  // 2. Check manifest2 extra expoGo debuggerHost
  const debuggerHost = Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (parseIp(debuggerHost, 'Constants.manifest2.extra.expoGo.debuggerHost')) {
    return `http://${resolvedIp}:${PORT}/api`;
  }

  // 3. Check global.__bundleURL
  const bundleURL = global.__bundleURL;
  if (parseIp(bundleURL, 'global.__bundleURL')) {
    return `http://${resolvedIp}:${PORT}/api`;
  }

  // 4. Check NativeModules.SourceCode.scriptURL
  try {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (parseIp(scriptURL, 'NativeModules.SourceCode.scriptURL')) {
      return `http://${resolvedIp}:${PORT}/api`;
    }
  } catch (_) {}

  // Fallbacks if scriptURL parser fails or is not yet initialized
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${PORT}/api`;
  }
  return `http://localhost:${PORT}/api`;
};

/**
 * Resolves current device model and brand to classify if it is an emulator or real device.
 */
export const getDeviceInfo = () => {
  const brand = Platform.constants?.Brand || 'Unknown Brand';
  const model = Platform.constants?.Model || 'Unknown Model';
  const isEmulator = 
    Platform.OS === 'android'
      ? (model.toLowerCase().includes('emulator') || model.toLowerCase().includes('sdk') || model.toLowerCase().includes('gphone'))
      : (model.toLowerCase().includes('simulator'));
      
  return {
    deviceName: `${brand} ${model}`,
    isEmulator,
    isDevice: !isEmulator,
  };
};

/**
 * Returns structured metadata about the active environment and resolved host.
 */
export const getActiveNetworkInfo = () => {
  const url = getBaseUrl();
  const match = url.match(/^(https?):\/\/([^:/]+)(?::(\d+))?/i);
  const info = getDeviceInfo();
  
  return {
    baseUrl: url,
    host: match ? match[2] : 'Unknown',
    port: match && match[3] ? Number(match[3]) : (url.startsWith('https') ? 443 : 80),
    env: ENV,
    deviceName: info.deviceName,
    isDevice: info.isDevice,
    isEmulator: info.isEmulator,
  };
};
