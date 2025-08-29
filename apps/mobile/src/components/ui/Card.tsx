/**
 * Modern Card Component
 * Premium card with 2025 design standards
 * Supports glass morphism, advanced shadows, and interaction states
 */

import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens, withOpacity } from '../../design-system/ThemeProvider';
import Text from './Text';

// ============================================================================
// TYPES
// ============================================================================

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass';
type CardSize = 'small' | 'medium' | 'large';

interface BaseCardProps {
  variant?: CardVariant;
  size?: CardSize;
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

interface InteractiveCardProps extends Omit<BaseCardProps, 'accessibilityRole'>, Omit<TouchableOpacityProps, 'style' | 'children'> {
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
  size = 'medium',
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
  const colors = useColors();
  const tokens = useTokens();
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  // Animation for interactive cards
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: shadowOpacity.value,
    };
  });

  // Handle press interactions
  const handlePressIn = () => {
    if (!interactive) return;
    
    scale.value = withSpring(0.98, {
      damping: 20,
      stiffness: 300,
    });
    shadowOpacity.value = withSpring(0.15);
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (!interactive) return;
    
    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
    });
    shadowOpacity.value = withSpring(0.1);
  };

  // Get card styles based on variant and size
  const getCardStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: tokens.BorderRadius['2xl'],
      overflow: 'hidden',
    };

    // Size styles
    const sizeStyles = {
      small: {
        padding: tokens.Spacing.md,
      },
      medium: {
        padding: tokens.Spacing.lg,
      },
      large: {
        padding: tokens.Spacing.xl,
      },
    };

    // Variant styles
    let variantStyles: ViewStyle = {};
    
    switch (variant) {
      case 'elevated':
        variantStyles = {
          backgroundColor: colors.background.elevated,
          ...tokens.Shadows.lg,
        };
        break;
        
      case 'outlined':
        variantStyles = {
          backgroundColor: colors.background.primary,
          borderWidth: 1,
          borderColor: colors.border.light,
          ...tokens.Shadows.sm,
        };
        break;
        
      case 'filled':
        variantStyles = {
          backgroundColor: colors.background.secondary,
          ...tokens.Shadows.md,
        };
        break;
        
      case 'glass':
        variantStyles = {
          backgroundColor: withOpacity(colors.background.elevated, 0.8),
          borderWidth: 1,
          borderColor: withOpacity(colors.border.light, 0.2),
          ...tokens.Shadows.xl,
          // Glass morphism effect
          backdropFilter: 'blur(20px)',
          // Note: backdropFilter is not supported in React Native, 
          // but we'll use expo-blur for this in advanced implementation
        };
        break;
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles,
    };
  };

  const cardStyles = getCardStyles();

  // Generate accessibility properties
  const getAccessibilityProps = () => {
    const defaultRole = interactive ? 'button' : 'text';
    const role = accessibilityRole || defaultRole;
    
    const defaultLabel = interactive 
      ? (accessibilityLabel || 'Interactive card')
      : accessibilityLabel;
    
    const defaultHint = interactive
      ? (accessibilityHint || 'Double tap to interact with this card')
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
    const { onPress, onPressIn, onPressOut, ...touchableProps } = props as InteractiveCardProps;
    const accessibilityProps = getAccessibilityProps();
    
    return (
      <Animated.View style={[animatedStyle]}>
        <TouchableOpacity
          style={[cardStyles, style]}
          onPress={onPress}
          onPressIn={(e) => {
            handlePressIn();
            onPressIn?.(e);
          }}
          onPressOut={(e) => {
            handlePressOut();
            onPressOut?.(e);
          }}
          activeOpacity={0.95}
          {...accessibilityProps}
          {...touchableProps}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Render static card
  const accessibilityProps = getAccessibilityProps();
  return (
    <View 
      style={[cardStyles, style]}
      {...accessibilityProps}
    >
      {children}
    </View>
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

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  style,
}) => {
  const tokens = useTokens();

  return (
    <View style={[
      {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: tokens.Spacing.md,
      },
      style,
    ]}>
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
      {action && (
        <View style={{ marginLeft: tokens.Spacing.md }}>
          {action}
        </View>
      )}
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

export const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
}) => {
  return (
    <View style={style}>
      {children}
    </View>
  );
};

// ============================================================================
// CARD FOOTER COMPONENT
// ============================================================================

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
}) => {
  const tokens = useTokens();

  return (
    <View style={[
      {
        marginTop: tokens.Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      style,
    ]}>
      {children}
    </View>
  );
};

export default Card;