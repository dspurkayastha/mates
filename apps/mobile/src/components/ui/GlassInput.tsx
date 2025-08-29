/**
 * GlassInput Component
 * iOS 26 glass input field with glassmorphism effects
 * Features semi-transparent background, smooth focus animations, and proper accessibility
 */

import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens, withOpacity } from '../../design-system/ThemeProvider';
import GlassView from './GlassView';
import Text from './Text';

// ============================================================================
// TYPES
// ============================================================================

interface GlassInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
  glassIntensity?: 'ultraThin' | 'thin' | 'regular' | 'thick';
  hapticFeedback?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  size = 'medium',
  variant = 'default',
  glassIntensity = 'regular',
  hapticFeedback = true,
  disabled = false,
  style,
  inputStyle,
  value,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityHint,
  testID,
  ...props
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const isDark = colors.background.primary === tokens.BaseColors.neutral[950];
  
  // State
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!errorText;
  const hasValue = !!value;
  
  // Animation values
  const focusProgress = useSharedValue(0);
  const borderScale = useSharedValue(1);
  
  // Get dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return {
          minHeight: 36,
          padding: tokens.Spacing.sm,
          fontSize: tokens.Typography.body.small.fontSize,
          borderRadius: tokens.BorderRadius.lg,
        };
      case 'large':
        return {
          minHeight: 52,
          padding: tokens.Spacing.lg,
          fontSize: tokens.Typography.body.large.fontSize,
          borderRadius: tokens.BorderRadius['2xl'],
        };
      default: // medium
        return {
          minHeight: 44,
          padding: tokens.Spacing.md,
          fontSize: tokens.Typography.body.medium.fontSize,
          borderRadius: tokens.BorderRadius.xl,
        };
    }
  };
  
  const dimensions = getDimensions();
  
  // Get colors based on state
  const getStateColors = () => {
    const tintColors = isDark 
      ? tokens.GlassmorphismTokens.tintColors.dark
      : tokens.GlassmorphismTokens.tintColors.light;
    
    if (hasError) {
      return {
        borderColor: colors.interactive.danger,
        tintColor: tintColors.danger,
        focusColor: colors.interactive.danger,
      };
    }
    
    if (isFocused) {
      return {
        borderColor: colors.interactive.primary,
        tintColor: tintColors.primary,
        focusColor: colors.interactive.primary,
      };
    }
    
    return {
      borderColor: isDark 
        ? tokens.GlassmorphismTokens.borderColors.dark.subtle
        : tokens.GlassmorphismTokens.borderColors.light.subtle,
      tintColor: tintColors.neutral,
      focusColor: colors.interactive.primary,
    };
  };
  
  const stateColors = getStateColors();
  
  // Handle focus events
  const handleFocus = (event: any) => {
    setIsFocused(true);
    focusProgress.value = withSpring(1, tokens.SpringAnimations.toggle);
    borderScale.value = withSpring(1.02, tokens.SpringAnimations.toggle);
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onFocus?.(event);
  };
  
  const handleBlur = (event: any) => {
    setIsFocused(false);
    focusProgress.value = withSpring(0, tokens.SpringAnimations.toggle);
    borderScale.value = withSpring(1, tokens.SpringAnimations.toggle);
    
    onBlur?.(event);
  };
  
  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [
        stateColors.borderColor,
        stateColors.focusColor,
      ]
    );
    
    return {
      transform: [{ scale: borderScale.value }],
      borderColor,
    };
  });
  
  // Container styles
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      minHeight: dimensions.minHeight,
      borderRadius: dimensions.borderRadius,
      borderWidth: variant === 'outlined' ? 1.5 : 1,
      overflow: 'hidden',
      opacity: disabled ? 0.5 : 1,
    };
    
    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: withOpacity(colors.background.secondary, 0.6),
          borderWidth: 0,
        };
      default: // glass
        return {
          ...baseStyle,
          backgroundColor: stateColors.tintColor,
        };
    }
  };
  
  // Input content styles
  const getInputContentStyle = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: dimensions.padding,
      paddingVertical: dimensions.padding * 0.75,
      minHeight: dimensions.minHeight,
    };
  };
  
  // Text input styles
  const getTextInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: dimensions.fontSize,
      color: disabled ? colors.text.tertiary : colors.text.primary,
      ...tokens.Typography.body.medium,
      margin: 0,
      padding: 0,
      textAlignVertical: 'center',
      ...inputStyle,
    };
  };
  
  const containerStyles = getContainerStyles();
  const inputContentStyle = getInputContentStyle();
  const textInputStyle = getTextInputStyle();
  
  // Render input content
  const renderInputContent = () => (
    <View style={inputContentStyle}>
      {leftIcon && (
        <View style={{ marginRight: tokens.Spacing.sm }}>
          {leftIcon}
        </View>
      )}
      
      <TextInput
        {...props}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        style={textInputStyle}
        placeholderTextColor={colors.text.tertiary}
        accessible={true}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint}
        testID={testID}
      />
      
      {rightIcon && (
        <View style={{ marginLeft: tokens.Spacing.sm }}>
          {rightIcon}
        </View>
      )}
    </View>
  );
  
  return (
    <View style={style}>
      {/* Label */}
      {label && (
        <Text
          variant="label"
          size="medium"
          weight="medium"
          color={hasError ? colors.interactive.danger : colors.text.secondary}
          style={{ marginBottom: tokens.Spacing.xs }}
        >
          {label}
        </Text>
      )}
      
      {/* Input Container */}
      <Animated.View style={[animatedContainerStyle]}>
        {variant === 'default' ? (
          <GlassView
            intensity={glassIntensity}
            tint={isDark ? 'dark' : 'light'}
            style={containerStyles}
            shadowEnabled={!disabled && isFocused}
            shadowIntensity="subtle"
          >
            {renderInputContent()}
          </GlassView>
        ) : (
          <View style={containerStyles}>
            {renderInputContent()}
          </View>
        )}
      </Animated.View>
      
      {/* Helper/Error Text */}
      {(helperText || errorText) && (
        <Text
          variant="label"
          size="small"
          color={hasError ? colors.interactive.danger : colors.text.tertiary}
          style={{ marginTop: tokens.Spacing.xs }}
        >
          {errorText || helperText}
        </Text>
      )}
    </View>
  );
};

export default GlassInput;