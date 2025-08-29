/**
 * Analytics Dashboard Screen
 * Comprehensive expense analytics with modern data visualizations
 * 2025 design standards with interactive charts and insights
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../design-system/ThemeProvider';
import { generateAccessibilityLabel } from '../utils/accessibility';
import {
  Text,
  GlassCard,
  GlassButton,
  Icon,
  LoadingSkeleton,
  EmptyState,
  LineChart,
  DonutChart,
  BarChart,
  MetricsGrid,
} from '../components/ui';

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

type TimePeriod = '7d' | '30d' | '90d' | '1y';

interface DashboardData {
  overview: AnalyticsMetric[];
  expensesTrend: ChartData;
  categoriesBreakdown: ExpenseCategory[];
  dailyExpenses: DataPoint[];
  monthlyComparison: DataPoint[];
}

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

const generateMockData = (period: TimePeriod): DashboardData => {
  const now = new Date();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  
  // Generate expense trend data
  const trendPoints: DataPoint[] = [];
  let baseValue = 1200;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some realistic variation
    const variation = (Math.random() - 0.5) * 400;
    const seasonalFactor = 1 + 0.2 * Math.sin((i / days) * Math.PI * 2);
    const value = Math.max(0, baseValue + variation * seasonalFactor);
    
    trendPoints.push({
      value,
      date,
      label: date.toLocaleDateString(),
    });
    
    baseValue = value * 0.95 + 1200 * 0.05; // Slight regression to mean
  }

  // Calculate trend
  const firstValue = trendPoints[0].value;
  const lastValue = trendPoints[trendPoints.length - 1].value;
  const trendPercentage = ((lastValue - firstValue) / firstValue) * 100;
  
  // Generate categories data
  const categories: ExpenseCategory[] = [
    {
      id: 'food',
      name: 'Food & Dining',
      amount: 850,
      percentage: 35,
      color: '#FF6B6B',
      icon: 'Utensils',
    },
    {
      id: 'utilities',
      name: 'Utilities',
      amount: 480,
      percentage: 20,
      color: '#4ECDC4',
      icon: 'Zap',
    },
    {
      id: 'transport',
      name: 'Transport',
      amount: 360,
      percentage: 15,
      color: '#45B7D1',
      icon: 'Car',
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      amount: 290,
      percentage: 12,
      color: '#96CEB4',
      icon: 'Film',
    },
    {
      id: 'shopping',
      name: 'Shopping',
      amount: 240,
      percentage: 10,
      color: '#FFEAA7',
      icon: 'ShoppingBag',
    },
    {
      id: 'other',
      name: 'Other',
      amount: 180,
      percentage: 8,
      color: '#DDA0DD',
      icon: 'MoreHorizontal',
    },
  ];

  // Generate daily expenses for bar chart
  const dailyExpenses: DataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    dailyExpenses.push({
      value: Math.random() * 200 + 50,
      date,
      category: 'daily',
    });
  }

  // Generate monthly comparison
  const monthlyComparison: DataPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    monthlyComparison.push({
      value: Math.random() * 3000 + 2000,
      date,
      category: 'monthly',
    });
  }

  return {
    overview: [
      {
        id: 'total_spent',
        title: 'Total Spent',
        value: 2400,
        format: 'currency',
        change: trendPercentage,
        trend: trendPercentage > 0 ? 'up' : 'down',
      },
      {
        id: 'avg_daily',
        title: 'Daily Average',
        value: 80,
        format: 'currency',
        change: 12.5,
        trend: 'up',
      },
      {
        id: 'transactions',
        title: 'Transactions',
        value: 47,
        format: 'number',
        change: -8.2,
        trend: 'down',
      },
      {
        id: 'savings',
        title: 'Savings Rate',
        value: 23.5,
        format: 'percentage',
        change: 5.1,
        trend: 'up',
      },
    ],
    expensesTrend: {
      points: trendPoints,
      title: 'Expense Trend',
      subtitle: `Last ${days} days`,
      total: lastValue,
      change: trendPercentage,
      trend: trendPercentage > 0 ? 'up' : 'down',
    },
    categoriesBreakdown: categories,
    dailyExpenses,
    monthlyComparison,
  };
};

// ============================================================================
// COMPONENT
// ============================================================================

export const AnalyticsScreen: React.FC = () => {
  const colors = useColors();
  const tokens = useTokens();
  const { width: screenWidth } = Dimensions.get('window');

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Animations
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  // Initialize data and animations
  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = generateMockData(selectedPeriod);
    setDashboardData(data);
    setIsLoading(false);
    
    // Trigger animations
    headerOpacity.value = withSpring(1, { damping: 20, stiffness: 150 });
    contentTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await loadData();
    setIsRefreshing(false);
  };

  const handlePeriodChange = (period: TimePeriod) => {
    if (period !== selectedPeriod) {
      setSelectedPeriod(period);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Animation styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        contentTranslateY.value,
        [0, 50],
        [0, 50],
        Extrapolation.CLAMP
      )
    }],
  }));

  const getPeriodLabel = (period: TimePeriod): string => {
    switch (period) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 3 Months';
      case '1y': return 'Last Year';
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        {/* Header Skeleton */}
        <View
          style={{
            paddingTop: 60,
            paddingBottom: tokens.Spacing.lg,
            paddingHorizontal: tokens.Spacing.lg,
            backgroundColor: colors.background.elevated,
          }}
        >
          <LoadingSkeleton width={200} height={32} style={{ marginBottom: 8 }} />
          <LoadingSkeleton width={150} height={16} />
        </View>

        {/* Content Skeleton */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: tokens.Spacing.lg,
          }}
        >
          {/* Period Selector Skeleton */}
          <View
            style={{
              flexDirection: 'row',
              marginBottom: tokens.Spacing.lg,
              gap: tokens.Spacing.sm,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton
                key={i}
                width={80}
                height={36}
                borderRadius={tokens.BorderRadius.lg}
              />
            ))}
          </View>

          {/* Metrics Grid Skeleton */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: tokens.Spacing.lg,
              gap: tokens.Spacing.sm,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton
                key={i}
                width={(screenWidth - tokens.Spacing.lg * 2 - tokens.Spacing.sm) / 2}
                height={100}
                borderRadius={tokens.BorderRadius.lg}
              />
            ))}
          </View>

          {/* Chart Skeletons */}
          <LoadingSkeleton
            width="100%"
            height={280}
            borderRadius={tokens.BorderRadius.lg}
            style={{ marginBottom: tokens.Spacing.lg }}
          />
          
          <LoadingSkeleton
            width="100%"
            height={400}
            borderRadius={tokens.BorderRadius.lg}
          />
        </ScrollView>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <EmptyState
        type="error"
        title="Failed to Load Analytics"
        description="We couldn't load your analytics data. Please try again."
        actions={[
          {
            label: "Retry",
            onPress: loadData,
            variant: "primary",
            icon: "RefreshCw",
          }
        ]}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* Header */}
      <Animated.View
        style={[
          {
            paddingTop: 60,
            paddingBottom: tokens.Spacing.lg,
            paddingHorizontal: tokens.Spacing.lg,
          },
          headerAnimatedStyle,
        ]}
      >
        <LinearGradient
          colors={[colors.interactive.primary, colors.interactive.primaryHover]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        
        <Text
          variant="headlineLarge"
          color="inverse"
          weight="bold"
          accessibilityRole="header"
        >
          Analytics
        </Text>
        <Text
          variant="bodyLarge"
          color="inverse"
          style={{ marginTop: 4, opacity: 0.9 }}
        >
          Track your spending patterns and insights
        </Text>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: tokens.Spacing.lg,
            paddingBottom: 100, // Space for tab bar
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.interactive.primary}
              colors={[colors.interactive.primary]}
            />
          }
        >
          {/* Time Period Selector */}
          <View
            style={{
              flexDirection: 'row',
              marginBottom: tokens.Spacing.lg,
              gap: tokens.Spacing.sm,
            }}
            accessibilityRole="radiogroup"
            accessibilityLabel="Select time period for analytics"
          >
            {(['7d', '30d', '90d', '1y'] as TimePeriod[]).map((period) => (
              <GlassButton
                key={period}
                variant={selectedPeriod === period ? 'primary' : 'secondary'}
                buttonStyle={selectedPeriod === period ? 'tinted' : 'outlined'}
                size="medium"
                onPress={() => handlePeriodChange(period)}
                style={{ flex: 1 }}
                accessibilityRole="button"
                accessibilityState={{ checked: selectedPeriod === period }}
                accessibilityLabel={getPeriodLabel(period)}
              >
                {period.toUpperCase()}
              </GlassButton>
            ))}
          </View>

          {/* Overview Metrics */}
          <MetricsGrid
            metrics={dashboardData.overview}
            columns={2}
            animated={true}
            style={{ marginBottom: tokens.Spacing.lg }}
          />

          {/* Expense Trend Line Chart */}
          <LineChart
            data={dashboardData.expensesTrend}
            height={220}
            animated={true}
            interactive={true}
            showGrid={true}
            style={{ marginBottom: tokens.Spacing.lg }}
          />

          {/* Category Breakdown Donut Chart */}
          <DonutChart
            categories={dashboardData.categoriesBreakdown}
            title="Expense Categories"
            subtitle="Breakdown by spending category"
            size={220}
            animated={true}
            showLabels={true}
            style={{ marginBottom: tokens.Spacing.lg }}
          />

          {/* Daily Expenses Bar Chart */}
          <BarChart
            data={dashboardData.dailyExpenses}
            title="Daily Expenses"
            subtitle="Last 7 days spending"
            height={200}
            animated={true}
            showValues={true}
            style={{ marginBottom: tokens.Spacing.lg }}
          />

          {/* Monthly Comparison */}
          <LineChart
            data={{
              points: dashboardData.monthlyComparison,
              title: "Monthly Comparison",
              subtitle: "Spending trend over the year",
              change: 8.5,
              trend: 'up',
            }}
            height={220}
            animated={true}
            interactive={true}
            style={{ marginBottom: tokens.Spacing.lg }}
          />

          {/* Insights Card */}
          <GlassCard
            variant="translucent"
            size="large"
            style={{
              padding: tokens.Spacing.lg,
              marginBottom: tokens.Spacing.lg,
            }}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={generateAccessibilityLabel.status('insight', 'Spending insights and recommendations')}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: tokens.Spacing.md,
              }}
            >
              <Icon
                name="Lightbulb"
                size="md"
                color="warning"
                style={{ marginRight: tokens.Spacing.sm }}
              />
              <Text
                variant="titleMedium"
                color="primary"
                weight="semibold"
              >
                Insights & Recommendations
              </Text>
            </View>

            <View style={{ gap: tokens.Spacing.sm }}>
              <Text variant="bodyMedium" color="secondary">
                • Your food expenses increased by 15% this month. Consider meal planning to reduce costs.
              </Text>
              <Text variant="bodyMedium" color="secondary">
                • You're spending 23% less on transport compared to last month. Great job!
              </Text>
              <Text variant="bodyMedium" color="secondary">
                • Your savings rate improved by 5.1%. You're on track to meet your financial goals.
              </Text>
            </View>
          </GlassCard>

          {/* Export Actions */}
          <GlassCard
            variant="filled"
            size="large"
            style={{
              padding: tokens.Spacing.lg,
            }}
          >
            <Text
              variant="titleMedium"
              color="primary"
              weight="semibold"
              style={{ marginBottom: tokens.Spacing.md }}
            >
              Export Data
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: tokens.Spacing.md,
              }}
            >
              <GlassButton
                variant="secondary"
                buttonStyle="tinted"
                size="medium"
                fullWidth
                leftIcon={<Icon name="Download" size="sm" color="primary" />}
                onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                accessibilityLabel="Export data as CSV file"
              >
                CSV Export
              </GlassButton>
              
              <GlassButton
                variant="secondary"
                buttonStyle="tinted"
                size="medium"
                fullWidth
                leftIcon={<Icon name="FileText" size="sm" color="primary" />}
                onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                accessibilityLabel="Export data as PDF report"
              >
                PDF Report
              </GlassButton>
            </View>
          </GlassCard>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default AnalyticsScreen;