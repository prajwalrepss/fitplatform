import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  HankenGrotesk_400Regular,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
} from '@expo-google-fonts/hanken-grotesk';

import RootNavigator from './src/navigation/RootNavigator';
import { getToken } from './src/utils/storage';
import { authAPI } from './src/services/api';
import Screens from './src/constants/screens';
import { Colors } from './src/theme';
import { DEV_BYPASS_AUTH } from './src/config/dev';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState(Screens.LOGIN);

  // ── Load Hanken Grotesk fonts (Vitalis design system) ──
  const [fontsLoaded] = useFonts({
    HankenGrotesk_400Regular,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_800ExtraBold,
  });

  useEffect(() => {
    async function checkAuth() {
      // DEVELOPMENT AUTH BYPASS
      if (DEV_BYPASS_AUTH) {
        setInitialRoute(Screens.HOME);
        setAppReady(true);
        return;
      }

      try {
        const token = await getToken();
        if (token) {
          try {
            await authAPI.getMe();
            setInitialRoute(Screens.HOME);
          } catch {
            setInitialRoute(Screens.LOGIN);
          }
        }
      } catch (error) {
        console.warn('Auth check error:', error);
      } finally {
        setAppReady(true);
      }
    }

    if (fontsLoaded) {
      checkAuth();
    }
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  // ── Loading state ──
  if (!appReady || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <NavigationContainer>
        <RootNavigator initialRoute={initialRoute} />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
