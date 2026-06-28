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
import VitalisDivider from '../components/VitalisDivider';
import { Colors, Typography, Spacing } from '../theme';
import { authAPI } from '../services/api';
import { saveToken, saveUser } from '../utils/storage';
import Screens from '../constants/screens';

/**
 * LoginScreen — Vitalis login
 *
 * Matches the login design HTML:
 *   - "Move Better." headline
 *   - Email + Password inputs (standard variant with icons)
 *   - "Sign In →" primary CTA
 *   - Google sign-in button
 *   - "Create Account" footer link
 *
 * All auth logic preserved from original.
 */
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation (PRESERVED) ──
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

  // ── Submit (PRESERVED) ──
  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });
      const { token, userId, username } = response.data.data;

      await saveToken(token);
      await saveUser({ userId, username, email: email.trim().toLowerCase() });

      navigation.reset({
        index: 0,
        routes: [{ name: Screens.HOME }],
      });
    } catch (error) {
      console.log('=== LOGIN FAILURE DIAGNOSTICS ===');
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
        error.response?.data?.message || `Login failed: ${error.message}`;
      Alert.alert('Login Failed', message);
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
          {/* Header */}
          <View style={styles.header}>
            <VitalisLogo size={64} animate={false} />
            <Text style={styles.headline}>Move Better.</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <VitalisInput
              label="Email"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              variant="standard"
            />
            <VitalisInput
              label="Password"
              icon="lock"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
              rightLabel="Forgot?"
              onRightLabelPress={() => {/* future feature */}}
              variant="standard"
            />
          </View>

          {/* Primary CTA */}
          <View style={styles.actions}>
            <VitalisButton
              title="Sign In"
              icon="arrow-forward"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
            />
          </View>

          {/* Divider */}
          <VitalisDivider />

          {/* Google */}
          <View style={styles.social}>
            <VitalisButton
              title="Google"
              onPress={() => {/* Google sign-in placeholder */}}
              variant="google"
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
            </Text>
            <Text
              style={styles.footerLink}
              onPress={() => navigation.navigate(Screens.SIGNUP)}
            >
              Create Account
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: Spacing.marginMobile,
    gap: Spacing.md,
  },
  headline: {
    ...Typography.displayLgMobile,
    color: Colors.onSurface,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: Spacing.marginMobile,
    marginTop: Spacing.xl,
  },
  actions: {
    paddingHorizontal: Spacing.marginMobile,
    marginTop: Spacing.md,
  },
  social: {
    paddingHorizontal: Spacing.marginMobile,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  footerText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  footerLink: {
    ...Typography.bodyMd,
    fontFamily: 'HankenGrotesk_600SemiBold',
    color: Colors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(192,193,255,0.3)',
  },
});
