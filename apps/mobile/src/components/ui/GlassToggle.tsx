/**
 * GlassToggle Component
 * iOS 26 glass toggle switch with glassmorphism effects
 * Features translucent track, smooth thumb animations, and haptic feedback
 */

import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import GlassView from './GlassView';

// ============================================================================
// TYPES
// ============================================================================

type GlassToggleVariant = 'primary' | 'success' | 'warning' | 'danger';
type GlassToggleSize = 'small' | 'medium' | 'large';

interface GlassToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  variant?: GlassToggleVariant;
  size?: GlassToggleSize;
  glassIntensity?: 'ultraThin' | 'thin' | 'regular' | 'thick';
  hapticFeedback?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const GlassToggle: React.FC<GlassToggleProps> = ({
  value,
  onValueChange,
  variant = 'primary',
  size = 'medium',
  glassIntensity = 'regular',
  hapticFeedback = true,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const isDark = colors.background.primary === tokens.BaseColors.neutral[950];
  
  // Animation values
  const toggleProgress = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);
  const thumbScale = useSharedValue(1);
  
  // Update toggle position when value changes
  React.useEffect(() => {
    toggleProgress.value = withSpring(value ? 1 : 0, tokens.SpringAnimations.toggle);
  }, [value]);
  
  const dimensions = useMemo(() => {
    switch (size) {
      case 'small':
        return { width: 36, height: 20, thumbSize: 16, padding: 2, borderRadius: 10 };
      case 'large':
        return { width: 56, height: 32, thumbSize: 28, padding: 2, borderRadius: 16 };
      default:
        return { width: 44, height: 24, thumbSize: 20, padding: 2, borderRadius: 12 };
    }
  }, [size]);

  const variantColors = useMemo(() => {
    const tintColors = isDark
      ? tokens.GlassmorphismTokens.tintColors.dark
      : tokens.GlassmorphismTokens.tintColors.light;

    switch (variant) {
      case 'success':
        return {
          activeColor: colors.interactive.success,
          activeTint: tintColors.success,
        };
      case 'warning':
        return {
          activeColor: colors.status.warning,
          activeTint: tintColors.warning,
        };
      case 'danger':
        return {
          activeColor: colors.interactive.danger,
          activeTint: tintColors.danger,
        };
      default:
        return {
          activeColor: colors.interactive.primary,
          activeTint: tintColors.primary,
        };
    }
  }, [variant, isDark, colors, tokens]);
  
  // Handle press
  const handlePress = () => {
    if (disabled) return;
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onValueChange(!value);
  };
  
  // Handle press in/out for visual feedback
  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.95, tokens.SpringAnimations.toggle);
    thumbScale.value = withSpring(1.1, tokens.SpringAnimations.toggle);
  };
  
  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, tokens.SpringAnimations.toggle);
    thumbScale.value = withSpring(1, tokens.SpringAnimations.toggle);
  };
  
  // Animated styles for track
  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      toggleProgress.value,
      [0, 1],
      [
        isDark 
          ? tokens.GlassmorphismTokens.tintColors.dark.neutral
          : tokens.GlassmorphismTokens.tintColors.light.neutral,
        variantColors.activeTint,
      ]
    );
    
    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });
  
  // Animated styles for thumb
  const animatedThumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      toggleProgress.value,
      [0, 1],
      [0, dimensions.width - dimensions.thumbSize - dimensions.padding * 2]
    );
    
    const backgroundColor = interpolateColor(
      toggleProgress.value,
      [0, 1],
      [
        isDark ? colors.background.elevated : colors.background.primary,
        colors.background.primary,
      ]
    );
    
    return {
      transform: [
        { translateX },
        { scale: thumbScale.value }
      ],
      backgroundColor,
    };
  });
  
  const trackStyle = useMemo<ViewStyle>(
    () => ({
      width: dimensions.width,
      height: dimensions.height,
      borderRadius: dimensions.borderRadius,
      padding: dimensions.padding,
      opacity: disabled ? 0.5 : 1,
    }),
    [dimensions, disabled]
  );

  const thumbStyle = useMemo<ViewStyle>(
    () => ({
      width: dimensions.thumbSize,
      height: dimensions.thumbSize,
      borderRadius: dimensions.thumbSize / 2,
      ...tokens.Shadows.sm,
    }),
    [dimensions, tokens]
  );
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.wrapper, style]}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel || `Toggle switch, ${value ? 'on' : 'off'}`}
      accessibilityHint={accessibilityHint || 'Double tap to toggle'}
      testID={testID}
      activeOpacity={1}
    >
      <Animated.View style={animatedTrackStyle}>
        <GlassView
          intensity={glassIntensity}
          tint={isDark ? 'dark' : 'light'}
          style={trackStyle}
          shadowEnabled={!disabled}
          shadowIntensity="subtle"
        >
          <Animated.View style={[thumbStyle, animatedThumbStyle]} />
        </GlassView>
      </Animated.View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
  },
});

export default GlassToggle;
