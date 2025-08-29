/**
 * Advanced Data Visualization Components
 * Modern charts and analytics for expense tracking and insights
 * 2025 design standards with accessibility and animations
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import Text from './Text';
import Card from './Card';
import Icon from './Icon';

// ============================================================================
// TYPES
// ============================================================================

export interface DataPoint {
  value: number;
  date: Date;
  label?: string;
  category?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface AnalyticsMetric {
  id: string;
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  change: number;
  trend: 'up' | 'down';
}

export interface ChartData {
  points: DataPoint[];
  title: string;
  subtitle?: string;
  total?: number;
  change?: number;
  trend?: 'up' | 'down';
}

interface ChartProps {
  style?: ViewStyle;
  height?: number;
  animated?: boolean;
  interactive?: boolean;
  showGrid?: boolean;
  showValues?: boolean;
  showLabels?: boolean;
}

// ============================================================================
// COMPONENTS
// ============================================================================

export const LineChart: React.FC<ChartProps & { data: ChartData }> = ({
  data,
  style,
  height = 200,
}) => {
  const colors = useColors();
  const tokens = useTokens();

  return (
    <Card variant="elevated" style={style}>
      <View style={{ padding: tokens.Spacing.lg }}>
        <Text variant="titleMedium" color="primary" weight="semibold">
          {data.title}
        </Text>
        {data.subtitle && (
          <Text variant="bodySmall" color="secondary" style={{ marginTop: 4 }}>
            {data.subtitle}
          </Text>
        )}
        <View
          style={{
            height,
            backgroundColor: colors.background.secondary,
            borderRadius: tokens.BorderRadius.md,
            marginTop: tokens.Spacing.md,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text variant="bodyMedium" color="tertiary">
            Line Chart Placeholder
          </Text>
        </View>
      </View>
    </Card>
  );
};

export const DonutChart: React.FC<ChartProps & { 
  categories: ExpenseCategory[];
  title: string;
  subtitle?: string;
  size?: number;
}> = ({
  categories,
  title,
  subtitle,
  size = 200,
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();

  return (
    <Card variant="elevated" style={style}>
      <View style={{ padding: tokens.Spacing.lg }}>
        <Text variant="titleMedium" color="primary" weight="semibold">
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" color="secondary" style={{ marginTop: 4 }}>
            {subtitle}
          </Text>
        )}
        <View
          style={{
            height: size,
            backgroundColor: colors.background.secondary,
            borderRadius: tokens.BorderRadius.md,
            marginTop: tokens.Spacing.md,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text variant="bodyMedium" color="tertiary">
            Donut Chart Placeholder
          </Text>
        </View>
        
        {/* Categories Legend */}
        <View style={{ marginTop: tokens.Spacing.md, gap: tokens.Spacing.sm }}>
          {categories.slice(0, 3).map((category) => (
            <View
              key={category.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: category.color,
                    marginRight: tokens.Spacing.sm,
                  }}
                />
                <Text variant="bodySmall" color="secondary" style={{ flex: 1 }}>
                  {category.name}
                </Text>
              </View>
              <Text variant="bodySmall" color="primary" weight="semibold">
                ${category.amount}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};

export const BarChart: React.FC<ChartProps & { 
  data: DataPoint[];
  title: string;
  subtitle?: string;
}> = ({
  data,
  title,
  subtitle,
  height = 200,
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();

  return (
    <Card variant="elevated" style={style}>
      <View style={{ padding: tokens.Spacing.lg }}>
        <Text variant="titleMedium" color="primary" weight="semibold">
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" color="secondary" style={{ marginTop: 4 }}>
            {subtitle}
          </Text>
        )}
        <View
          style={{
            height,
            backgroundColor: colors.background.secondary,
            borderRadius: tokens.BorderRadius.md,
            marginTop: tokens.Spacing.md,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text variant="bodyMedium" color="tertiary">
            Bar Chart Placeholder
          </Text>
        </View>
      </View>
    </Card>
  );
};

export const MetricsGrid: React.FC<{
  metrics: AnalyticsMetric[];
  columns?: number;
  animated?: boolean;
  style?: ViewStyle;
}> = ({
  metrics,
  columns = 2,
  style,
}) => {
  const colors = useColors();
  const tokens = useTokens();

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: tokens.Spacing.sm,
        },
        style,
      ]}
    >
      {metrics.map((metric) => (
        <View key={metric.id} style={{ flex: columns === 2 ? 1 : undefined, minWidth: 120 }}>
          <Card variant="filled" style={{ padding: tokens.Spacing.lg }}>
            <Text variant="bodySmall" color="secondary" style={{ marginBottom: 4 }}>
              {metric.title}
            </Text>
            <Text variant="titleLarge" color="primary" weight="bold">
              {formatValue(metric.value, metric.format)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Icon
                name={metric.trend === 'up' ? 'TrendingUp' : 'TrendingDown'}
                size="xs"
                color={metric.trend === 'up' ? 'success' : 'error'}
                style={{ marginRight: 4 }}
              />
              <Text
                variant="labelSmall"
                color={metric.trend === 'up' ? 'success' : 'error'}
                weight="semibold"
              >
                {Math.abs(metric.change)}%
              </Text>
            </View>
          </Card>
        </View>
      ))}
    </View>
  );
};

export default {
  LineChart,
  DonutChart,
  BarChart,
  MetricsGrid,
};
