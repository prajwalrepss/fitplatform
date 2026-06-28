import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenBackground from '../components/ScreenBackground';
import VitalisCard from '../components/VitalisCard';
import VitalisButton from '../components/VitalisButton';
import { Colors, Typography, Spacing } from '../theme';
import { getUser, clearAll } from '../utils/storage';
import Screens from '../constants/screens';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
    })();
  }, []);

  const handleLogout = async () => {
    await clearAll();
    navigation.reset({
      index: 0,
      routes: [{ name: Screens.LOGIN }],
    });
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Account Details' },
    { icon: 'notifications-none', label: 'Notifications' },
    { icon: 'lock-outline', label: 'Security & Privacy' },
    { icon: 'help-outline', label: 'Support & Help' },
  ];

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.username}>{user?.username || 'Athlete'}</Text>
          <Text style={styles.email}>{user?.email || 'athlete@vitalis.fit'}</Text>
        </View>

        {/* Stats card */}
        <View style={styles.section}>
          <VitalisCard variant="solid" style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statCol}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Active PRs</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statCol}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Streak (Days)</Text>
            </View>
          </VitalisCard>
        </View>

        {/* Settings List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <VitalisCard variant="solid" style={styles.menuCard}>
            {menuItems.map((item, i) => (
              <Pressable
                key={i}
                style={[
                  styles.menuItem,
                  i < menuItems.length - 1 && styles.menuItemBorder,
                ]}
              >
                <MaterialIcons name={item.icon} size={22} color={Colors.onSurfaceVariant} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <MaterialIcons name="chevron-right" size={20} color={Colors.outlineVariant} />
              </Pressable>
            ))}
          </VitalisCard>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutWrapper}>
          <VitalisButton
            title="Log Out"
            icon="logout"
            onPress={handleLogout}
            variant="outline"
          />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 50 },
  header: {
    paddingTop: 64,
    paddingHorizontal: Spacing.marginMobile,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(128, 131, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.2)',
  },
  username: { ...Typography.headlineLg, color: Colors.onSurface },
  email: { ...Typography.caption, color: Colors.onSurfaceVariant, marginTop: 4 },
  section: { paddingHorizontal: Spacing.marginMobile, marginBottom: Spacing.lg },
  sectionTitle: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    letterSpacing: 3,
    marginBottom: Spacing.md,
  },
  statsCard: {
    flexDirection: 'row',
    paddingVertical: Spacing.lg,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statCol: { alignItems: 'center' },
  statValue: { ...Typography.headlineSm, color: Colors.primary },
  statLabel: { ...Typography.caption, color: Colors.onSurfaceVariant, fontSize: 10, marginTop: 2 },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.outlineVariant,
  },
  menuCard: { paddingVertical: 0 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  menuLabel: { ...Typography.bodyMd, color: Colors.onSurface, flex: 1 },
  logoutWrapper: {
    paddingHorizontal: Spacing.marginMobile,
    marginTop: Spacing.md,
  },
});
