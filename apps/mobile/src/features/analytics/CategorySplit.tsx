import React from 'react';
import { View } from 'react-native';
import { Card, Text, LoadingSkeleton, useTheme, useTokens } from '@/components/ui';

interface CategoryItem {
  label: string;
  percent: number;
}

interface CategorySplitProps {
  data: CategoryItem[];
  loading?: boolean;
}

export default function CategorySplit({ data, loading }: CategorySplitProps) {
  const { theme } = useTheme();
  const tokens = useTokens();
  const caption = 'Top categories this month';

  return (
    <Card variant="elevated" style={{ marginBottom: tokens.Spacing.lg }}>
      <View style={{ padding: tokens.Spacing.lg }}>
        <Text variant="titleMedium" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
          Category Split
        </Text>
        {loading ? (
          <LoadingSkeleton height={80} />
        ) : data.length === 0 ? (
          <Text variant="bodySmall" color="secondary">
            No data
          </Text>
        ) : (
          data.map((item) => (
            <View
              key={item.label}
              style={{ marginBottom: tokens.Spacing.sm }}
              accessibilityLabel={`${item.label} ${item.percent.toFixed(0)} percent`}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <Text variant="bodySmall">{item.label}</Text>
                <Text variant="bodySmall">{item.percent.toFixed(0)}%</Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: theme.background.secondary,
                  borderRadius: tokens.BorderRadius.full,
                }}
              >
                <View
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: theme.interactive.primary,
                    height: '100%',
                    borderRadius: tokens.BorderRadius.full,
                  }}
                />
              </View>
            </View>
          ))
        )}
        <Text variant="bodySmall" color="secondary" style={{ marginTop: tokens.Spacing.sm }}>
          {caption}
        </Text>
      </View>
    </Card>
  );
}
