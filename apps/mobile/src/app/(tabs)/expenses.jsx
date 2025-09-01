import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { ScrollView, SafeAreaView, View } from 'react-native';

import {
  Text,
  GlassCard,
  GlassButton,
  Icon,
  ListItem,
  Badge,
  LoadingSkeleton,
  useTheme,
  useTokens,
} from '../../components/ui';
import { useExpenses } from '../../hooks';

export default function ExpensesScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const { theme } = useTheme();
  const colors = theme;
  const tokens = useTokens();

  const { data: transactions = [], isLoading } = useExpenses();

  const getBadgeProps = (status) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Pending', variant: 'warn' };
      case 'SETTLED':
        return { label: 'Settled', variant: 'positive' };
      case 'OWED':
        return { label: 'Owed', variant: 'brand' };
      case 'OWE':
        return { label: 'Owe', variant: 'neutral' };
      default:
        return { label: status, variant: 'neutral' };
    }
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In a real app, this would filter the transactions
  };

  const handleSettleUp = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // This would open UPI/payment options
    console.log('Open settle up options');
  };

  const handleAddExpense = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // This would open the expense form
    console.log('Open add expense form');
  };

  const filtered =
    activeTab === 'all'
      ? transactions
      : transactions.filter((t) => t.status === activeTab.toUpperCase());

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} height={72} style={{ marginBottom: tokens.Spacing.md }} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: tokens.Spacing.lg,
            paddingTop: tokens.Spacing.sm,
          }}
        >
          <Icon
            name="DollarSign"
            size="xl"
            color="brand"
            style={{ marginRight: tokens.Spacing.sm }}
          />
          <Text variant="headlineMedium" weight="bold">
            Expenses
          </Text>
        </View>

        {/* Glass Tabs */}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: tokens.Spacing.lg,
            gap: tokens.Spacing.sm,
          }}
        >
          <GlassButton
            variant={activeTab === 'all' ? 'primary' : 'secondary'}
            buttonStyle={activeTab === 'all' ? 'tinted' : 'outlined'}
            size="medium"
            onPress={() => handleTabPress('all')}
            style={{ flex: 1 }}
          >
            All
          </GlassButton>

          <GlassButton
            variant={activeTab === 'settled' ? 'primary' : 'secondary'}
            buttonStyle={activeTab === 'settled' ? 'tinted' : 'outlined'}
            size="medium"
            onPress={() => handleTabPress('settled')}
            style={{ flex: 1 }}
          >
            Settled
          </GlassButton>

          <GlassButton
            variant={activeTab === 'owe' ? 'primary' : 'secondary'}
            buttonStyle={activeTab === 'owe' ? 'tinted' : 'outlined'}
            size="medium"
            onPress={() => handleTabPress('owe')}
            style={{ flex: 1 }}
          >
            Owe/Owed
          </GlassButton>
        </View>

        {/* Transaction List */}
        <View style={{ marginBottom: tokens.Spacing.lg }}>
          {filtered.map((transaction) => {
            const badge = getBadgeProps(transaction.status);
            return (
              <ListItem
                key={transaction.id}
                media={<Icon name="Receipt" size="lg" color="brand" />}
                title={transaction.title}
                meta={
                  <>
                    <Text variant="bodySmall" color="secondary">
                      {transaction.date}
                    </Text>
                    <Text variant="bodySmall" color="secondary">
                      Paid by {transaction.paidBy}
                    </Text>
                  </>
                }
                accessory={
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text variant="bodyMedium" weight="medium" style={{ textAlign: 'right' }}>
                      ₹{transaction.amount}
                    </Text>
                    <Badge variant={badge.variant} quiet style={{ marginTop: tokens.Spacing.xs }}>
                      {badge.label}
                    </Badge>
                  </View>
                }
                onPress={() => {}}
              />
            );
          })}
        </View>

        {/* Summary Section */}
        <GlassCard variant="translucent" size="large" style={{ marginBottom: tokens.Spacing.lg }}>
          <View style={{ padding: tokens.Spacing.lg }}>
            <Text
              variant="titleLarge"
              weight="semibold"
              style={{ marginBottom: tokens.Spacing.md }}
            >
              August Summary
            </Text>

            <View
              style={{
                backgroundColor: colors.background.secondary,
                borderRadius: tokens.BorderRadius.md,
                padding: tokens.Spacing.md,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: tokens.Spacing.sm,
                }}
              >
                <Text variant="bodyMedium" color="secondary">
                  Total Expenses:
                </Text>
                <Text variant="bodyMedium" weight="medium">
                  ₹6,300
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: tokens.Spacing.sm,
                }}
              >
                <Text variant="bodyMedium" color="secondary">
                  You paid:
                </Text>
                <Text variant="bodyMedium" weight="medium">
                  ₹3,650
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: tokens.Spacing.sm,
                }}
              >
                <Text variant="bodyMedium" color="secondary">
                  You owe:
                </Text>
                <Text variant="bodyMedium" weight="medium">
                  ₹400
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: tokens.Spacing.sm,
                }}
              >
                <Text variant="bodyMedium" color="secondary">
                  You are owed:
                </Text>
                <Text variant="bodyMedium" weight="medium">
                  ₹850
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text variant="bodyMedium" color="secondary">
                  Net balance:
                </Text>
                <Text variant="bodyMedium" weight="bold" color="success">
                  +₹450
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Glass Action Buttons */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: tokens.Spacing.lg,
            gap: tokens.Spacing.md,
          }}
        >
          <GlassButton
            variant="success"
            buttonStyle="tinted"
            size="large"
            leftIcon={<Icon name="Check" size="sm" color="inverse" />}
            onPress={handleSettleUp}
            style={{ flex: 1 }}
          >
            Settle Up
          </GlassButton>

          <GlassButton
            variant="primary"
            buttonStyle="tinted"
            size="large"
            leftIcon={<Icon name="Plus" size="sm" color="inverse" />}
            onPress={handleAddExpense}
            style={{ flex: 1 }}
          >
            Add Expense
          </GlassButton>
        </View>

        {/* Spacer for bottom tabs */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
