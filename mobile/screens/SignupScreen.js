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
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import InputField from '../components/InputField';
import NeonButton from '../components/NeonButton';
import { authAPI } from '../services/api';
import { saveToken, saveUser } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation ──
  const validate = () => {
    const errs = {};

    if (!username.trim()) {
      errs.username = 'Username is required';
    } else if (username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Invalid email format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──
  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      const { token, userId, username: uname } = response.data.data;

      await saveToken(token);
      await saveUser({ userId, username: uname, email: email.trim().toLowerCase() });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Signup Failed', message);
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
          {/* ── Fixed Header Bar ── */}
          <View style={styles.topBar}>
            <Text style={styles.brandName}>KINETIC</Text>
          </View>

          {/* ── Hero Image Area ── */}
          <View style={styles.heroContainer}>
            <LinearGradient
              colors={['rgba(142, 255, 113, 0.12)', 'rgba(0, 241, 253, 0.05)', 'transparent']}
              style={styles.heroGradient}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <View style={styles.heroCard}>
              <LinearGradient
                colors={['rgba(142, 255, 113, 0.06)', 'rgba(25, 25, 25, 0.9)']}
                style={styles.heroCardGradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
              {/* Illustrative Icons */}
              <View style={styles.heroIconRow}>
                <View style={styles.heroIconContainer}>
                  <MaterialCommunityIcons name="weight-lifter" size={56} color="rgba(142, 255, 113, 0.25)" />
                </View>
                <View style={styles.heroIconContainer}>
                  <MaterialCommunityIcons name="dumbbell" size={56} color="rgba(0, 241, 253, 0.25)" />
                </View>
              </View>
              {/* CTA Overlay */}
              <View style={styles.heroOverlay}>
                <Text style={styles.heroOverlayText}>JOIN THE FUTURE</Text>
                <Text style={styles.heroOverlaySubText}>OF FITNESS</Text>
              </View>
            </View>
          </View>

          {/* ── Headline ── */}
          <View style={styles.headlineContainer}>
            <Text style={styles.headline}>JOIN THE ELITE</Text>
            <Text style={styles.subtitle}>Start your fitness journey today.</Text>
          </View>

          {/* ── Registration Form ── */}
          <View style={styles.formContainer}>
            <InputField
              label="Username"
              icon="account-outline"
              value={username}
              onChangeText={setUsername}
              placeholder="elite_warrior"
              autoCapitalize="none"
              error={errors.username}
            />

            <InputField
              label="Email"
              icon="at"
              value={email}
              onChangeText={setEmail}
              placeholder="athlete@kinetic.com"
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

            <InputField
              label="Confirm Password"
              icon="shield-check-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>

          {/* ── CTA ── */}
          <View style={styles.ctaContainer}>
            <NeonButton
              title="Create Account"
              icon="lightning-bolt"
              onPress={handleSignup}
              loading={loading}
              variant="secondary"
            />
          </View>

          {/* ── Footer Link ── */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 60,
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

  // ── Hero ──
  heroContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    position: 'relative',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroCard: {
    width: '100%',
    aspectRatio: 1.3,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(25, 25, 25, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Subtle glow
    shadowColor: '#8eff71',
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  heroCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroIconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 20,
  },
  heroIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 31, 31, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    alignItems: 'center',
  },
  heroOverlayText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  heroOverlaySubText: {
    fontSize: 12,
    fontFamily: 'Manrope_700Bold',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },

  // ── Headline ──
  headlineContainer: {
    paddingHorizontal: 24,
    marginTop: 28,
    alignItems: 'center',
  },
  headline: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Manrope_500Medium',
    color: '#ababab',
    marginTop: 8,
    textAlign: 'center',
  },

  // ── Form ──
  formContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },

  // ── CTA ──
  ctaContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
  },

  // ── Footer ──
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 15,
    fontFamily: 'Manrope_500Medium',
    color: '#ababab',
  },
  footerLink: {
    fontSize: 15,
    fontFamily: 'Manrope_700Bold',
    color: '#00f1fd',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(0, 241, 253, 0.3)',
  },
});
