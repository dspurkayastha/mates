/**
 * GlassToggle Component
 * iOS 26 glass toggle switch with glassmorphism effects
 * Features translucent track, smooth thumb animations, and haptic feedback
 */

import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens, useTheme } from '../../design-system/ThemeProvider';
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
  const { accessibility } = useTheme();
  const colors = useColors();
  const tokens = useTokens();
  const isDark = colors.background.primary === tokens.BaseColors.neutral[950];

  // Animation values
  const progress = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);
  const thumbScale = useSharedValue(1);

  // Update toggle position when value changes
  React.useEffect(() => {
    const toValue = value ? 1 : 0;
    if (accessibility.isReduceMotionEnabled) {
      progress.value = toValue;
    } else {
      progress.value = withTiming(toValue, {
        duration: value ? tokens.Animation.duration.in : tokens.Animation.duration.out,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      });
    }
  }, [value, accessibility.isReduceMotionEnabled]);

  // Get dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return {
          width: 36,
          height: 20,
          thumbSize: 16,
          padding: 2,
          borderRadius: 10,
        };
      case 'large':
        return {
          width: 56,
          height: 32,
          thumbSize: 28,
          padding: 2,
          borderRadius: 16,
        };
      default: // medium
        return {
          width: 44,
          height: 24,
          thumbSize: 20,
          padding: 2,
          borderRadius: 12,
        };
    }
  };

  const dimensions = getDimensions();
  const minX = 0;
  const maxX = dimensions.width - dimensions.thumbSize - dimensions.padding * 2;

  // Get colors based on variant
  const getVariantColors = () => {
    const tintColors = tokens.GlassmorphismTokens.tintColors;

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
  };

  const variantColors = getVariantColors();

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
    if (disabled || accessibility.isReduceMotionEnabled) return;
    const easing = Easing.bezier(0.2, 0.8, 0.2, 1);
    scale.value = withTiming(tokens.Animation.press.scale, {
      duration: tokens.Animation.duration.in,
      easing,
    });
    thumbScale.value = withTiming(1.1, {
      duration: tokens.Animation.duration.in,
      easing,
    });
  };

  const handlePressOut = () => {
    if (disabled || accessibility.isReduceMotionEnabled) return;
    const easing = Easing.bezier(0.2, 0.8, 0.2, 1);
    scale.value = withTiming(1, {
      duration: tokens.Animation.duration.out,
      easing,
    });
    thumbScale.value = withTiming(1, {
      duration: tokens.Animation.duration.out,
      easing,
    });
  };

  // Animated styles for track
  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [String(tokens.GlassmorphismTokens.tintColors.neutral), String(variantColors.activeTint)],
    );

    return {
      backgroundColor,
      transform: accessibility.isReduceMotionEnabled ? [] : [{ scale: scale.value }],
    };
  }, [accessibility.isReduceMotionEnabled]);

  // Animated styles for thumb
  const animatedThumbStyle = useAnimatedStyle(() => {
    let translateX = progress.value === 1 ? maxX : minX;
    if (!accessibility.isReduceMotionEnabled && minX !== maxX) {
      translateX = interpolate(progress.value, [0, 1], [minX, maxX]);
    }

    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        String(isDark ? colors.background.elevated : colors.background.primary),
        String(colors.background.primary),
      ],
    );

    const transforms: any[] = [{ translateX }];
    if (!accessibility.isReduceMotionEnabled) {
      transforms.push({ scale: thumbScale.value });
    }

    return {
      transform: transforms,
      backgroundColor,
    };
  }, [accessibility.isReduceMotionEnabled]);

  // Track container style
  const trackStyle: ViewStyle = {
    width: dimensions.width,
    height: dimensions.height,
    borderRadius: dimensions.borderRadius,
    padding: dimensions.padding,
    opacity: disabled ? 0.5 : 1,
  };

  // Thumb style
  const thumbStyle: ViewStyle = {
    width: dimensions.thumbSize,
    height: dimensions.thumbSize,
    borderRadius: dimensions.thumbSize / 2,
    ...tokens.Shadows.sm,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[{ alignSelf: 'flex-start' as const }, style]}
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

export default GlassToggle;
