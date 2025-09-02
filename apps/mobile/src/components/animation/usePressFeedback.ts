import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme, useTokens } from '@/design-system/ThemeProvider';

interface Options {
  scale?: number;
  durationIn?: number;
  durationOut?: number;
  haptics?: boolean;
}

export function usePressFeedback(opts: Options = {}) {
  const { accessibility } = useTheme();
  const tokens = useTokens();
  const scale = useSharedValue(1);

  const targetScale = opts.scale ?? tokens.Animation.press.scale;
  const durationIn = opts.durationIn ?? tokens.Animation.duration.in;
  const durationOut = opts.durationOut ?? tokens.Animation.duration.out;
  const enableHaptics = opts.haptics !== false;
  const easing = Easing.bezier(0.2, 0.8, 0.2, 1);

  const onPressIn = useCallback(() => {
    if (accessibility.isReduceMotionEnabled) return;
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withTiming(targetScale, { duration: durationIn, easing });
  }, [accessibility.isReduceMotionEnabled, enableHaptics, scale, targetScale, durationIn, easing]);

  const onPressOut = useCallback(() => {
    if (accessibility.isReduceMotionEnabled) return;
    scale.value = withTiming(1, { duration: durationOut, easing });
  }, [accessibility.isReduceMotionEnabled, scale, durationOut, easing]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: accessibility.isReduceMotionEnabled ? 1 : scale.value }],
  }));

  return { animatedStyle, onPressIn, onPressOut };
}
