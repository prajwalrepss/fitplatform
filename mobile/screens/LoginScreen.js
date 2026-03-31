import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import InputField from '../components/InputField';
import NeonButton from '../components/NeonButton';
import { authAPI } from '../services/api';
import { saveToken, saveUser } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation ──
  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Invalid email format';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──
  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.login({ email: email.trim().toLowerCase(), password });
      const { token, userId, username } = response.data.data;

      await saveToken(token);
      await saveUser({ userId, username, email: email.trim().toLowerCase() });

      // Navigate to Dashboard — reset stack so user can't go "back" to login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Something went wrong. Please try again.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero Section ── */}
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={['rgba(142, 255, 113, 0.08)', 'transparent']}
              style={styles.heroAura}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            {/* Athlete Silhouettes */}
            <View style={styles.heroIllustration}>
              <LinearGradient
                colors={['rgba(142, 255, 113, 0.12)', 'rgba(0, 241, 253, 0.06)', 'transparent']}
                style={styles.heroGradient}
                start={{ x: 0.3, y: 0 }}
                end={{ x: 0.7, y: 1 }}
              />
              <View style={styles.heroIconCluster}>
                <MaterialCommunityIcons name="dumbbell" size={48} color="rgba(142, 255, 113, 0.3)" />
                <MaterialCommunityIcons name="lightning-bolt" size={64} color="rgba(142, 255, 113, 0.5)" style={{ marginHorizontal: 16 }} />
                <MaterialCommunityIcons name="arm-flex" size={48} color="rgba(142, 255, 113, 0.3)" />
              </View>
            </View>
            {/* Bottom fade to black */}
            <LinearGradient
              colors={['transparent', '#000000']}
              style={styles.heroFade}
            />
          </View>

          {/* ── Header ── */}
          <View style={styles.headerContainer}>
            <Text style={styles.headline}>
              WELCOME{' '}
              <Text style={styles.headlineAccent}>BACK</Text>
            </Text>
            <Text style={styles.subtitle}>
              Track your fitness. Build your strength.
            </Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.formContainer}>
            <InputField
              label="Email Address"
              icon="email-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <InputField
              label="Password"
              icon="lock-outline"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
            />

            {/* Forgot password */}
            <View style={styles.forgotRow}>
              <Text
                style={styles.forgotText}
                onPress={() => {
                  /* UI placeholder — future feature */
                }}
              >
                FORGOT PASSWORD?
              </Text>
            </View>
          </View>

          {/* ── Action Buttons ── */}
          <View style={styles.actionsContainer}>
            <NeonButton
              title="Login"
              icon="arrow-right"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
            />

            <NeonButton
              title="Create Account"
              onPress={() => navigation.navigate('Signup')}
              variant="ghost"
            />
          </View>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <View style={styles.dividerRow}>
              <LinearGradient
                colors={['transparent', 'rgba(72, 72, 72, 0.3)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dividerLine}
              />
              <Text style={styles.footerLabel}>Powered by KINETIC</Text>
              <LinearGradient
                colors={['transparent', 'rgba(72, 72, 72, 0.3)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dividerLine}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Bottom Ambient Glow ── */}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  // ── Hero ──
  heroContainer: {
    width: '100%',
    height: height * 0.38,
    position: 'relative',
    overflow: 'hidden',
  },
  heroAura: {
    ...StyleSheet.absoluteFillObject,
  },
  heroIllustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  heroIconCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },

  // ── Header ──
  headerContainer: {
    paddingHorizontal: 32,
    marginTop: -20,
  },
  headline: {
    fontSize: 36,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  headlineAccent: {
    color: '#8eff71',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Manrope_400Regular',
    color: '#ababab',
    marginTop: 6,
    letterSpacing: 0.5,
  },

  // ── Form ──
  formContainer: {
    paddingHorizontal: 32,
    marginTop: 32,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: 'rgba(142, 255, 113, 0.8)',
  },

  // ── Actions ──
  actionsContainer: {
    paddingHorizontal: 32,
    marginTop: 32,
  },

  // ── Footer ──
  footer: {
    marginTop: 'auto',
    paddingTop: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  footerLabel: {
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: 'rgba(171, 171, 171, 0.4)',
    marginHorizontal: 12,
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
