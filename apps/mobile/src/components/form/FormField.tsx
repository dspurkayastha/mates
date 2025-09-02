import React from 'react';
import { View } from 'react-native';
import { Text, useTheme, useTokens } from '@/components/ui';

interface FormFieldProps {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

export default function FormField({
  label,
  helper,
  error,
  required,
  children,
  accessibilityLabel,
}: FormFieldProps) {
  const { theme } = useTheme();
  const tokens = useTokens();
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion="polite"
      style={{ marginBottom: tokens.Spacing.lg }}
    >
      <Text variant="bodySmall" color="secondary" style={{ marginBottom: tokens.Spacing.xs }}>
        {label}
        {required ? ' *' : ''}
      </Text>
      {children}
      {(helper || error) && (
        <Text
          variant="bodySmall"
          color={error ? 'error' : 'secondary'}
          style={{ marginTop: tokens.Spacing.xs }}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
}
