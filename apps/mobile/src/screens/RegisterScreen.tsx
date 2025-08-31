import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../design-system/ThemeProvider';
import {
  Text,
  GlassButton,
  GlassCard,
  GlassInput,
  Icon,
} from '../components/ui';
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onShowLogin?: () => void;
  style?: any;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onShowLogin,
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!formData.email || !formData.password || formData.password !== formData.confirmPassword) {
      setError('Please enter matching email and passwords');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (SUPABASE_ENABLED) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (signUpError) throw signUpError;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onRegisterSuccess();
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: tokens.Spacing.xl,
          }}
        >
          <GlassCard variant="translucent" size="large" style={{ width: '100%' }}>
            <View style={{ padding: tokens.Spacing.xl }}>
              <Text
                variant="headlineSmall"
                weight="bold"
                style={{ marginBottom: tokens.Spacing.xl }}
                align="center"
              >
                Create Account
              </Text>

              <GlassInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                variant="default"
                size="large"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginBottom: tokens.Spacing.lg }}
                leftIcon={<Icon name="Mail" size="sm" color="secondary" />}
              />

              <GlassInput
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                variant="default"
                size="large"
                secureTextEntry
                style={{ marginBottom: tokens.Spacing.lg }}
                leftIcon={<Icon name="Lock" size="sm" color="secondary" />}
              />

              <GlassInput
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                variant="default"
                size="large"
                secureTextEntry
                style={{ marginBottom: tokens.Spacing.xl }}
                leftIcon={<Icon name="Check" size="sm" color="secondary" />}
              />

              {error ? (
                <Text
                  variant="bodySmall"
                  color="danger"
                  style={{ marginBottom: tokens.Spacing.md }}
                  align="center"
                >
                  {error}
                </Text>
              ) : null}

              <GlassButton
                variant="primary"
                buttonStyle="filled"
                size="large"
                fullWidth
                onPress={handleRegister}
                disabled={isLoading}
                accessibilityLabel="Create account"
                style={{ marginBottom: tokens.Spacing.lg }}
              >
                Sign Up
              </GlassButton>

              {onShowLogin && (
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: tokens.Spacing.md,
                  }}
                >
                  <Text
                    variant="bodyMedium"
                    color="secondary"
                    style={{ marginBottom: tokens.Spacing.sm }}
                  >
                    Already have an account?
                  </Text>
                  <GlassButton
                    variant="tertiary"
                    buttonStyle="plain"
                    size="small"
                    onPress={onShowLogin}
                    accessibilityLabel="Go to sign in"
                  >
                    Sign In
                  </GlassButton>
                </View>
              )}
            </View>
          </GlassCard>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

