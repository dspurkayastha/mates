/**
 * Badge Component
 * Semantic status badge with 2025 design standards
 * Supports variants and quiet outline style
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme, useTokens } from '../../design-system/ThemeProvider';
import Text from './Text';

// ============================================================================
// TYPES
// ============================================================================

type BadgeVariant = 'neutral' | 'positive' | 'warn' | 'danger';

interface BadgeProps {
  variant?: BadgeVariant;
  quiet?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  quiet = false,
  children,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const tokens = useTokens();

  const baseStyle: ViewStyle = {
    minHeight: tokens.Spacing['2xl'],
    paddingHorizontal: tokens.Spacing.sm,
    paddingVertical: tokens.Spacing.xs,
    borderRadius: tokens.BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  let backgroundColor: string = theme.background.secondary;
  let borderColor: string = 'transparent';
  let textColor: string = theme.text.secondary;

  switch (variant) {
    case 'positive':
      backgroundColor = quiet ? 'transparent' : theme.status.successBackground;
      borderColor = quiet ? theme.status.success : 'transparent';
      textColor = theme.status.success;
      break;
    case 'warn':
      backgroundColor = quiet ? 'transparent' : theme.status.warningBackground;
      borderColor = quiet ? theme.status.warning : 'transparent';
      textColor = theme.status.warning;
      break;
    case 'danger':
      backgroundColor = quiet ? 'transparent' : theme.status.errorBackground;
      borderColor = quiet ? theme.status.error : 'transparent';
      textColor = theme.status.error;
      break;
    default:
      backgroundColor = quiet ? 'transparent' : theme.background.secondary;
      borderColor = quiet ? theme.border.light : 'transparent';
      textColor = theme.text.secondary;
      break;
  }

  const containerStyle: ViewStyle = {
    backgroundColor,
    borderColor,
    borderWidth: quiet ? StyleSheet.hairlineWidth : 0,
  };

  const a11yLabel =
    accessibilityLabel || (typeof children === 'string' ? children : undefined);

  return (
    <View
      style={[baseStyle, containerStyle, style]}
      accessibilityRole="text"
      accessibilityLabel={a11yLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <Text variant="labelSmall" color={textColor} weight="semibold">
        {children}
      </Text>
    </View>
  );
};

export default Badge;
