import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@fitplatform_token';
const USER_KEY = '@fitplatform_user';

const normalizeToken = (token) => {
  if (typeof token !== 'string') {
    return null;
  }

  const normalized = token.replace(/^Bearer\s+/i, '').trim();
  return normalized.length > 0 ? normalized : null;
};

// ---------------------------------------------------------------------------
// Token
// ---------------------------------------------------------------------------
export const saveToken = async (token) => {
  try {
    const normalized = normalizeToken(token);
    if (!normalized) {
      await AsyncStorage.removeItem(TOKEN_KEY);
      return;
    }

    await AsyncStorage.setItem(TOKEN_KEY, normalized);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
    const normalized = normalizeToken(storedToken);

    if (storedToken && storedToken !== normalized) {
      if (normalized) {
        await AsyncStorage.setItem(TOKEN_KEY, normalized);
      } else {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
    }

    return normalized;
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
