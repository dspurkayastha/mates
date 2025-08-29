/**
 * GlassCard Component
 * iOS 26 glass card with translucent frosted backgrounds
 * Features glassmorphism effects, interactive animations, and proper accessibility
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
import GlassView from './GlassView';

// ============================================================================
// TYPES
// ============================================================================

type GlassCardVariant = 'elevated' | 'outlined' | 'filled' | 'translucent';
type GlassCardSize = 'small' | 'medium' | 'large';
type GlassIntensity = 'ultraThin' | 'thin' | 'regular' | 'thick' | 'ultraThick';

interface BaseGlassCardProps {
  variant?: GlassCardVariant;
  size?: GlassCardSize;
  glassIntensity?: GlassIntensity;
  interactive?: boolean;
  hapticFeedback?: boolean;
  borderRadius?: number;
  shadowEnabled?: boolean;
  shadowIntensity?: 'subtle' | 'regular' | 'strong';
  style?: ViewStyle;
  children: React.ReactNode;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'none' | 'button' | 'link' | 'text' | 'summary';
  testID?: string;
}

interface InteractiveGlassCardProps extends Omit<BaseGlassCardProps, 'accessibilityRole'>, Omit<TouchableOpacityProps, 'style' | 'children'> {
  interactive: true;
  accessibilityRole?: 'none' | 'button' | 'link' | 'text' | 'summary';
}

interface StaticGlassCardProps extends BaseGlassCardProps {
  interactive?: false;
}

type GlassCardProps = InteractiveGlassCardProps | StaticGlassCardProps;

// ============================================================================
// COMPONENT
// ============================================================================

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'translucent',
  size = 'medium',
  glassIntensity = 'regular',
  interactive = false,
  hapticFeedback = true,
  borderRadius,
  shadowEnabled = true,
  shadowIntensity = 'regular',
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
  const isDark = colors.background.primary === tokens.BaseColors.neutral[950];
  
  // Animation values
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(1);
  const backgroundOpacity = useSharedValue(1);
  
  // iOS 26 Spring animation
  const springConfig = tokens.SpringAnimations.glass;

  // Handle interactions for interactive cards
  const handlePressIn = () => {
    if (!interactive) return;
    
    scale.value = withSpring(0.98, springConfig);
    shadowOpacity.value = withSpring(1.5, springConfig);
    backgroundOpacity.value = withSpring(0.9, springConfig);
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (!interactive) return;
    
    scale.value = withSpring(1, springConfig);
    shadowOpacity.value = withSpring(1, springConfig);
    backgroundOpacity.value = withSpring(1, springConfig);
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const animatedShadowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(
        shadowOpacity.value,
        [1, 1.5],
        [0.1, 0.2]
      ),
    };
  });
  
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  // Get card styles based on variant and size
  const getCardStyles = (): ViewStyle => {
    // Size styles
    const sizeStyles = {
      small: {
        padding: tokens.Spacing.md,
        borderRadius: borderRadius || tokens.BorderRadius.lg,
      },
      medium: {
        padding: tokens.Spacing.lg,
        borderRadius: borderRadius || tokens.BorderRadius.xl,
      },
      large: {
        padding: tokens.Spacing.xl,
        borderRadius: borderRadius || tokens.BorderRadius['2xl'],
      },
    };

    return {
      ...sizeStyles[size],
      overflow: 'hidden',
    };
  };

  // Get variant-specific background and styling
  const getVariantStyles = (): {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    tint?: 'light' | 'dark' | 'systemMaterial';
  } => {
    const tintColors = isDark 
      ? tokens.GlassmorphismTokens.tintColors.dark
      : tokens.GlassmorphismTokens.tintColors.light;
    
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: withOpacity(colors.background.elevated, 0.9),
          tint: isDark ? 'dark' : 'light',
        };
        
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderColor: isDark 
            ? tokens.GlassmorphismTokens.borderColors.dark.regular
            : tokens.GlassmorphismTokens.borderColors.light.regular,
          borderWidth: 1,
          tint: isDark ? 'dark' : 'light',
        };
        
      case 'filled':
        return {
          backgroundColor: withOpacity(colors.background.secondary, 0.8),
          tint: isDark ? 'dark' : 'light',
        };
        
      case 'translucent':
      default:
        return {
          backgroundColor: tintColors.neutral,
          tint: 'systemMaterial',
        };
    }
  };

  const cardStyles = getCardStyles();
  const variantStyles = getVariantStyles();

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

  // Render card content
  const renderCardContent = () => {
    if (variant === 'translucent') {
      const combinedStyles: ViewStyle = {
        ...cardStyles,
        backgroundColor: variantStyles.backgroundColor,
        borderColor: variantStyles.borderColor,
        borderWidth: variantStyles.borderWidth,
      };

      return (
        <Animated.View style={animatedBackgroundStyle}>
          <GlassView
            intensity={glassIntensity}
            tint={variantStyles.tint}
            style={combinedStyles}
            shadowEnabled={shadowEnabled}
            shadowIntensity={shadowIntensity}
          >
            {children}
          </GlassView>
        </Animated.View>
      );
    }
    
    // For non-glass variants, use regular View with glass-like styling
    const combinedStyles: ViewStyle = {
      ...cardStyles,
      backgroundColor: variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor,
      borderWidth: variantStyles.borderWidth,
      ...tokens.Shadows.lg,
    };

    return (
      <Animated.View style={[combinedStyles, animatedShadowStyle]}>
        {children}
      </Animated.View>
    );
  };

  // Render interactive or static card
  if (interactive) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1} // We handle opacity with animations
          {...getAccessibilityProps()}
          {...(props as TouchableOpacityProps)}
        >
          {renderCardContent()}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View 
      style={style}
      {...getAccessibilityProps()}
    >
      {renderCardContent()}
    </View>
  );
};

export default GlassCard;