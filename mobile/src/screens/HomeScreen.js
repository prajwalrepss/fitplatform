import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import VitalisCard from '../components/VitalisCard';
import VitalisButton from '../components/VitalisButton';
import BodyEngine from '../components/BodyEngine';
import { Colors, Typography, Spacing } from '../theme';
import { getUser } from '../utils/storage';
import Screens from '../constants/screens';

/**
 * HomeScreen — Main dashboard
 */
export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (user?.username) setUsername(user.username);
    })();
  }, []);

  const stats = [
    { icon: 'local-fire-department', value: '0', label: 'WORKOUTS', color: Colors.primaryContainer },
    { icon: 'emoji-events', value: '0', label: 'PRS', color: Colors.primary },
    { icon: 'bolt', value: '—', label: 'STREAK', color: Colors.primaryFixedDim },
  ];

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.brandName}>Vitalis</Text>
          <Pressable
            onPress={() => navigation.navigate(Screens.TAB_PROFILE)}
            style={styles.avatarButton}
          >
            <MaterialIcons name="person" size={24} color={Colors.onSurfaceVariant} />
          </Pressable>
        </View>

        {/* Welcome Card */}
        <VitalisCard style={styles.welcomeCard}>
          <View style={styles.welcomeInner}>
            <View style={styles.avatarCircle}>
              <MaterialIcons name="person" size={36} color={Colors.primaryContainer} />
            </View>
            <Text style={styles.welcomeLabel}>WELCOME BACK</Text>
            <Text style={styles.usernameText}>{username || 'Athlete'}</Text>
          </View>
        </VitalisCard>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <VitalisCard key={i} variant="solid" style={styles.statCard}>
              <MaterialIcons name={stat.icon} size={26} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </VitalisCard>
          ))}
        </View>

        {/* Body Engine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR BODY</Text>
          <BodyEngine style={styles.bodyEngine} />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <VitalisButton
            title="Start Workout"
            icon="play-arrow"
            onPress={() => navigation.navigate(Screens.TAB_WORKOUT)}
            variant="primary"
          />
          <VitalisButton
            title="AI Coach"
            icon="smart-toy"
            onPress={() => navigation.navigate(Screens.TAB_AI)}
            variant="outline"
          />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.marginMobile,
  },
  brandName: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeCard: {
    marginHorizontal: Spacing.marginMobile,
    marginBottom: Spacing.md,
  },
  welcomeInner: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(128, 131, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  welcomeLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    letterSpacing: 3,
  },
  usernameText: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.sm + 4,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  statValue: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  statLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 9,
    letterSpacing: 2,
  },
  section: {
    paddingHorizontal: Spacing.marginMobile,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    letterSpacing: 3,
    marginBottom: Spacing.md,
  },
  bodyEngine: {
    minHeight: 200,
  },
  quickActions: {
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.sm + 4,
  },
});
