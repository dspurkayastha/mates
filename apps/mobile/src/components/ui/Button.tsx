import React, { useMemo, useState } from 'react';
import {
  Pressable,
  PressableProps,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Text from './Text';
import { useTheme, useTokens } from '../../design-system/ThemeProvider';

// ============================================================================
// TYPES
// ============================================================================

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'success'
  | 'danger'
  | 'tertiary';

type ButtonSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hapticFeedback?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  hapticFeedback = true,
  style,
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
  ...props
}) => {
  const { theme, accessibility } = useTheme();
  const tokens = useTokens();

  const scale = useSharedValue(1);
  const [isFocused, setIsFocused] = useState(false);

  const easing = Easing.bezier(0.2, 0.8, 0.2, 1);

  const handlePressIn = () => {
    if (accessibility.isReduceMotionEnabled) return;
    scale.value = withTiming(tokens.Animation.press.scale, {
      duration: tokens.Animation.duration.in,
      easing,
    });
  };

  const handlePressOut = () => {
    if (accessibility.isReduceMotionEnabled) return;
    scale.value = withTiming(1, {
      duration: tokens.Animation.duration.out,
      easing,
    });
  };

  const handlePress = (e: any) => {
    if (disabled || loading) return;
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolvedSize = useMemo(() => {
    switch (size) {
      case 'small':
      case 'sm':
        return 'sm';
      case 'large':
      case 'lg':
        return 'lg';
      default:
        return 'md';
    }
  }, [size]);

  const sizeStyle = useMemo(() => {
    switch (resolvedSize) {
      case 'sm':
        return {
          paddingHorizontal: tokens.Spacing.md,
          paddingVertical: tokens.Spacing.sm,
        };
      case 'lg':
        return {
          paddingHorizontal: tokens.Spacing['2xl'],
          paddingVertical: tokens.Spacing.lg,
        };
      case 'md':
      default:
        return {
          paddingHorizontal: tokens.Spacing.lg,
          paddingVertical: tokens.Spacing.md,
        };
    }
  }, [resolvedSize, tokens]);

  const resolvedVariant = useMemo(() => {
    switch (variant) {
      case 'tertiary':
        return 'ghost';
      case 'danger':
        return 'destructive';
      case 'success':
        return 'primary';
      default:
        return variant as 'primary' | 'secondary' | 'ghost' | 'destructive';
    }
  }, [variant]);

  const { backgroundColor, borderColor, textColor } = useMemo(() => {
    switch (resolvedVariant) {
      case 'primary':
        return {
          backgroundColor: theme.interactive.primary,
          borderColor: 'transparent',
          textColor: theme.text.inverse,
        };
      case 'secondary':
        return {
          backgroundColor: theme.background.secondary,
          borderColor: theme.border.light,
          textColor: theme.text.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: theme.interactive.primary,
        };
      case 'destructive':
        return {
          backgroundColor: theme.interactive.danger,
          borderColor: 'transparent',
          textColor: theme.text.inverse,
        };
    }
  }, [resolvedVariant, theme]);

  const baseStyle: ViewStyle = {
    borderRadius: tokens.BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderColor === 'transparent' ? 0 : StyleSheet.hairlineWidth,
    backgroundColor,
    borderColor,
    opacity: disabled ? 0.5 : 1,
  };

  const focusStyle = isFocused
    ? { borderWidth: 2, borderColor: theme.border.brand }
    : {};

  const widthStyle = fullWidth ? { alignSelf: 'stretch' } : {};

  return (
    <Animated.View style={[widthStyle, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        testID={testID}
        style={[baseStyle, sizeStyle, focusStyle, style]}
        {...props}
      >
        {leftIcon && !loading && (
          <View style={{ marginRight: tokens.Spacing.sm }}>{leftIcon}</View>
        )}
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text variant="labelLarge" weight="semibold" color={textColor}>
            {children}
          </Text>
        )}
        {rightIcon && !loading && (
          <View style={{ marginLeft: tokens.Spacing.sm }}>{rightIcon}</View>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default Button;
