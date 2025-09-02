import React from 'react';
import { View } from 'react-native';
import { Card, Text, useTokens } from '@/components/ui';

interface KpiCardProps {
  label: string;
  value: string;
  accessibilityLabel?: string;
}

export default function KpiCard({ label, value, accessibilityLabel }: KpiCardProps) {
  const tokens = useTokens();
  const a11y = accessibilityLabel ?? `${label} ${value}`;

  return (
    <Card variant="elevated" accessibilityLabel={a11y} style={{ flex: 1 }}>
      <View style={{ padding: tokens.Spacing.md }}>
        <Text variant="bodySmall" color="secondary">
          {label}
        </Text>
        <Text variant="titleMedium" weight="semibold" align="right">
          {value}
        </Text>
      </View>
    </Card>
  );
}
