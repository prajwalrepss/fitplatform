import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MainNavigator from './MainNavigator';
import WorkoutSessionScreen from '../screens/WorkoutSessionScreen';
import WorkoutSummaryScreen from '../screens/WorkoutSummaryScreen';
import WorkoutPlanScreen from '../screens/WorkoutPlanScreen';
import { Colors } from '../theme';
import Screens from '../constants/screens';

const Stack = createNativeStackNavigator();

/**
 * RootNavigator — Main stack navigator for the app.
 *
 * Handles transition from Splash -> Login/Signup or Main tab container,
 * as well as opening full-screen workout sessions and summaries.
 */
export default function RootNavigator({ initialRoute = Screens.LOGIN }) {
  return (
    <Stack.Navigator
      initialRouteName={Screens.SPLASH}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name={Screens.SPLASH}
        component={SplashScreen}
        initialParams={{ nextScreen: initialRoute }}
      />
      <Stack.Screen name={Screens.LOGIN} component={LoginScreen} />
      <Stack.Screen name={Screens.SIGNUP} component={SignupScreen} />
      <Stack.Screen
        name={Screens.HOME}
        component={MainNavigator}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={Screens.WORKOUT_SESSION}
        component={WorkoutSessionScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={Screens.WORKOUT_SUMMARY}
        component={WorkoutSummaryScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={Screens.WORKOUT_PLAN}
        component={WorkoutPlanScreen}
      />
    </Stack.Navigator>
  );
}
