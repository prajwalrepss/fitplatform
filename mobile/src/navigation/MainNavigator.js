import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import TrainingStyleDiscoveryScreen from '../screens/TrainingStyleDiscoveryScreen';
import TrainingIntelScreen from '../screens/TrainingIntelScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors, Typography } from '../theme';
import Screens from '../constants/screens';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerLow,
          borderTopWidth: 1,
          borderTopColor: 'rgba(128, 131, 255, 0.08)',
          height: 72,
          paddingBottom: 16,
          paddingTop: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarLabelStyle: {
          ...Typography.labelCaps,
          fontSize: 9,
          letterSpacing: 1,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'help';
          if (route.name === Screens.TAB_HOME) {
            iconName = 'home';
          } else if (route.name === Screens.TAB_WORKOUT) {
            iconName = 'fitness-center';
          } else if (route.name === Screens.TAB_AI) {
            iconName = 'psychology';
          } else if (route.name === Screens.TAB_INTEL) {
            iconName = 'bar-chart';
          } else if (route.name === Screens.TAB_PROFILE) {
            iconName = 'person-pin';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={Screens.TAB_HOME}
        component={TrainingStyleDiscoveryScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name={Screens.TAB_INTEL}
        component={TrainingIntelScreen}
        options={{ title: 'Intelligence' }}
      />
      <Tab.Screen
        name={Screens.TAB_PROFILE}
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

