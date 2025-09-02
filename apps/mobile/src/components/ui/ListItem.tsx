import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { usePressFeedback } from '../animation/usePressFeedback';

import Badge from './Badge';
import GlassToggle from './GlassToggle';
import Icon from './Icon';
import Text from './Text';
import { useTheme, useTokens } from '../../design-system/ThemeProvider';

// ============================================================================
// TYPES
// ============================================================================

type Density = 'comfortable' | 'compact';

// UI Badge variants (current refactor)
type BadgeVariant = 'neutral' | 'positive' | 'warn' | 'danger' | 'brand';

// Legacy/domain variants seen in older branches (mapped to UI variants)
type DomainBadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

type ListItemAccessoryBase =
  | { type: 'chevron' }
  | { type: 'toggle'; value: boolean; onValueChange: (val: boolean) => void }
  | {
      type: 'badge';
      label: string;
      variant?: BadgeVariant | DomainBadgeVariant;
      quiet?: boolean;
    };

type ListItemAccessory = ListItemAccessoryBase | React.ReactNode;

interface ListItemProps {
  title: string;
  meta?: React.ReactNode;
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
  const { theme } = useTheme();
  const tokens = useTokens();
  const { animatedStyle, onPressIn, onPressOut } = usePressFeedback({ haptics: false });

  const paddingVertical = density === 'compact' ? tokens.Spacing.md : tokens.Spacing.lg;

  const renderAccessory = () => {
    if (!accessory) return null;

    // Allow callers to pass a fully-formed element
    if (React.isValidElement(accessory)) return accessory as React.ReactElement;

    // Descriptor form
    if (typeof accessory === 'object' && accessory !== null && 'type' in accessory) {
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

        case 'badge': {
          // Map legacy/domain variants → current UI variants
          const map: Record<string, BadgeVariant> = {
            // domain → ui
            success: 'positive',
            warning: 'warn',
            error: 'danger',
            info: 'neutral',
            neutral: 'neutral',
            // direct ui variants supported as-is
            positive: 'positive',
            warn: 'warn',
            danger: 'danger',
            brand: 'brand',
          };

          const desired = (accessory.variant ?? 'neutral') as string;
          const mappedVariant: BadgeVariant = map[desired] ?? 'neutral';

          return (
            <Badge variant={mappedVariant} quiet={accessory.quiet}>
              {accessory.label}
            </Badge>
          );
        }

        default:
          return null;
      }
    }

    // Fallback render
    return <>{accessory}</>;
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
          <View style={{ marginTop: tokens.Spacing.xs }}>
            {typeof meta === 'string' ? (
              <Text variant="bodySmall" color="secondary">
                {meta}
              </Text>
            ) : (
              meta
            )}
          </View>
        )}
      </View>
      {accessory && (
        <View style={{ marginLeft: tokens.Spacing.md, alignItems: 'flex-end' }}>
          {renderAccessory()}
        </View>
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
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[containerStyle, style, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
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
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="text"
      testID={testID}
    >
      {content}
    </View>
  );
};

export default ListItem;
