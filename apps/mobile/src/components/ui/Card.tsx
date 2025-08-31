/**
 * Modern Card Component
 * Premium card with 2025 design standards
 * Subtle shadows and interaction states
 */

import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type { GestureResponderEvent } from 'react-native';
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

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface BaseCardProps {
  variant?: CardVariant;
  interactive?: boolean;
  hapticFeedback?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'none' | 'button' | 'link' | 'text' | 'summary';
  testID?: string;
}

interface InteractiveCardProps
  extends Omit<BaseCardProps, 'accessibilityRole'>,
    Omit<PressableProps, 'style' | 'children'> {
  interactive: true;
  accessibilityRole?: 'none' | 'button' | 'link' | 'text' | 'summary';
}

interface StaticCardProps extends BaseCardProps {
  interactive?: false;
}

type CardProps = InteractiveCardProps | StaticCardProps;

// ============================================================================
// COMPONENT
// ============================================================================

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  interactive = false,
  hapticFeedback = true,
  style,
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const tokens = useTokens();
  const scale = useSharedValue(1);

  // Animation for interactive cards
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Handle press interactions (non-bouncy, premium feel)
  const handlePressIn = () => {
    if (!interactive) return;

    const easing = Easing.bezier(0.2, 0.8, 0.2, 1);
    scale.value = withTiming(tokens.Animation.press.scale, {
      duration: tokens.Animation.duration.in,
      easing,
    });

    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (!interactive) return;

    const easing = Easing.bezier(0.2, 0.8, 0.2, 1);
    scale.value = withTiming(1, {
      duration: tokens.Animation.duration.out,
      easing,
    });
  };

  const getOuterStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: tokens.BorderRadius.lg,
    };

    switch (variant) {
      case 'elevated':
        return { ...base, ...tokens.Shadows.lg };
      case 'filled':
      case 'outlined':
      default:
        return { ...base, ...tokens.Shadows.md };
    }
  };

  const getInnerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: theme.background.primary,
      borderRadius: tokens.BorderRadius.lg,
      padding: tokens.Spacing.lg,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border.light,
    };

    switch (variant) {
      case 'elevated':
        return { ...base, backgroundColor: theme.background.elevated };
      case 'filled':
        return { ...base, backgroundColor: theme.background.secondary };
      case 'outlined':
      default:
        return base;
    }
  };

  const outerStyle = getOuterStyle();
  const innerStyle = getInnerStyle();

  // Accessibility
  const getAccessibilityProps = () => {
    const defaultRole = interactive ? 'button' : 'text';
    const role = accessibilityRole ?? defaultRole;

    const defaultLabel = interactive
      ? (accessibilityLabel ?? 'Interactive card')
      : accessibilityLabel;

    const defaultHint = interactive
      ? (accessibilityHint ?? 'Double tap to interact with this card')
      : accessibilityHint;

    return {
      accessible: true,
      accessibilityLabel: defaultLabel,
      accessibilityHint: defaultHint,
      accessibilityRole: role,
      testID,
    };
  };

  // Render interactive card
  if (interactive) {
    const { onPress, onPressIn, onPressOut, ...pressableProps } = props as InteractiveCardProps;
    const accessibilityProps = getAccessibilityProps();

    return (
      <Animated.View style={[outerStyle, animatedStyle, style]}>
        <Pressable
          style={innerStyle}
          onPress={onPress}
          onPressIn={(e: GestureResponderEvent) => {
            handlePressIn();
            onPressIn?.(e);
          }}
          onPressOut={(e: GestureResponderEvent) => {
            handlePressOut();
            onPressOut?.(e);
          }}
          {...accessibilityProps}
          {...pressableProps}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  // Render static card
  const accessibilityProps = getAccessibilityProps();
  return (
    <Animated.View style={[outerStyle, style]} {...accessibilityProps}>
      <View style={innerStyle}>{children}</View>
    </Animated.View>
  );
};

// ============================================================================
// CARD HEADER COMPONENT
// ============================================================================

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, style }) => {
  const tokens = useTokens();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: tokens.Spacing.md,
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        {title && (
          <Text
            variant="titleMedium"
            color="primary"
            style={{ marginBottom: subtitle ? tokens.Spacing.xs : 0 }}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text variant="bodySmall" color="secondary">
            {subtitle}
          </Text>
        )}
      </View>
      {action && <View style={{ marginLeft: tokens.Spacing.md }}>{action}</View>}
    </View>
  );
};

// ============================================================================
// CARD CONTENT COMPONENT
// ============================================================================

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return <View style={style}>{children}</View>;
};

// ============================================================================
// CARD FOOTER COMPONENT
// ============================================================================

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  const tokens = useTokens();

  return (
    <View
      style={[
        {
          marginTop: tokens.Spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;
