import React from 'react';
import { View, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import Text from './Text';
import { usePressFeedback } from '../animation/usePressFeedback';
import { useTheme, useTokens, withOpacity } from '../../design-system/ThemeProvider';
import { ensureMinTouchTarget, asTabProps } from '@/utils/a11y';

interface Segment {
  key: string;
  label: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (key: string) => void;
}

const SegmentedTabButton = ({
  label,
  active,
  isLast,
  onPress,
}: {
  label: string;
  active: boolean;
  isLast: boolean;
  onPress: () => void;
}) => {
  const { theme } = useTheme();
  const tokens = useTokens();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback({ haptics: false });
  return (
    <Animated.View
      style={[
        {
          flex: 1,
          marginRight: isLast ? 0 : tokens.Spacing.xs,
          borderRadius: tokens.BorderRadius.lg,
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...asTabProps(active)}
        accessibilityLabel={label}
        style={ensureMinTouchTarget({
          paddingVertical: tokens.Spacing.sm,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: tokens.BorderRadius.lg,
          backgroundColor: active
            ? withOpacity(theme.interactive.primary, 0.08)
            : 'transparent',
        })}
      >
        <Text
          variant="labelLarge"
          weight={active ? 'semibold' : 'normal'}
          color={active ? 'brand' : 'primary'}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

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
      {segments.map((seg, idx) => (
        <SegmentedTabButton
          key={seg.key}
          label={seg.label}
          active={seg.key === value}
          isLast={idx === segments.length - 1}
          onPress={() => onChange(seg.key)}
        />
      ))}
    </View>
  );
};

export default SegmentedControl;
