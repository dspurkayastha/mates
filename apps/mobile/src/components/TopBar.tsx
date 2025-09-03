import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text, Icon, useTheme, useTokens } from './ui';
import { ensureMinTouchTarget } from '@/utils/a11y';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TopBarProps {
  title: string;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ title, onBackPress, rightAction }) => {
  const { theme } = useTheme();
  const tokens = useTokens();
  const target = tokens.Spacing['5xl'];

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(tokens.Animation.press.scale, {
      duration: tokens.Animation.duration.out,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: tokens.Animation.duration.in,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: tokens.Spacing.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border.light,
        backgroundColor: theme.background.primary,
        minHeight: target,
      }}
    >
      {onBackPress ? (
        <AnimatedPressable
          onPress={onBackPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={ensureMinTouchTarget([
            styles.action,
            { width: target, height: target },
            animatedStyle,
          ])}
        >
          <Icon name="ArrowLeft" size="md" color="primary" />
        </AnimatedPressable>
      ) : (
        <View style={ensureMinTouchTarget([styles.action, { width: target, height: target }])} />
      )}

      <Text variant="titleLarge" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
        {title}
      </Text>

      {rightAction ? (
        <View style={ensureMinTouchTarget([styles.action, { width: target, height: target }])}>
          {rightAction}
        </View>
      ) : (
        <View style={ensureMinTouchTarget([styles.action, { width: target, height: target }])} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  action: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TopBar;
