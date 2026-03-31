import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();

/**
 * AuthNavigator — Stack navigator for the auth flow.
 *
 * Login ↔ Signup → Dashboard
 *
 * Props:
 *   initialRoute - 'Login' | 'Dashboard' (determined by App.js based on stored token)
 */
export default function AuthNavigator({ initialRoute = 'Login' }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ gestureEnabled: false }} // prevent swipe-back to login
      />
    </Stack.Navigator>
  );
}
