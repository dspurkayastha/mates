import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressFeedback } from '../animation/usePressFeedback';

import Text from './Text';
import {
  useTheme,
  useTokens,
  getGlassBackground,
  getGlassBorder,
} from '../../design-system/ThemeProvider';

// ============================================================================
// TYPES
// ============================================================================

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass';

interface BaseCardProps {
  variant?: CardVariant;
  interactive?: boolean;
  hapticFeedback?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  children: React.ReactNode;
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
  contentStyle,
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const tokens = useTokens();
  const {
    animatedStyle,
    onPressIn: pressIn,
    onPressOut: pressOut,
  } = usePressFeedback({
    haptics: interactive && hapticFeedback,
  });

  const getOuterStyle = (): ViewStyle => {
    const base: ViewStyle = { borderRadius: tokens.BorderRadius.lg };
    switch (variant) {
      case 'elevated':
      case 'glass':
        return { ...base, ...tokens.Shadows.lg };
      case 'filled':
      case 'outlined':
      default:
        return { ...base, ...tokens.Shadows.md };
    }
  };

  const getInnerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      borderRadius: tokens.BorderRadius.lg,
      padding: tokens.Spacing.lg,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border.light,
      backgroundColor: theme.background.primary,
    };

    switch (variant) {
      case 'elevated':
        return { ...base, backgroundColor: theme.background.elevated };
      case 'filled':
        return { ...base, backgroundColor: theme.background.secondary };
      case 'glass':
        return {
          ...base,
          backgroundColor: getGlassBackground(theme, 'neutral', 'regular'),
          borderColor: getGlassBorder(theme, 'regular'),
        };
      case 'outlined':
      default:
        return base;
    }
  };

  const outerStyle = getOuterStyle();
  const innerBaseStyle = getInnerStyle();
  const innerStyles = [innerBaseStyle, contentStyle];

  const getAccessibilityProps = () => {
    const defaultRole = interactive ? 'button' : 'text';
    const role = accessibilityRole ?? defaultRole;
    const defaultLabel = interactive
      ? accessibilityLabel ?? 'Interactive card'
      : accessibilityLabel;
    const defaultHint = interactive
      ? accessibilityHint ?? 'Double tap to interact with this card'
      : accessibilityHint;
    return {
      accessible: true,
      accessibilityLabel: defaultLabel,
      accessibilityHint: defaultHint,
      accessibilityRole: role,
      testID,
    };
  };

  if (interactive) {
    const { onPress, onPressIn, onPressOut, ...pressableProps } =
      props as InteractiveCardProps;
    const accessibilityProps = getAccessibilityProps();
    return (
      <Animated.View style={[outerStyle, animatedStyle, style]}>
        <Pressable
          style={innerStyles}
          onPress={onPress}
          onPressIn={(e: GestureResponderEvent) => {
            pressIn();
            onPressIn?.(e);
          }}
          onPressOut={(e: GestureResponderEvent) => {
            pressOut();
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

  const accessibilityProps = getAccessibilityProps();
  return (
    <Animated.View style={[outerStyle, style]} {...accessibilityProps}>
      <View style={innerStyles}>{children}</View>
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
