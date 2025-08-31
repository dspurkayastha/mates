import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Text,
  GlassCard,
  GlassButton,
  Icon,
  ListItem,
  useTheme,
  useTokens
} from '../../components/ui';
import * as Haptics from 'expo-haptics';

export default function ExpensesScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const { theme } = useTheme();
  const colors = theme;
  const tokens = useTokens();

  // Placeholder transactions
  const transactions = [
    {
      id: '1',
      title: 'Grocery Shopping',
      date: 'August 20, 2025',
      paidBy: 'You',
      sharedWith: 'All roommates',
      amount: '2,450',
      status: 'PENDING',
    },
    {
      id: '2',
      title: 'Electricity Bill',
      date: 'August 15, 2025',
      paidBy: 'Roommate',
      sharedWith: 'All roommates',
      amount: '1,800',
      status: 'SETTLED',
    },
    {
      id: '3',
      title: 'Internet Bill',
      date: 'August 10, 2025',
      paidBy: 'You',
      sharedWith: 'All roommates',
      amount: '1,200',
      status: 'SETTLED',
    },
    {
      id: '4',
      title: 'Dinner Takeout',
      date: 'August 5, 2025',
      paidBy: 'Roommate',
      sharedWith: 'You, Roommate',
      amount: '850',
      status: 'PENDING',
    },
  ];

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: tokens.Spacing.lg,
          paddingTop: tokens.Spacing.sm
        }}>
          <Icon name="DollarSign" size="xl" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
          <Text variant="headlineMedium" weight="bold">Expenses</Text>
        </View>

        {/* Glass Tabs */}
        <View style={{
          flexDirection: 'row',
          marginBottom: tokens.Spacing.lg,
          gap: tokens.Spacing.sm
        }}>
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
          {transactions.map((transaction) => (
            <ListItem
              key={transaction.id}
              media={<Icon name="Receipt" size="lg" color="brand" />}
              title={transaction.title}
              meta={`Paid by ${transaction.paidBy} • ₹${transaction.amount}`}
              accessory={{ type: 'chevron' }}
              onPress={() => {}}
            />
          ))}
        </View>

        {/* Summary Section */}
        <GlassCard
          variant="translucent"
          size="large"
          style={{ marginBottom: tokens.Spacing.lg }}
        >
          <View style={{ padding: tokens.Spacing.lg }}>
            <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
              August Summary
            </Text>

            <View style={{
              backgroundColor: colors.background.secondary,
              borderRadius: tokens.BorderRadius.md,
              padding: tokens.Spacing.md
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: tokens.Spacing.sm
              }}>
                <Text variant="bodyMedium" color="secondary">Total Expenses:</Text>
                <Text variant="bodyMedium" weight="medium">₹6,300</Text>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: tokens.Spacing.sm
              }}>
                <Text variant="bodyMedium" color="secondary">You paid:</Text>
                <Text variant="bodyMedium" weight="medium">₹3,650</Text>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: tokens.Spacing.sm
              }}>
                <Text variant="bodyMedium" color="secondary">You owe:</Text>
                <Text variant="bodyMedium" weight="medium">₹400</Text>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: tokens.Spacing.sm
              }}>
                <Text variant="bodyMedium" color="secondary">You are owed:</Text>
                <Text variant="bodyMedium" weight="medium">₹850</Text>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <Text variant="bodyMedium" color="secondary">Net balance:</Text>
                <Text variant="bodyMedium" weight="bold" color="success">
                  +₹450
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Glass Action Buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: tokens.Spacing.lg,
          gap: tokens.Spacing.md
        }}>
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

