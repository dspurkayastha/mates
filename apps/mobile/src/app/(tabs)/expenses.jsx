import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { format } from 'date-fns';
import {
  ScreenBackground,
  ListItem,
  LoadingSkeleton,
  Card,
  Button,
  Text,
  useTokens,
} from '@/components/ui';
import SegmentedControl from '@/components/ui/SegmentedControl';
import {
  useExpenses,
  useHouseholdBalances,
  useBudget,
  useUpsertBudget,
} from '@/features/expenses/hooks';
import ExpensesSummaryCard from '@/features/expenses/components/ExpensesSummaryCard';
import { formatINR } from '@/utils/format';

export default function ExpensesScreen() {
  const tokens = useTokens();
  const [filter, setFilter] = React.useState('all');
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;
  const { data: expenses = [], isLoading } = useExpenses({
    groupId,
    filter: filter === 'settled' ? 'settled' : filter === 'net' ? 'unsettled' : 'all',
  });

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const monthExpenses = React.useMemo(
    () => expenses.filter((e) => e.created_at.startsWith(monthKey.slice(0, 7))),
    [expenses, monthKey],
  );
  const total = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const count = monthExpenses.length;
  const average = count ? total / count : 0;

  const { data: balances = [] } = useHouseholdBalances(groupId);
  const { data: budget } = useBudget(groupId, monthKey);
  const upsertBudget = useUpsertBudget(groupId);

  const handleSetLimit = () => {
    Alert.prompt('Set Limit', '', (val) => {
      const parsed = Number(val);
      if (!isNaN(parsed)) upsertBudget.mutate({ monthKey, limit: parsed });
    });
  };

  if (isLoading) {
    return (
      <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
        <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
          {[...Array(5)].map((_, i) => (
            <LoadingSkeleton key={i} height={72} style={{ marginBottom: tokens.Spacing.md }} />
          ))}
        </ScrollView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        <SegmentedControl
          segments={[
            { key: 'all', label: 'All' },
            { key: 'settled', label: 'Settled' },
            { key: 'net', label: 'Owe/Owed' },
          ]}
          value={filter}
          onChange={setFilter}
        />

        <ExpensesSummaryCard total={total} count={count} average={average} />

        <Card variant="elevated" style={{ marginBottom: tokens.Spacing.lg }}>
          <Text variant="bodySmall" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
            Household Balances
          </Text>
          {balances.slice(0, 3).map((b) => (
            <ListItem
              key={b.user_id}
              title={b.user_id}
              accessory={{
                type: 'badge',
                label: formatINR(b.balance),
                variant: b.balance >= 0 ? 'positive' : 'danger',
                quiet: true,
              }}
            />
          ))}
        </Card>

        <Card variant="elevated" style={{ marginBottom: tokens.Spacing.lg }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: tokens.Spacing.md,
            }}
          >
            <Text variant="bodySmall" weight="semibold">
              Budget
            </Text>
            <Button variant="secondary" size="sm" onPress={handleSetLimit} accessibilityLabel="Set Limit">
              Set Limit
            </Button>
          </View>
          <Text variant="bodySmall" color="secondary">
            Limit: {formatINR(budget?.limit ?? 0)}
          </Text>
        </Card>

        {expenses.map((e) => (
          <ListItem
            key={e.id}
            title={e.title}
            meta={format(new Date(e.created_at), 'd MMM')}
            accessory={{
              type: 'badge',
              label: e.status === 'SETTLED' ? 'Settled' : 'Pending',
              variant: e.status === 'SETTLED' ? 'positive' : 'warn',
              quiet: true,
            }}
          />
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}
