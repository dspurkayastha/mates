/**
 * GlassButton Component
 * iOS 26 tinted glass button with glassmorphism effects
 * Features translucent layers, soft gradients, and spring animations
 */

import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  View,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens, withOpacity } from '../../design-system/ThemeProvider';
import Text from './Text';
import GlassView from './GlassView';

// ============================================================================
// TYPES
// ============================================================================

type GlassButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
type GlassButtonSize = 'small' | 'medium' | 'large';
type GlassButtonStyle = 'filled' | 'tinted' | 'outlined' | 'plain';

interface GlassButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  buttonStyle?: GlassButtonStyle;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hapticFeedback?: boolean;
  glassIntensity?: 'ultraThin' | 'thin' | 'regular' | 'thick';
  style?: ViewStyle;
  children: React.ReactNode;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'none';
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  buttonStyle = 'tinted',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  hapticFeedback = true,
  glassIntensity = 'regular',
  style,
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  testID,
  ...props
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const isDark = colors.background.primary === tokens.BaseColors.neutral[950];
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundOpacity = useSharedValue(1);
  
  // Generate accessibility label if not provided
  const getAccessibilityLabel = () => {
    if (accessibilityLabel) return accessibilityLabel;
    
    const childText = typeof children === 'string' ? children : 'Button';
    if (loading) return `${childText}, Loading`;
    if (disabled) return `${childText}, Disabled`;
    return childText;
  };

  // Generate accessibility hint if not provided
  const getAccessibilityHint = () => {
    if (accessibilityHint) return accessibilityHint;
    
    if (loading) return 'Please wait while the action is being processed';
    if (disabled) return 'This button is currently disabled';
    
    switch (variant) {
      case 'danger':
        return 'Double tap to perform a destructive action';
      case 'primary':
        return 'Double tap to perform the primary action';
      default:
        return 'Double tap to activate';
    }
  };

  // iOS 26 Spring animation
  const springConfig = tokens.SpringAnimations.button;
  
  // Handle press with iOS 26 style animations
  const handlePressIn = () => {
    if (disabled || loading) return;
    
    scale.value = withSpring(0.96, springConfig);
    backgroundOpacity.value = withSpring(0.8, springConfig);
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    
    scale.value = withSpring(1, springConfig);
    backgroundOpacity.value = withSpring(1, springConfig);
  };

  const handlePress = (event: any) => {
    if (disabled || loading) return;
    
    // Glass ripple effect
    scale.value = withSequence(
      withSpring(0.94, { ...springConfig, damping: 15 }),
      withSpring(1, springConfig)
    );
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    onPress?.(event);
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  // Get button dimensions and padding
  const buttonStyles = useMemo<ViewStyle>(() => {
    const sizeStyles = {
      small: {
        paddingHorizontal: tokens.Spacing.md,
        paddingVertical: tokens.Spacing.sm,
        minHeight: 36,
        borderRadius: tokens.BorderRadius.lg,
      },
      medium: {
        paddingHorizontal: tokens.Spacing.lg,
        paddingVertical: tokens.Spacing.md,
        minHeight: 44,
        borderRadius: tokens.BorderRadius.xl,
      },
      large: {
        paddingHorizontal: tokens.Spacing.xl,
        paddingVertical: tokens.Spacing.lg,
        minHeight: 52,
        borderRadius: tokens.BorderRadius['2xl'],
      },
    } as const;

    const widthStyle = fullWidth ? { width: '100%' as const } : {};

    return {
      ...sizeStyles[size],
      ...widthStyle,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    } as ViewStyle;
  }, [size, fullWidth, tokens]);

  const tintColor = useMemo(() => {
    const tintColors = isDark
      ? tokens.GlassmorphismTokens.tintColors.dark
      : tokens.GlassmorphismTokens.tintColors.light;

    switch (variant) {
      case 'primary':
        return tintColors.primary;
      case 'secondary':
        return tintColors.secondary;
      case 'success':
        return tintColors.success;
      case 'danger':
        return tintColors.danger;
      case 'tertiary':
        return tintColors.neutral;
      default:
        return tintColors.primary;
    }
  }, [variant, isDark, tokens]);

  const textColor = useMemo(() => {
    if (disabled) return colors.text.tertiary;

    switch (buttonStyle) {
      case 'filled':
        switch (variant) {
          case 'primary':
          case 'danger':
          case 'success':
            return colors.text.inverse;
          default:
            return colors.text.primary;
        }
      case 'tinted':
      case 'outlined':
      case 'plain':
        switch (variant) {
          case 'primary':
            return colors.interactive.primary;
          case 'danger':
            return colors.interactive.danger;
          case 'success':
            return colors.interactive.success;
          default:
            return colors.text.primary;
        }
      default:
        return colors.text.primary;
    }
  }, [disabled, buttonStyle, variant, colors]);

  const gradientColors = useMemo(() => {
    switch (variant) {
      case 'primary':
        return [colors.interactive.primary, colors.interactive.primaryHover];
      case 'danger':
        return [
          colors.interactive.danger,
          withOpacity(colors.interactive.danger, 0.8),
        ];
      case 'success':
        return [
          colors.interactive.success,
          withOpacity(colors.interactive.success, 0.8),
        ];
      default:
        return ['transparent', 'transparent'];
    }
  }, [variant, colors]);

  const leftIconStyle = useMemo(() => ({
    marginRight: tokens.Spacing.sm,
  }), [tokens]);

  const rightIconStyle = useMemo(() => ({
    marginLeft: tokens.Spacing.sm,
  }), [tokens]);

  const activityIndicatorStyle = useMemo(
    () => ({ marginRight: children ? tokens.Spacing.sm : 0 }),
    [children, tokens]
  );
  
  // Render content
  const renderContent = () => (
    <>
      {leftIcon && <View style={leftIconStyle}>{leftIcon}</View>}
      
      {loading ? (
        <ActivityIndicator
          color={textColor}
          size={size === 'small' ? 'small' : 'small'}
          style={activityIndicatorStyle}
        />
      ) : null}
      
      {children && (
        <Text 
          variant={size === 'small' ? 'label' : 'body'}
          size={size === 'large' ? 'large' : 'medium'}
          weight="medium"
          color={textColor}
          style={styles.text}
        >
          {children}
        </Text>
      )}
      
      {rightIcon && <View style={rightIconStyle}>{rightIcon}</View>}
    </>
  );

  // Render different button styles
  const renderButtonContent = () => {
    switch (buttonStyle) {
      case 'filled':
        return (
          <LinearGradient
            colors={gradientColors}
            style={[buttonStyles, { opacity: disabled ? 0.5 : 1 }]}
          >
            {renderContent()}
          </LinearGradient>
        );
        
      case 'tinted':
        return (
          <Animated.View style={animatedBackgroundStyle}>
            <GlassView
              intensity={glassIntensity}
              tint={isDark ? 'dark' : 'light'}
              style={[
                buttonStyles,
                { backgroundColor: tintColor, opacity: disabled ? 0.5 : 1 },
              ]}
              shadowEnabled={!disabled}
              shadowIntensity="subtle"
            >
              {renderContent()}
            </GlassView>
          </Animated.View>
        );
        
      case 'outlined':
        return (
          <GlassView
            intensity="thin"
            tint={isDark ? 'dark' : 'light'}
            style={[
              buttonStyles,
              {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: disabled ? colors.border.light : tintColor,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
            shadowEnabled={false}
          >
            {renderContent()}
          </GlassView>
        );
        
      case 'plain':
      default:
        return (
          <View
            style={[
              buttonStyles,
              {
                backgroundColor: 'transparent',
                opacity: disabled ? 0.5 : 1,
              }
            ]}
          >
            {renderContent()}
          </View>
        );
    }
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        accessible={true}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={getAccessibilityHint()}
        accessibilityRole={accessibilityRole}
        testID={testID}
        activeOpacity={1} // We handle opacity with animations
        {...props}
      >
        {renderButtonContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
});

export default GlassButton;
