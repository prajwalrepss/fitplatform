import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import VitalisLogo from '../components/VitalisLogo';
import VitalisInput from '../components/VitalisInput';
import VitalisButton from '../components/VitalisButton';
import VitalisCard from '../components/VitalisCard';
import { Colors, Typography, Spacing } from '../theme';
import { authAPI } from '../services/api';
import { saveToken, saveUser } from '../utils/storage';
import Screens from '../constants/screens';

/**
 * SignupScreen — Vitalis sign-up
 *
 * Matches the signup design HTML:
 *   - Glass-panel card container
 *   - Vitalis logo mark
 *   - "Train Smarter." headline
 *   - Full Name / Email / Password stacked inputs
 *   - "Join Vitalis →" primary CTA
 *   - "Sign In" footer link
 *
 * All registration logic preserved from original.
 */
export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation (PRESERVED) ──
  const validate = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Full name is required';
    } else if (username.trim().length < 3) {
      errs.username = 'Name must be at least 3 characters';
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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit (PRESERVED) ──
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
        routes: [{ name: Screens.HOME }],
      });
    } catch (error) {
      console.log('=== SIGNUP FAILURE DIAGNOSTICS ===');
      if (error.config) {
        console.log(`Request URL: ${error.config.url}`);
        console.log(`Request Method: ${error.config.method?.toUpperCase()}`);
        console.log(`Request Payload: ${error.config.data}`);
      }
      if (error.response) {
        console.log(`Response Status: ${error.response.status}`);
        console.log(`Response Body: ${JSON.stringify(error.response.data)}`);
      } else {
        console.log('No Response received from server.');
      }
      console.log(`Thrown Exception: ${error.message}`);
      console.log('==================================');

      const message =
        error.response?.data?.message || `Registration failed: ${error.message}`;
      Alert.alert('Signup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardWrapper}>
            <VitalisCard>
              {/* Logo & Header */}
              <View style={styles.header}>
                <VitalisLogo size={64} animate={false} />
                <Text style={styles.headline}>Train Smarter.</Text>
                <Text style={styles.subtitle}>
                  Create your Vitalis identity.
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <VitalisInput
                  label="Full Name"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Alex Mercer"
                  autoCapitalize="words"
                  error={errors.username}
                  variant="stacked"
                />
                <VitalisInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="alex@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  variant="stacked"
                />
                <VitalisInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  error={errors.password}
                  variant="stacked"
                />
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <VitalisButton
                  title="Join Vitalis"
                  icon="arrow-forward"
                  onPress={handleSignup}
                  loading={loading}
                  variant="primary"
                />
                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>
                    Already have an account?{' '}
                  </Text>
                  <Text
                    style={styles.footerLink}
                    onPress={() => navigation.navigate(Screens.LOGIN)}
                  >
                    Sign In
                  </Text>
                </View>
              </View>
            </VitalisCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  cardWrapper: {
    paddingHorizontal: Spacing.marginMobile,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  headline: {
    ...Typography.displayLgMobile,
    color: Colors.onSurface,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  form: {
    marginTop: Spacing.sm,
  },
  actions: {
    marginTop: Spacing.sm,
    gap: Spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  footerLink: {
    ...Typography.bodyMd,
    color: Colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(192,193,255,0.3)',
  },
});
