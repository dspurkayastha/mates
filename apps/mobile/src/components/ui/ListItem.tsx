import React from 'react';
import { Pressable, View, ViewStyle, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme, useTokens } from '../../design-system/ThemeProvider';
import Text from './Text';
import Icon from './Icon';
import GlassToggle from './GlassToggle';
import StatusIndicator from './StatusIndicator';

// ============================================================================
// TYPES
// ============================================================================

type Density = 'comfortable' | 'compact';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

type ListItemAccessory =
  | { type: 'chevron' }
  | { type: 'toggle'; value: boolean; onValueChange: (val: boolean) => void }
  | { type: 'badge'; label: string; variant?: BadgeVariant };

interface ListItemProps {
  title: string;
  meta?: string;
  media?: React.ReactNode;
  accessory?: ListItemAccessory;
  density?: Density;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ListItem: React.FC<ListItemProps> = ({
  title,
  meta,
  media,
  accessory,
  density = 'comfortable',
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme, accessibility } = useTheme();
  const tokens = useTokens();

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
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

  const paddingVertical =
    density === 'compact' ? tokens.Spacing.md : tokens.Spacing.lg;

  const renderAccessory = () => {
    if (!accessory) return null;
    switch (accessory.type) {
      case 'chevron':
        return <Icon name="ArrowRight" size="md" color="tertiary" />;
      case 'toggle':
        return (
          <GlassToggle
            value={accessory.value}
            onValueChange={accessory.onValueChange}
            accessibilityLabel={`${title} toggle`}
          />
        );
      case 'badge':
        return (
          <StatusIndicator
            variant={accessory.variant || 'neutral'}
            label={accessory.label}
            size="small"
          />
        );
      default:
        return null;
    }
  };

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical,
        paddingHorizontal: tokens.Spacing.lg,
      }}
    >
      {media && (
        <View
          style={{
            width: tokens.Spacing['4xl'],
            height: tokens.Spacing['4xl'],
            marginRight: tokens.Spacing.md,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {media}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text variant="titleSmall" weight="semibold">
          {title}
        </Text>
        {meta && (
          <Text variant="bodySmall" color="secondary">
            {meta}
          </Text>
        )}
      </View>
      {accessory && (
        <View style={{ marginLeft: tokens.Spacing.md }}>{renderAccessory()}</View>
      )}
    </View>
  );

  const containerStyle: ViewStyle = {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border.light,
    backgroundColor: theme.background.primary,
  };

  if (onPress) {
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[containerStyle, style, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        testID={testID}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <View
      style={[containerStyle, style]}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="text"
      testID={testID}
    >
      {content}
    </View>
  );
};

export default ListItem;
