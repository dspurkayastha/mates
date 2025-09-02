import React from 'react';
import { View } from 'react-native';
import { Card, Text, useTokens } from '@/components/ui';
import { formatINR } from '@/utils/format';

interface Props {
  total: number;
  count: number;
  average: number;
}

const ExpensesSummaryCard: React.FC<Props> = ({ total, count, average }) => {
  const tokens = useTokens();
  return (
    <Card variant="elevated" style={{ marginBottom: tokens.Spacing.lg }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: tokens.Spacing.sm,
        }}
      >
        <Text variant="bodySmall" color="secondary">
          Total Spent
        </Text>
        <Text variant="bodySmall">{formatINR(total)}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: tokens.Spacing.sm,
        }}
      >
        <Text variant="bodySmall" color="secondary">
          Expenses
        </Text>
        <Text variant="bodySmall">{count}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="bodySmall" color="secondary">
          Average
        </Text>
        <Text variant="bodySmall">{formatINR(average)}</Text>
      </View>
    </Card>
  );
};

export default ExpensesSummaryCard;
