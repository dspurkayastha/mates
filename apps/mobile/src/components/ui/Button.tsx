/**
 * Modern Button Component
 * Premium button with 2025 design standards
 * Supports variants, sizes, haptic feedback, and accessibility
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import Text from './Text';

// ============================================================================
// TYPES
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hapticFeedback?: boolean;
  gradient?: boolean;
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

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  hapticFeedback = true,
  gradient = false,
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

  // Handle press with haptic feedback
  const handlePress = (event: any) => {
    if (disabled || loading) return;
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress?.(event);
  };
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: tokens.BorderRadius.xl,
      ...tokens.Shadows.md,
    };

    // Size styles
    const sizeStyles = {
      small: {
        paddingHorizontal: tokens.Spacing.md,
        paddingVertical: tokens.Spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: tokens.Spacing.lg,
        paddingVertical: tokens.Spacing.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: tokens.Spacing.xl,
        paddingVertical: tokens.Spacing.lg,
        minHeight: 52,
      },
    };

    // Variant styles
    let variantStyles: ViewStyle = {};
    
    switch (variant) {
      case 'primary':
        variantStyles = {
          backgroundColor: colors.interactive.primary,
        };
        break;
      case 'secondary':
        variantStyles = {
          backgroundColor: colors.interactive.secondary,
          borderWidth: 1,
          borderColor: colors.border.medium,
        };
        break;
      case 'tertiary':
        variantStyles = {
          backgroundColor: 'transparent',
        };
        break;
      case 'danger':
        variantStyles = {
          backgroundColor: colors.interactive.danger,
        };
        break;
      case 'success':
        variantStyles = {
          backgroundColor: colors.interactive.success,
        };
        break;
    }

    // Disabled styles
    if (disabled) {
      variantStyles = {
        ...variantStyles,
        opacity: 0.5,
      };
    }

    // Full width
    const widthStyle = fullWidth ? { width: '100%' as const } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles,
      ...widthStyle,
    };
  };

  // Get text color based on variant
  const getTextColor = () => {
    if (disabled) return colors.text.tertiary;
    
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
        return colors.text.inverse;
      case 'secondary':
        return colors.text.primary;
      case 'tertiary':
        return colors.interactive.primary;
      default:
        return colors.text.inverse;
    }
  };

  // Get text variant based on size
  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'labelMedium' as const;
      case 'medium':
        return 'labelLarge' as const;
      case 'large':
        return 'titleSmall' as const;
      default:
        return 'labelLarge' as const;
    }
  };

  // Get gradient colors for primary variant
  const getGradientColors = () => {
    if (variant === 'primary') {
      return [colors.interactive.primary, colors.interactive.primaryHover];
    }
    return [colors.interactive.primary, colors.interactive.primary];
  };

  const buttonStyles = getButtonStyles();
  const textColor = getTextColor();
  const textVariant = getTextVariant();

  const ButtonContent = () => (
    <>
      {leftIcon && !loading && (
        <React.Fragment>
          {leftIcon}
          <View style={{ width: tokens.Spacing.sm }} />
        </React.Fragment>
      )}
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={textColor}
          style={{ marginRight: leftIcon || rightIcon ? tokens.Spacing.sm : 0 }}
        />
      ) : (
        <Text
          variant={textVariant}
          color={textColor}
          weight="semibold"
        >
          {children}
        </Text>
      )}
      
      {rightIcon && !loading && (
        <React.Fragment>
          <View style={{ width: tokens.Spacing.sm }} />
          {rightIcon}
        </React.Fragment>
      )}
    </>
  );

  // Render with gradient if enabled and primary variant
  if (gradient && variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        style={[{ borderRadius: tokens.BorderRadius.xl }, style]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityHint={getAccessibilityHint()}
        accessibilityRole={accessibilityRole}
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading,
        }}
        testID={testID}
        {...props}
      >
        <LinearGradient
          colors={getGradientColors() as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            buttonStyles,
            { backgroundColor: 'transparent' }
          ]}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Regular button
  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={getAccessibilityHint()}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      testID={testID}
      {...props}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

export default Button;