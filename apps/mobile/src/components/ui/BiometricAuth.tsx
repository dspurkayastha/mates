/**
 * Biometric Authentication Components
 * Modern UI components for biometric authentication with accessibility
 * Supports Face ID, Touch ID, and Fingerprint authentication
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ViewStyle,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import { generateAccessibilityLabel } from '../../utils/accessibility';
import Text from './Text';
import Button from './Button';
import Icon from './Icon';
import Card from './Card';
import {
  biometricAuthManager,
  BiometricCapabilities,
  BiometricAuthResult,
  BiometricAuthOptions,
} from '../../utils/biometricAuth';

// ============================================================================
// TYPES
// ============================================================================

interface BiometricPromptProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onError: (error: string) => void;
  options?: BiometricAuthOptions;
  style?: ViewStyle;
}

interface BiometricSetupProps {
  onSetupComplete: (success: boolean) => void;
  onCancel: () => void;
  style?: ViewStyle;
}

interface BiometricStatusProps {
  onToggle: (enabled: boolean) => void;
  style?: ViewStyle;
}

// ============================================================================
// BIOMETRIC PROMPT COMPONENT
// ============================================================================

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  visible,
  onSuccess,
  onCancel,
  onError,
  options = {},
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [capabilities, setCapabilities] = useState<BiometricCapabilities | null>(null);
  
  const scale = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.3);

  // Initialize capabilities
  useEffect(() => {
    const initCapabilities = async () => {
      const caps = await biometricAuthManager.initialize();
      setCapabilities(caps);
    };
    initCapabilities();
  }, []);

  // Animate modal appearance
  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
      
      // Start pulse animation
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  // Perform authentication
  const performAuthentication = async () => {
    if (isAuthenticating || !capabilities?.isAvailable) return;

    setIsAuthenticating(true);
    
    try {
      // Scale down icon to indicate authentication start
      iconScale.value = withSpring(0.8, { damping: 15 });
      
      const result = await biometricAuthManager.authenticate(options);
      
      if (result.success) {
        // Success animation
        iconScale.value = withSequence(
          withSpring(1.2, { damping: 15 }),
          withSpring(1, { damping: 15 })
        );
        
        setTimeout(() => {
          runOnJS(onSuccess)();
        }, 300);
      } else {
        // Error animation
        iconScale.value = withSequence(
          withSpring(1.1, { damping: 10 }),
          withSpring(0.9, { damping: 10 }),
          withSpring(1, { damping: 15 })
        );
        
        if (result.error) {
          runOnJS(onError)(result.error);
        }
      }
    } catch (error) {
      runOnJS(onError)('Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Auto-trigger authentication when modal becomes visible
  useEffect(() => {
    if (visible && capabilities?.isAvailable) {
      const timer = setTimeout(performAuthentication, 500);
      return () => clearTimeout(timer);
    }
  }, [visible, capabilities]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: interpolate(pulseOpacity.value, [0.3, 0.8], [1, 1.2]) }],
  }));

  const getBiometricIcon = () => {
    if (!capabilities?.supportedTypes.length) return 'Shield';
    
    const primaryType = capabilities.supportedTypes[0];
    switch (primaryType) {
      case 1: // FINGERPRINT
        return 'Fingerprint';
      case 2: // FACIAL_RECOGNITION
        return 'ScanFace';
      default:
        return 'Shield';
    }
  };

  const getBiometricTitle = () => {
    if (!capabilities?.supportedTypes.length) return 'Authenticate';
    
    const typeNames = biometricAuthManager.getBiometricTypeNames();
    return `Use ${typeNames[0]}`;
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: tokens.Spacing['2xl'],
        }}
        accessible={false}
      >
        <Animated.View style={[modalAnimatedStyle, style]}>
          <Card
            variant="elevated"
            style={{
              width: Math.min(Dimensions.get('window').width - 64, 320),
              padding: tokens.Spacing['3xl'],
              alignItems: 'center',
            }}
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel={generateAccessibilityLabel.status('dialog', 'Biometric authentication')}
          >
            {/* Pulse Background */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: colors.interactive.primary,
                  top: tokens.Spacing['3xl'] + 20,
                },
                pulseAnimatedStyle,
              ]}
              accessibilityElementsHidden
            />
            
            {/* Icon */}
            <Animated.View
              style={[
                {
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.interactive.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: tokens.Spacing['2xl'],
                  zIndex: 1,
                },
                iconAnimatedStyle,
              ]}
              accessible={false}
            >
              <Icon
                name={getBiometricIcon()}
                size="xl"
                color="inverse"
                accessibilityElementsHidden
              />
            </Animated.View>

            {/* Title */}
            <Text
              variant="titleLarge"
              color="primary"
              weight="semibold"
              align="center"
              style={{ marginBottom: tokens.Spacing.md }}
              accessibilityRole="header"
            >
              {getBiometricTitle()}
            </Text>

            {/* Description */}
            <Text
              variant="bodyMedium"
              color="secondary"
              align="center"
              style={{ 
                marginBottom: tokens.Spacing['2xl'],
                maxWidth: 240,
                lineHeight: tokens.Typography.body.medium.lineHeight * 1.2,
              }}
            >
              {options.promptMessage || 'Place your finger on the sensor or look at your device to continue'}
            </Text>

            {/* Status */}
            {isAuthenticating && (
              <Text
                variant="bodySmall"
                color="brand"
                align="center"
                style={{ 
                  marginBottom: tokens.Spacing.lg,
                  opacity: 0.8,
                }}
              >
                Authenticating...
              </Text>
            )}

            {/* Actions */}
            <View
              style={{
                flexDirection: 'row',
                gap: tokens.Spacing.md,
                width: '100%',
              }}
              accessibilityRole="button"
              accessibilityLabel="Authentication actions"
            >
              <Button
                variant="secondary"
                size="medium"
                fullWidth
                onPress={onCancel}
                accessibilityLabel="Cancel authentication"
              >
                {options.cancelLabel || 'Cancel'}
              </Button>
              
              {!options.disableDeviceFallback && (
                <Button
                  variant="tertiary"
                  size="medium"
                  fullWidth
                  onPress={() => {
                    onCancel();
                    // You could implement passcode fallback here
                  }}
                  accessibilityLabel="Use device passcode instead"
                >
                  {options.fallbackLabel || 'Passcode'}
                </Button>
              )}
              
              <Button
                variant="primary"
                size="medium"
                fullWidth
                onPress={performAuthentication}
                loading={isAuthenticating}
                disabled={!capabilities?.isAvailable}
                accessibilityLabel="Retry biometric authentication"
              >
                Retry
              </Button>
            </View>
          </Card>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ============================================================================
// BIOMETRIC SETUP COMPONENT
// ============================================================================

export const BiometricSetup: React.FC<BiometricSetupProps> = ({
  onSetupComplete,
  onCancel,
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  
  const [capabilities, setCapabilities] = useState<BiometricCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Initialize capabilities
  useEffect(() => {
    const initCapabilities = async () => {
      const caps = await biometricAuthManager.initialize();
      setCapabilities(caps);
    };
    initCapabilities();
  }, []);

  const handleSetup = async () => {
    if (!capabilities?.isAvailable) {
      setError('Biometric authentication is not available on this device');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await biometricAuthManager.enableBiometricAuth();
      
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSetupComplete(true);
      } else {
        setError(result.error || 'Failed to set up biometric authentication');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBenefits = () => {
    const typeNames = capabilities ? biometricAuthManager.getBiometricTypeNames() : [];
    const primaryType = typeNames[0] || 'Biometric authentication';
    
    return [
      `Quick access with ${primaryType}`,
      'Enhanced security for your account',
      'No need to remember passwords',
      'Works offline and instantly',
    ];
  };

  return (
    <Card
      variant="elevated"
      style={{
        padding: tokens.Spacing['3xl'],
        margin: tokens.Spacing.lg,
        ...style as any,
      }}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={generateAccessibilityLabel.status('form', 'Biometric authentication setup')}
    >
      {/* Header */}
      <View
        style={{
          alignItems: 'center',
          marginBottom: tokens.Spacing['2xl'],
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.status.infoBackground,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: tokens.Spacing.lg,
          }}
          accessibilityElementsHidden
        >
          <Icon
            name="Shield"
            size="xl"
            color="info"
          />
        </View>
        
        <Text
          variant="headlineSmall"
          color="primary"
          weight="bold"
          align="center"
          accessibilityRole="header"
        >
          Secure Your Account
        </Text>
        
        <Text
          variant="bodyLarge"
          color="secondary"
          align="center"
          style={{
            marginTop: tokens.Spacing.sm,
            lineHeight: tokens.Typography.body.large.lineHeight * 1.2,
          }}
        >
          Enable biometric authentication for faster and more secure access
        </Text>
      </View>

      {/* Benefits */}
      <View
        style={{ marginBottom: tokens.Spacing['2xl'] }}
        accessibilityRole="list"
        accessibilityLabel="Benefits of biometric authentication"
      >
        {getBenefits().map((benefit, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: tokens.Spacing.md,
            }}
            accessibilityRole="text"
          >
            <Icon
              name="Check"
              size="sm"
              color="success"
              style={{ marginRight: tokens.Spacing.md }}
            />
            <Text
              variant="bodyMedium"
              color="primary"
              style={{ flex: 1 }}
            >
              {benefit}
            </Text>
          </View>
        ))}
      </View>

      {/* Error */}
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

      {/* Actions */}
      <View
        style={{
          flexDirection: 'row',
          gap: tokens.Spacing.md,
        }}
        accessibilityRole="button"
        accessibilityLabel="Setup actions"
      >
        <Button
          variant="secondary"
          size="large"
          fullWidth
          onPress={onCancel}
          accessibilityLabel="Skip biometric setup"
        >
          Skip
        </Button>
        
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSetup}
          loading={isLoading}
          disabled={!capabilities?.isAvailable}
          gradient
          accessibilityLabel="Enable biometric authentication"
        >
          Enable
        </Button>
      </View>
    </Card>
  );
};

// ============================================================================
// BIOMETRIC STATUS COMPONENT
// ============================================================================

export const BiometricStatus: React.FC<BiometricStatusProps> = ({
  onToggle,
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  
  const [capabilities, setCapabilities] = useState<BiometricCapabilities | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Initialize and check status
  useEffect(() => {
    const initialize = async () => {
      const caps = await biometricAuthManager.initialize();
      setCapabilities(caps);
      setIsEnabled(biometricAuthManager.isBiometricAuthEnabled());
    };
    initialize();
  }, []);

  const handleToggle = async () => {
    if (!capabilities?.isAvailable) return;

    setIsToggling(true);

    try {
      if (isEnabled) {
        await biometricAuthManager.disableBiometricAuth();
        setIsEnabled(false);
        onToggle(false);
      } else {
        const result = await biometricAuthManager.enableBiometricAuth();
        if (result.success) {
          setIsEnabled(true);
          onToggle(true);
        }
      }
    } catch (error) {
      console.error('Failed to toggle biometric auth:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusText = () => {
    if (!capabilities?.hasHardware) {
      return 'Not available on this device';
    }
    if (!capabilities?.isEnrolled) {
      return 'No biometric data enrolled';
    }
    if (isEnabled) {
      return 'Enabled and active';
    }
    return 'Available but disabled';
  };

  const getStatusColor = () => {
    if (!capabilities?.isAvailable) return 'tertiary';
    return isEnabled ? 'success' : 'secondary';
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: tokens.Spacing.lg,
          backgroundColor: colors.background.secondary,
          borderRadius: tokens.BorderRadius.lg,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: isEnabled }}
      accessibilityLabel={`Biometric authentication ${isEnabled ? 'enabled' : 'disabled'}`}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: tokens.Spacing.xs,
          }}
        >
          <Icon
            name="Fingerprint"
            size="md"
            color={isEnabled ? 'success' : 'secondary'}
            style={{ marginRight: tokens.Spacing.sm }}
          />
          <Text
            variant="titleMedium"
            color="primary"
            weight="semibold"
          >
            Biometric Login
          </Text>
        </View>
        
        <Text
          variant="bodySmall"
          color={getStatusColor()}
        >
          {getStatusText()}
        </Text>
      </View>

      <Button
        variant={isEnabled ? 'secondary' : 'primary'}
        size="small"
        onPress={handleToggle}
        loading={isToggling}
        disabled={!capabilities?.isAvailable}
        accessibilityLabel={`${isEnabled ? 'Disable' : 'Enable'} biometric authentication`}
      >
        {isEnabled ? 'Disable' : 'Enable'}
      </Button>
    </View>
  );
};

export default BiometricPrompt;