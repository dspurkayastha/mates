import React from 'react';
import { Pressable, PressableProps, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme, useTokens, withOpacity } from '../design-system/ThemeProvider';
import Text from './ui/Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  style?: any;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  style,
  disabled = false,
  accessibilityRole = 'button',
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const tokens = useTokens();
  const scale = useSharedValue(1);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    scale.value = withTiming(tokens.Animation.press.scale, {
      duration: tokens.Animation.duration.in,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  };

  const handlePressOut = () => {
    setIsPressed(false);
    scale.value = withTiming(1, {
      duration: tokens.Animation.duration.out,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundColors: Record<ButtonVariant, string> = {
    primary: theme.interactive.primary,
    secondary: theme.interactive.secondary,
    ghost: 'transparent',
    destructive: theme.interactive.danger,
  };

  const pressedBackgrounds: Record<ButtonVariant, string> = {
    primary: theme.interactive.primaryActive,
    secondary: theme.interactive.secondaryHover,
    ghost: withOpacity(theme.interactive.primary, 0.1),
    destructive: withOpacity(theme.interactive.danger, 0.8),
  };

  const textColors: Record<ButtonVariant, string> = {
    primary: theme.text.inverse,
    secondary: theme.text.primary,
    ghost: theme.interactive.primary,
    destructive: theme.text.inverse,
  };

  const paddingStyles: Record<ButtonSize, any> = {
    sm: {
      paddingHorizontal: tokens.Spacing.md,
      paddingVertical: tokens.Spacing.sm,
    },
    md: {
      paddingHorizontal: tokens.Spacing.lg,
      paddingVertical: tokens.Spacing.md,
    },
    lg: {
      paddingHorizontal: tokens.Spacing.xl,
      paddingVertical: tokens.Spacing.lg,
    },
  };

  const textVariant = size === 'sm' ? 'labelMedium' : size === 'md' ? 'labelLarge' : 'titleSmall';

  const focusRing = isFocused
    ? {
        borderColor: theme.interactive.primary,
        borderWidth: 2,
        borderRadius: tokens.BorderRadius.md + 2,
        padding: 2,
      }
    : {};

  const baseStyle = {
    backgroundColor: isPressed ? pressedBackgrounds[variant] : backgroundColors[variant],
    borderRadius: tokens.BorderRadius.md,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row' as const,
    ...(variant === 'ghost' ? {} : tokens.Shadows.sm),
    ...(variant === 'secondary'
      ? { borderWidth: StyleSheet.hairlineWidth, borderColor: theme.border.light }
      : {}),
    opacity: disabled ? 0.5 : 1,
    ...paddingStyles[size],
  };

  return (
    <View style={[focusRing, style]}>
      <AnimatedPressable
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[baseStyle, animatedStyle]}
        {...rest}
      >
        <Text variant={textVariant} weight="semibold" color={textColors[variant]}>
          {children}
        </Text>
      </AnimatedPressable>
    </View>
  );
}
