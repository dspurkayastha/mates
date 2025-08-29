/**
 * Modern Login Screen with Biometric Authentication
 * Premium 2025 design with comprehensive authentication options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../design-system/ThemeProvider';
import { generateAccessibilityLabel } from '../utils/accessibility';
import { 
  biometricAuthManager,
  isBiometricAuthAvailable,
  authenticateWithBiometrics,
} from '../utils/biometricAuth';
import {
  Text,
  GlassButton,
  GlassCard,
  Icon,
  BiometricPrompt,
  BiometricSetup,
} from '../components/ui';

// ============================================================================
// TYPES
// ============================================================================

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onShowRegister?: () => void;
  style?: any;
}

interface LoginFormData {
  email: string;
  password: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onShowRegister,
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // State
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);

  // Animations
  const logoScale = useSharedValue(0.8);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  const biometricButtonScale = useSharedValue(1);

  // Initialize animations and biometric check
  useEffect(() => {
    const initialize = async () => {
      // Animate logo
      logoScale.value = withSpring(1, { damping: 20, stiffness: 150 });
      
      // Animate form
      setTimeout(() => {
        formOpacity.value = withTiming(1, { duration: 600 });
        formTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      }, 200);

      // Check biometric availability
      const available = await isBiometricAuthAvailable();
      setBiometricAvailable(available);
    };

    initialize();
  }, []);

  // Animation styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const biometricButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: biometricButtonScale.value }],
  }));

  // Handlers
  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any email/password
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onLoginSuccess();
    } catch (error) {
      setError('Login failed. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    biometricButtonScale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );

    setShowBiometricPrompt(true);
  };

  const handleBiometricSuccess = () => {
    setShowBiometricPrompt(false);
    onLoginSuccess();
  };

  const handleBiometricError = (error: string) => {
    setError(error);
    setShowBiometricPrompt(false);
  };

  const handleBiometricCancel = () => {
    setShowBiometricPrompt(false);
  };

  const handleSetupBiometric = () => {
    setShowBiometricSetup(true);
  };

  const handleBiometricSetupComplete = (success: boolean) => {
    setShowBiometricSetup(false);
    if (success) {
      setBiometricAvailable(true);
      setError('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.interactive.primary, colors.interactive.primaryHover]}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: tokens.Spacing['2xl'],
          }}
          keyboardShouldPersistTaps="handled"
          accessible={false}
        >
          {/* Logo Section */}
          <Animated.View
            style={[
              {
                alignItems: 'center',
                marginBottom: tokens.Spacing['4xl'],
              },
              logoAnimatedStyle,
            ]}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel={generateAccessibilityLabel.status('header', 'Mates App Login')}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.background.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: tokens.Spacing.lg,
                shadowColor: colors.text.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 8,
              }}
              accessibilityElementsHidden
            >
              <Icon
                name="House"
                size="2xl"
                color="brand"
              />
            </View>
            
            <Text
              variant="displayMedium"
              color="inverse"
              weight="bold"
              align="center"
              style={{ marginBottom: tokens.Spacing.sm }}
            >
              Welcome Back
            </Text>
            
            <Text
              variant="bodyLarge"
              color="inverse"
              align="center"
              style={{ opacity: 0.9 }}
            >
              Sign in to your Mates account
            </Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View
            style={[formAnimatedStyle]}
          >
            <GlassCard
              variant="translucent"
              size="large"
              style={{
                padding: tokens.Spacing['3xl'],
              }}
              accessible={true}
              accessibilityRole="none"
              accessibilityLabel={generateAccessibilityLabel.status('form', 'Login form')}
            >
              {/* Error Message */}
              {error ? (
                <View
                  style={{
                    backgroundColor: colors.status.errorBackground,
                    borderRadius: tokens.BorderRadius.md,
                    padding: tokens.Spacing.md,
                    marginBottom: tokens.Spacing.lg,
                  }}
                  accessibilityRole="alert"
                >
                  <Text
                    variant="bodySmall"
                    color="error"
                    align="center"
                  >
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Email Input */}
              <View style={{ marginBottom: tokens.Spacing.lg }}>
                <Text
                  variant="labelMedium"
                  color="primary"
                  weight="medium"
                  style={{ marginBottom: tokens.Spacing.sm }}
                >
                  Email Address
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border.medium,
                    borderRadius: tokens.BorderRadius.lg,
                    padding: tokens.Spacing.lg,
                    backgroundColor: colors.background.secondary,
                  }}
                >
                  {/* Note: In a real app, you'd use TextInput here */}
                  <Text
                    variant="bodyMedium"
                    color="tertiary"
                  >
                    demo@mates.app
                  </Text>
                </View>
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: tokens.Spacing['2xl'] }}>
                <Text
                  variant="labelMedium"
                  color="primary"
                  weight="medium"
                  style={{ marginBottom: tokens.Spacing.sm }}
                >
                  Password
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border.medium,
                    borderRadius: tokens.BorderRadius.lg,
                    padding: tokens.Spacing.lg,
                    backgroundColor: colors.background.secondary,
                  }}
                >
                  <Text
                    variant="bodyMedium"
                    color="tertiary"
                  >
                    ••••••••
                  </Text>
                </View>
              </View>

              {/* Login Button */}
              <GlassButton
                variant="primary"
                buttonStyle="tinted"
                size="large"
                fullWidth
                onPress={handleEmailLogin}
                loading={isLoading}
                style={{ marginBottom: tokens.Spacing.lg }}
                accessibilityLabel="Sign in with email and password"
              >
                Sign In
              </GlassButton>

              {/* Biometric Login */}
              {biometricAvailable && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: tokens.Spacing.lg,
                    }}
                    accessibilityElementsHidden
                  >
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: colors.border.light,
                      }}
                    />
                    <Text
                      variant="bodySmall"
                      color="tertiary"
                      style={{
                        marginHorizontal: tokens.Spacing.md,
                      }}
                    >
                      or
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: colors.border.light,
                      }}
                    />
                  </View>

                  <Animated.View style={biometricButtonAnimatedStyle}>
                    <GlassButton
                      variant="secondary"
                      buttonStyle="outlined"
                      size="large"
                      fullWidth
                      onPress={handleBiometricLogin}
                      leftIcon={
                        <Icon name="Fingerprint" size="sm" color="brand" />
                      }
                      accessibilityLabel="Sign in with biometric authentication"
                    >
                      Use Biometric
                    </GlassButton>
                  </Animated.View>
                </>
              )}

              {/* Setup Biometric */}
              {!biometricAvailable && (
                <GlassButton
                  variant="tertiary"
                  buttonStyle="plain"
                  size="medium"
                  fullWidth
                  onPress={handleSetupBiometric}
                  leftIcon={
                    <Icon name="Shield" size="sm" color="brand" />
                  }
                  style={{ marginTop: tokens.Spacing.md }}
                  accessibilityLabel="Set up biometric authentication"
                >
                  Enable Biometric Login
                </GlassButton>
              )}

              {/* Register Link */}
              {onShowRegister && (
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: tokens.Spacing['2xl'],
                  }}
                >
                  <Text
                    variant="bodyMedium"
                    color="secondary"
                    style={{ marginBottom: tokens.Spacing.sm }}
                  >
                    Don't have an account?
                  </Text>
                  <GlassButton
                    variant="tertiary"
                    buttonStyle="plain"
                    size="small"
                    onPress={onShowRegister}
                    accessibilityLabel="Create new account"
                  >
                    Create Account
                  </GlassButton>
                </View>
              )}
            </GlassCard>
          </Animated.View>
        </ScrollView>

        {/* Biometric Prompt Modal */}
        <BiometricPrompt
          visible={showBiometricPrompt}
          onSuccess={handleBiometricSuccess}
          onError={handleBiometricError}
          onCancel={handleBiometricCancel}
          options={{
            promptMessage: 'Sign in to Mates',
            cancelLabel: 'Cancel',
            fallbackLabel: 'Use Password',
          }}
        />

        {/* Biometric Setup Modal */}
        {showBiometricSetup && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              padding: tokens.Spacing.lg,
            }}
          >
            <BiometricSetup
              onSetupComplete={handleBiometricSetupComplete}
              onCancel={() => setShowBiometricSetup(false)}
            />
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;