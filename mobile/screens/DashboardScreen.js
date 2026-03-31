import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import NeonButton from '../components/NeonButton';
import { clearAll, getUser } from '../utils/storage';

export default function DashboardScreen({ navigation }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (user?.username) {
        setUsername(user.username);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await clearAll();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandName}>KINETIC</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Welcome Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['rgba(142, 255, 113, 0.08)', 'rgba(25, 25, 25, 0.9)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.cardInner}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="account" size={40} color="#8eff71" />
            </View>
            <Text style={styles.welcomeLabel}>WELCOME BACK</Text>
            <Text style={styles.usernameText}>
              {username || 'Athlete'}
            </Text>
            <Text style={styles.statusText}>
              🟢 Authentication Successful
            </Text>
          </View>
        </View>

        {/* Stats Preview */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="fire" size={28} color="#8eff71" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>WORKOUTS</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="trophy" size={28} color="#00f1fd" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>PRs</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="lightning-bolt" size={28} color="#d674ff" />
            <Text style={styles.statValue}>—</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
        </View>

        {/* Coming Soon */}
        <View style={styles.comingSoonCard}>
          <MaterialCommunityIcons name="rocket-launch" size={32} color="rgba(142, 255, 113, 0.4)" />
          <Text style={styles.comingSoonTitle}>DASHBOARD COMING SOON</Text>
          <Text style={styles.comingSoonSubtitle}>
            Workout tracking, analytics, and more
          </Text>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <NeonButton
            title="Logout"
            icon="logout"
            onPress={handleLogout}
            variant="ghost"
          />
        </View>
      </View>

      {/* Bottom Glow */}
      <LinearGradient
        colors={['transparent', 'rgba(142, 255, 113, 0.06)']}
        style={styles.bottomGlow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // ── Top Bar ──
  topBar: {
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  brandName: {
    fontSize: 24,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#8eff71',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },

  // ── Content ──
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  // ── Welcome Card ──
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1f1f1f',
    shadowColor: '#8eff71',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cardInner: {
    padding: 32,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(142, 255, 113, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: '#ababab',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    color: '#8eff71',
    marginTop: 12,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#131313',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#ababab',
  },

  // ── Coming Soon ──
  comingSoonCard: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#131313',
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  comingSoonTitle: {
    fontSize: 13,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  comingSoonSubtitle: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    color: '#ababab',
    textAlign: 'center',
  },

  // ── Logout ──
  logoutContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
    paddingTop: 20,
  },

  // ── Bottom Glow ──
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
});
