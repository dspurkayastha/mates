import React from 'react';
import { View } from 'react-native';
import { Card, Text, LoadingSkeleton, useTheme, useTokens } from '@/components/ui';
import Svg, { Path } from 'react-native-svg';

interface TrendsChartProps {
  data: { label: string; total: number }[];
  loading?: boolean;
}

export default function TrendsChart({ data, loading }: TrendsChartProps) {
  const { theme } = useTheme();
  const tokens = useTokens();
  const height = 120;
  const width = 240;
  const padding = 12;
  const max = Math.max(...data.map((d) => d.total), 1);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);
  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - (d.total / max) * (height - padding * 2) - padding;
    return [x, y];
  });
  const pathD =
    points.length > 0
      ? points.reduce((acc, [x, y], i) => (i === 0 ? `M${x} ${y}` : `${acc} L${x} ${y}`), '')
      : '';
  const caption = `Spending last ${data.length} months`;

  return (
    <Card variant="elevated" style={{ marginBottom: tokens.Spacing.lg }}>
      <View style={{ padding: tokens.Spacing.lg }}>
        <Text variant="titleMedium" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
          Trends
        </Text>
        {loading ? (
          <LoadingSkeleton height={height} />
        ) : data.length === 0 ? (
          <Text variant="bodySmall" color="secondary">
            No data
          </Text>
        ) : (
          <Svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            accessibilityRole="image"
            accessibilityLabel={caption}
          >
            <Path d={pathD} stroke={theme.interactive.primary} strokeWidth={2} fill="none" />
          </Svg>
        )}
        <Text variant="bodySmall" color="secondary" style={{ marginTop: tokens.Spacing.sm }}>
          {caption}
        </Text>
      </View>
    </Card>
  );
}
