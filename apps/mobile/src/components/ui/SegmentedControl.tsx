import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Text from './Text';
import { useTheme, useTokens, withOpacity } from '../../design-system/ThemeProvider';

interface Segment {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SegmentButtonProps {
  seg: Segment;
  active: boolean;
  onChange: (value: string) => void;
  accessibility: ReturnType<typeof useTheme>['accessibility'];
  tokens: ReturnType<typeof useTokens>;
}

const SegmentButton: React.FC<SegmentButtonProps> = ({ seg, active, onChange, accessibility, tokens }) => {
  const scale = useSharedValue(1);
  const animatedSegmentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (accessibility.isReduceMotionEnabled) return;
    const easing = Easing.bezier(0.2, 0.8, 0.2, 1);
    scale.value = withTiming(tokens.Animation.press.scale, {
      duration: tokens.Animation.duration.in,
      easing,
    });
  };

  const handlePressOut = () => {
    if (accessibility.isReduceMotionEnabled) return;
    const easing = Easing.bezier(0.2, 0.8, 0.2, 1);
    scale.value = withTiming(1, {
      duration: tokens.Animation.duration.out,
      easing,
    });
  };

  return (
    <AnimatedPressable
      onPress={() => onChange(seg.value)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: tokens.Spacing.sm,
        },
        animatedSegmentStyle,
      ]}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={seg.label}
    >
      <Text
        variant="labelLarge"
        weight={active ? 'semibold' : 'normal'}
        color={active ? 'brand' : 'primary'}
      >
        {seg.label}
      </Text>
    </AnimatedPressable>
  );
};

const SegmentedControl: React.FC<SegmentedControlProps> = ({ segments, value, onChange }) => {
  const { theme, accessibility } = useTheme();
  const tokens = useTokens();
  const [width, setWidth] = React.useState(0);
  const indicatorX = useSharedValue(0);

  const padding = tokens.Spacing.xs;
  const segmentWidth = width ? (width - padding * 2) / segments.length : 0;

  React.useEffect(() => {
    if (!segmentWidth) return;
    const index = segments.findIndex((s) => s.value === value);
    const target = index * segmentWidth;
    if (accessibility.isReduceMotionEnabled) {
      indicatorX.value = target;
    } else {
      indicatorX.value = withTiming(target, {
        duration: tokens.Animation.duration.in,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      });
    }
  }, [segmentWidth, value, accessibility.isReduceMotionEnabled]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: tokens.BorderRadius.lg,
        backgroundColor: withOpacity(theme.interactive.primary, 0.03),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.border.light,
        padding: padding,
        overflow: 'hidden',
      }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: padding,
              left: padding,
              bottom: padding,
              width: segmentWidth,
              backgroundColor: withOpacity(theme.interactive.primary, 0.08),
              borderRadius: tokens.BorderRadius.md,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.border.light,
            },
            indicatorStyle,
          ]}
        />
      )}
      {segments.map((seg) => (
        <SegmentButton
          key={seg.value}
          seg={seg}
          active={seg.value === value}
          onChange={onChange}
          accessibility={accessibility}
          tokens={tokens}
        />
      ))}
    </View>
  );
};

export default SegmentedControl;
