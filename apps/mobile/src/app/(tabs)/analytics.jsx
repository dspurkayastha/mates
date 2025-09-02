import React from 'react';
import { View, ScrollView } from 'react-native';
import {
  ScreenBackground,
  Text,
  LoadingSkeleton,
  ListItem,
  Card,
  EmptyState,
  ErrorBanner,
  useTokens,
} from '@/components/ui';
import { useExpenses } from '@/features/expenses/hooks';
import { useGroceries } from '@/features/groceries/hooks';
import { useChores } from '@/features/chores/hooks';
import KpiCard from '@/features/analytics/KpiCard';
import TrendsChart from '@/features/analytics/TrendsChart';
import CategorySplit from '@/features/analytics/CategorySplit';
import {
  getThisMonthSpend,
  getNumExpensesThisMonth,
  getGroceriesBoughtPercent,
  getChoresCompletedPercent,
  getMonthsSeries,
  getCategorySplit,
} from '@/features/analytics/selectors';

export default function AnalyticsScreen() {
  const tokens = useTokens();
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;
  const {
    data: expenses = [],
    isLoading: loadingExpenses,
    error: expensesError,
    refetch: refetchExpenses,
  } = useExpenses({ groupId });
  const {
    data: groceries = [],
    isLoading: loadingGroceries,
    error: groceriesError,
    refetch: refetchGroceries,
  } = useGroceries({ groupId });
  const {
    data: chores = [],
    isLoading: loadingChores,
    error: choresError,
    refetch: refetchChores,
  } = useChores({ groupId, range: 'week' });

  const spend = getThisMonthSpend(expenses);
  const numExpenses = getNumExpensesThisMonth(expenses);
  const groceriesPct = getGroceriesBoughtPercent(groceries);
  const choresPct = getChoresCompletedPercent(chores);
  const monthsSeries = getMonthsSeries(expenses);
  const categoryData = getCategorySplit(expenses);

  const anyLoading = loadingExpenses || loadingGroceries || loadingChores;

  return (
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        {expensesError && (
          <ErrorBanner message="Failed to load expenses" onRetry={refetchExpenses} />
        )}
        {groceriesError && (
          <ErrorBanner message="Failed to load groceries" onRetry={refetchGroceries} />
        )}
        {choresError && <ErrorBanner message="Failed to load chores" onRetry={refetchChores} />}

        <View
          style={{
            flexDirection: 'row',
            gap: tokens.Spacing.md,
            marginBottom: tokens.Spacing.lg,
          }}
        >
          {anyLoading ? (
            [...Array(4)].map((_, i) => (
              <LoadingSkeleton
                key={i}
                height={72}
                style={{ flex: 1, borderRadius: tokens.BorderRadius.lg }}
              />
            ))
          ) : (
            <>
              <KpiCard label="This Month Spend" value={`₹${spend.toFixed(0)}`} />
              <KpiCard label="# Expenses" value={`${numExpenses}`} />
              <KpiCard label="Groceries Bought %" value={`${groceriesPct.toFixed(0)}%`} />
              <KpiCard label="Chores Completed %" value={`${choresPct.toFixed(0)}%`} />
            </>
          )}
        </View>

        <TrendsChart data={monthsSeries} loading={loadingExpenses} />
        <CategorySplit data={categoryData} loading={loadingExpenses} />

        <Card variant="elevated">
          <View style={{ padding: tokens.Spacing.lg }}>
            <Text
              variant="titleMedium"
              weight="semibold"
              style={{ marginBottom: tokens.Spacing.md }}
            >
              Recent Activity
            </Text>
            {loadingExpenses ? (
              [...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} height={56} style={{ marginBottom: tokens.Spacing.sm }} />
              ))
            ) : expenses.length === 0 ? (
              <EmptyState
                title="No activity yet"
                description="Add an expense to see it here."
                style={{ paddingVertical: tokens.Spacing.xl }}
              />
            ) : (
              expenses
                .slice(0, 5)
                .map((e) => (
                  <ListItem key={e.id} title={e.title} meta={`₹${e.amount}`} density="compact" />
                ))
            )}
          </View>
        </Card>
      </ScrollView>
    </ScreenBackground>
  );
}
