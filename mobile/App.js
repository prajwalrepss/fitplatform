import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useSpaceGrotesk,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  useFonts as useManrope,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';

import AuthNavigator from './navigation/AuthNavigator';
import { getToken } from './utils/storage';
import { authAPI } from './services/api';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');

  // ── Load fonts ──
  const [spaceGroteskLoaded] = useSpaceGrotesk({ SpaceGrotesk_700Bold });
  const [manropeLoaded] = useManrope({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  const fontsLoaded = spaceGroteskLoaded && manropeLoaded;

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getToken();
        if (token) {
          try {
            await authAPI.getMe();
            setInitialRoute('Dashboard');
          } catch {
            setInitialRoute('Login');
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
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <ActivityIndicator size="large" color="#8eff71" />
      </View>
    );
  }

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <NavigationContainer>
        <AuthNavigator initialRoute={initialRoute} />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
