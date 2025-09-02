import React from 'react';
import { View, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import Text from './Text';
import { usePressFeedback } from '../animation/usePressFeedback';
import { useTheme, useTokens, withOpacity } from '../../design-system/ThemeProvider';

interface Segment {
  key: string;
  label: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (key: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ segments, value, onChange }) => {
  const { theme } = useTheme();
  const tokens = useTokens();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: withOpacity(theme.interactive.primary, 0.04),
        borderRadius: tokens.BorderRadius.lg,
        padding: tokens.Spacing.xs,
        marginBottom: tokens.Spacing.lg,
      }}
    >
      {segments.map((seg, idx) => {
        const active = seg.key === value;
        const { animatedStyle, onPressIn, onPressOut } = usePressFeedback({ haptics: false });
        return (
          <Animated.View
            key={seg.key}
            style={[
              { flex: 1, marginRight: idx === segments.length - 1 ? 0 : tokens.Spacing.xs, borderRadius: tokens.BorderRadius.lg },
              animatedStyle,
            ]}
          >
            <Pressable
              onPress={() => onChange(seg.key)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={seg.label}
              style={{
                paddingVertical: tokens.Spacing.sm,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: tokens.BorderRadius.lg,
                backgroundColor: active ? withOpacity(theme.interactive.primary, 0.08) : 'transparent',
              }}
            >
              <Text variant="labelLarge" weight={active ? 'semibold' : 'normal'} color={active ? 'brand' : 'primary'}>
                {seg.label}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
