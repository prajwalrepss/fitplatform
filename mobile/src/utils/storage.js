import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_BYPASS_AUTH, MOCK_USER, MOCK_TOKEN } from '../config/dev';

const TOKEN_KEY = '@fitplatform_token';
const USER_KEY = '@fitplatform_user';

// ---------------------------------------------------------------------------
// Token
// ---------------------------------------------------------------------------
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async () => {
  // DEVELOPMENT AUTH BYPASS
  if (DEV_BYPASS_AUTH) {
    return MOCK_TOKEN;
  }

  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async () => {
  // DEVELOPMENT AUTH BYPASS
  if (DEV_BYPASS_AUTH) {
    return MOCK_USER;
  }

  try {
    const json = await AsyncStorage.getItem(USER_KEY);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// ---------------------------------------------------------------------------
// Clear all auth data
// ---------------------------------------------------------------------------
export const clearAll = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
