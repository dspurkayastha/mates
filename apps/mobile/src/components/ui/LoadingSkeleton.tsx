/**
 * Loading Skeleton Component
 * Animated skeleton loader for better UX during loading states
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useColors, useTokens } from '../../design-system/ThemeProvider';

// ============================================================================
// TYPES
// ============================================================================

export interface SkeletonProps {
  width?: string | number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    if (animated) {
      opacity.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        true
      );
    }
  }, [animated, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animated ? interpolate(opacity.value, [0.3, 1], [0.3, 0.6]) : 0.3,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          backgroundColor: colors.background.secondary,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    />
  );
};

export default LoadingSkeleton;
