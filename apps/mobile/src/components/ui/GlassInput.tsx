/**
 * GlassInput Component
 * iOS 26 glass input field with glassmorphism effects
 * Features semi-transparent background, smooth focus animations, and proper accessibility
 */

import React, { useState, useMemo } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
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
  
  const dimensions = useMemo(() => {
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
      default:
        return {
          minHeight: 44,
          padding: tokens.Spacing.md,
          fontSize: tokens.Typography.body.medium.fontSize,
          borderRadius: tokens.BorderRadius.xl,
        };
    }
  }, [size, tokens]);

  const stateColors = useMemo(() => {
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
  }, [isDark, hasError, isFocused, colors, tokens]);
  
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
  
  const containerStyles = useMemo<ViewStyle>(() => {
    const baseStyle: ViewStyle = {
      minHeight: dimensions.minHeight,
      borderRadius: dimensions.borderRadius,
      borderWidth: variant === 'outlined' ? 1.5 : 1,
      ...styles.container,
      opacity: disabled ? 0.5 : 1,
    };

    switch (variant) {
      case 'outlined':
        return { ...baseStyle, backgroundColor: 'transparent' };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: withOpacity(colors.background.secondary, 0.6),
          borderWidth: 0,
        };
      default:
        return { ...baseStyle, backgroundColor: stateColors.tintColor };
    }
  }, [dimensions, variant, disabled, colors, stateColors]);

  const inputContentStyle = useMemo<ViewStyle>(
    () => ({
      ...styles.inputContent,
      paddingHorizontal: dimensions.padding,
      paddingVertical: dimensions.padding * 0.75,
      minHeight: dimensions.minHeight,
    }),
    [dimensions]
  );

  const textInputStyle = useMemo<TextStyle>(
    () => ({
      ...styles.textInput,
      fontSize: dimensions.fontSize,
      color: disabled ? colors.text.tertiary : colors.text.primary,
      ...tokens.Typography.body.medium,
      ...inputStyle,
    }),
    [dimensions.fontSize, disabled, colors, tokens, inputStyle]
  );

  const leftIconStyle = useMemo(() => ({ marginRight: tokens.Spacing.sm }), [tokens]);
  const rightIconStyle = useMemo(() => ({ marginLeft: tokens.Spacing.sm }), [tokens]);
  const labelStyle = useMemo(() => ({ marginBottom: tokens.Spacing.xs }), [tokens]);
  const helperStyle = useMemo(() => ({ marginTop: tokens.Spacing.xs }), [tokens]);
  
  // Render input content
  const renderInputContent = () => (
    <View style={inputContentStyle}>
      {leftIcon && <View style={leftIconStyle}>{leftIcon}</View>}
      
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
      
      {rightIcon && <View style={rightIconStyle}>{rightIcon}</View>}
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
          style={labelStyle}
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
          style={helperStyle}
        >
          {errorText || helperText}
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    margin: 0,
    padding: 0,
    textAlignVertical: 'center',
  },
});

export default GlassInput;
