import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect, Circle, Pattern } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSceneBackgroundContext } from './useSceneBackground';
import { ShapeComponent } from './shapes';
import { useTheme } from '@/components/ui';
import { withOpacity } from '@/design-system/ThemeProvider';
import { NOISE_DATA_URI } from './noiseDataUri';

const AnimatedLinear = Animated.createAnimatedComponent(LinearGradient);

export default function BackgroundOrchestrator() {
  const { theme, version, sceneTransition } = useSceneBackgroundContext();
  const { theme: colors, isHighContrast, accessibility, isDark } = useTheme();
  const reduceMotion = accessibility?.isReduceMotionEnabled;

  const prevTheme = useRef(theme);
  const currentTheme = useRef(theme);
  const colorProgress = useSharedValue(1);

  useEffect(() => {
    if (!theme) return;
    prevTheme.current = currentTheme.current || theme;
    currentTheme.current = theme;
    if (reduceMotion) {
      colorProgress.value = 1;
      sceneTransition.value = 0;
      return;
    }
    const swirl = theme.swirl || {};
    const durIn = swirl.durationInMs ?? 220;
    const durOut = swirl.durationOutMs ?? 240;
    colorProgress.value = 0;
    colorProgress.value = withTiming(1, { duration: durIn + durOut });
    sceneTransition.value = 0;
    sceneTransition.value = withSequence(
      withTiming(1, { duration: durIn }),
      withTiming(0, { duration: durOut }),
    );
  }, [version, theme]);

  const prevStyle = useAnimatedStyle(() => ({ opacity: 1 - colorProgress.value }));
  const currStyle = useAnimatedStyle(() => ({ opacity: colorProgress.value }));

  if (isHighContrast) {
    return (
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.background.secondary }]}
      />
    );
  }

  const prevStops = prevTheme.current?.gradient.stops || [];
  const currStops = currentTheme.current?.gradient.stops || [];
  const vignetteStart = withOpacity(colors.background.primary, 0);
  const vignetteEnd = withOpacity(colors.background.primary, isDark ? 0.12 : 0.06);

  const gradientProps = (t: typeof theme | null) => ({
    start: t?.gradient.type === 'radial' ? { x: 0.5, y: 0 } : { x: 0, y: 0 },
    end: t?.gradient.type === 'radial' ? { x: 0.5, y: 1 } : { x: 1, y: 1 },
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {prevTheme.current && (
        <AnimatedLinear
          colors={prevStops as any}
          style={[StyleSheet.absoluteFill, prevStyle]}
          {...gradientProps(prevTheme.current)}
        />
      )}
      {currentTheme.current && (
        <AnimatedLinear
          colors={currStops as any}
          style={[StyleSheet.absoluteFill, currStyle]}
          {...gradientProps(currentTheme.current)}
        />
      )}
      {currentTheme.current?.vignette && (
        <VignetteOverlay start={vignetteStart} end={vignetteEnd} />
      )}
      {currentTheme.current?.intensity === 'bold' && (
        <DotGridOverlay color={withOpacity(colors.interactive.primary, 0.01)} />
      )}
      {currentTheme.current?.shapes.map((s, idx) => {
        const color = currStops[s.colorIndex ?? 1] || currStops[0];
        return (
          <ShapeComponent
            key={idx}
            shape={s as any}
            color={color}
            phase={sceneTransition}
            overshoot={currentTheme.current?.swirl?.overshoot ?? 0.04}
            drift={currentTheme.current?.drift}
            index={idx}
          />
        );
      })}
      {currentTheme.current?.noise && <NoiseOverlay />}
    </View>
  );
}

function NoiseOverlay() {
  return (
    <Image source={{ uri: NOISE_DATA_URI }} style={[StyleSheet.absoluteFill, { opacity: 0.025 }]} />
  );
}

function VignetteOverlay({ start, end }: { start: string; end: string }) {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="v" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={start} />
          <Stop offset="100%" stopColor={end} />
        </RadialGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#v)" />
    </Svg>
  );
}

function DotGridOverlay({ color }: { color: string }) {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="1" fill={color} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#dot)" />
    </Svg>
  );
}
