import React from 'react';
import { View } from 'react-native';
import { useTokens, useTheme } from '../../design-system/ThemeProvider';
import Text from './Text';
import Button from './Button';
import Icon from './Icon';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  accessibilityLabel?: string;
}

export default function ErrorBanner({ message, onRetry, accessibilityLabel }: ErrorBannerProps) {
  const { theme } = useTheme();
  const tokens = useTokens();
  const a11y = accessibilityLabel ?? message;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.status.errorBackground,
        borderRadius: tokens.BorderRadius.md,
        padding: tokens.Spacing.md,
        marginBottom: tokens.Spacing.lg,
      }}
      accessibilityRole="alert"
      accessibilityLabel={a11y}
    >
      <Icon
        name="CircleAlert"
        size="sm"
        color="danger"
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ marginRight: tokens.Spacing.sm }}
      />
      <Text variant="bodySmall" color="danger" style={{ flex: 1 }}>
        {message}
      </Text>
      {onRetry && (
        <Button variant="ghost" size="sm" onPress={onRetry} accessibilityLabel="Retry">
          Retry
        </Button>
      )}
    </View>
  );
}
