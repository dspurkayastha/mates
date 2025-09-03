import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import FloatingActionMenu from '@/components/FloatingActionMenu';
import {
  Card,
  GlassModal,
  Icon,
  ListItem,
  NavTile,
  ScreenBackground,
  Text,
  useTheme,
  useTokens,
} from '@/components/ui';
import { usePalette } from '@/components/ui/background/palettes';
import {
  useSceneBackground,
  useWatercolorDefaults,
} from '@/components/ui/background/useSceneBackground';
import { withOpacity } from '@/design-system/ThemeProvider';
import { useLatestPoll } from '@/features/polls/hooks';
import ExpenseForm from '@/features/expenses/components/ExpenseForm';
import GroceryForm from '@/features/groceries/components/GroceryForm';
import ChoreForm from '@/features/chores/components/ChoreForm';

const SummaryCard = ({ title, icon, onPress, items }) => {
  const { theme } = useTheme();
  const tokens = useTokens();

  return (
    <Card
      variant="elevated"
      interactive={!!onPress}
      onPress={onPress}
      accessibilityLabel={title}
      style={{ marginBottom: tokens.Spacing.lg }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: tokens.Spacing.md,
        }}
      >
        {icon && (
          <Icon name={icon} size="md" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
        )}
        <Text variant="titleMedium" weight="semibold">
          {title}
        </Text>
      </View>
      {items.map((item, index) => (
        <ListItem
          key={index}
          title={item.title}
          meta={item.meta}
          accessory={item.accessory}
          density="compact"
          style={[
            { backgroundColor: theme.background.elevated },
            index === items.length - 1 && { borderBottomWidth: 0 },
          ]}
        />
      ))}
    </Card>
  );
};

export default function HomeScreen() {
  const [houseName] = useState('Our House'); // This would come from API/store in a real app
  const { theme, isDark } = useTheme();
  const tokens = useTokens();
  const router = useRouter();
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;
  const { data: activePoll } = useLatestPoll(groupId);
  const stops = usePalette('brandWatercolor');
  const { swirl, opacity } = useWatercolorDefaults(isDark ? 'dark' : 'light');
  const backgroundTheme = useMemo(
    () => ({
      key: 'home',
      gradient: { type: 'linear', angle: 36, stops },
      shapes: [
        { kind: 'circle', x: -60, y: -90, r: 260, opacity: Math.min(0.06, opacity), colorIndex: 1 },
        {
          kind: 'blob',
          x: 120,
          y: 180,
          w: 200,
          h: 160,
          radius: 56,
          opacity: Math.min(0.04, opacity),
          colorIndex: 2,
        },
        {
          kind: 'arc',
          x: 0,
          y: 260,
          r: 320,
          start: 10,
          end: 40,
          thickness: 18,
          opacity: Math.min(0.024, opacity),
          colorIndex: 1,
        },
      ],
      noise: true,
      intensity: 'subtle',
      drift: { amplitude: 6, periodMs: 12000 },
      swirl,
      vignette: true,
      seed: 101,
    }),
    [stops, swirl, opacity],
  );
  useSceneBackground(backgroundTheme);

  // Navigation handlers with haptic feedback
  const handleExpensesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/expenses');
  };

  const handleGroceriesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/groceries');
  };

  const handleChoresPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/chores');
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/settings');
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/profile');
  };

  const handleViewAllExpenses = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/expenses');
  };

  const handleViewAllGroceries = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/groceries');
  };

  const handleViewAllChores = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/chores');
  };

  // Quick action handlers
  const [expenseVisible, setExpenseVisible] = useState(false);
  const [groceryVisible, setGroceryVisible] = useState(false);
  const [choreVisible, setChoreVisible] = useState(false);

  const handleAddExpense = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setExpenseVisible(true);
  };

  const handleAddGrocery = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setGroceryVisible(true);
  };

  const handleAddChore = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setChoreVisible(true);
  };

  const handleCreatePoll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/polls/create');
  };

  return (
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Header */}
        <View
          style={{
            marginBottom: tokens.Spacing.xl,
            paddingTop: tokens.Spacing.sm,
          }}
        >
          <Text variant="headlineLarge" weight="bold" style={{ marginBottom: tokens.Spacing.xs }}>
            Welcome back!
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="House" size="md" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
            <Text variant="titleMedium" color="secondary">
              {houseName}
            </Text>
          </View>
        </View>

        {!!activePoll && (
          <Pressable
            onPress={() => router.push(`/polls/${activePoll.id}`)}
            style={{
              backgroundColor: withOpacity(theme.interactive.primary, 0.05),
              borderColor: theme.border.light,
              borderWidth: StyleSheet.hairlineWidth,
              borderRadius: tokens.BorderRadius.lg,
              padding: tokens.Spacing.lg,
              marginBottom: tokens.Spacing.xl,
            }}
            accessibilityRole="button"
            accessibilityLabel="View poll results"
          >
            <Text
              variant="titleMedium"
              weight="semibold"
              style={{ marginBottom: tokens.Spacing.xs }}
            >
              {activePoll.question}
            </Text>
            <Text variant="bodySmall" color="secondary">
              Tap to view results
            </Text>
          </Pressable>
        )}

        {/* Quick Navigation Grid */}
        <View style={{ marginBottom: tokens.Spacing.xl }}>
          <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
            Quick Access
          </Text>

          {/* First Row */}
          <View style={{ flexDirection: 'row', marginBottom: tokens.Spacing.md }}>
            <NavTile
              title="Expenses"
              subtitle="Track & split costs"
              icon="DollarSign"
              onPress={handleExpensesPress}
            />
            <NavTile
              title="Groceries"
              subtitle="Shopping lists"
              icon="ShoppingCart"
              onPress={handleGroceriesPress}
            />
          </View>

          {/* Second Row */}
          <View style={{ flexDirection: 'row', marginBottom: tokens.Spacing.md }}>
            <NavTile
              title="Chores"
              subtitle="Household tasks"
              icon="SquareCheck"
              onPress={handleChoresPress}
            />
            <NavTile
              title="Profile"
              subtitle="Your account"
              icon="User"
              onPress={handleProfilePress}
            />
          </View>

          {/* Third Row */}
          <View style={{ flexDirection: 'row' }}>
            <NavTile
              title="Settings"
              subtitle="App preferences"
              icon="Settings"
              onPress={handleSettingsPress}
            />
            <NavTile
              title="Analytics"
              subtitle="Trends"
              icon="BarChart3"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/analytics');
              }}
              accessibilityLabel="Open Analytics"
            />
          </View>
        </View>

        {/* Recent Activity Summary */}
        <View style={{ marginBottom: tokens.Spacing.xl }}>
          <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
            Recent Activity
          </Text>
        </View>

        {/* Status Cards */}
        <SummaryCard
          title="Next Rent Due"
          icon="DollarSign"
          onPress={handleViewAllExpenses}
          items={[
            {
              title: '₹15,000',
              meta: 'Due in 5 days',
              accessory: { type: 'badge', label: '2/4 PAID', variant: 'warning' },
            },
          ]}
        />

        <SummaryCard
          title="Groceries"
          icon="ShoppingCart"
          onPress={handleViewAllGroceries}
          items={[{ title: '2 items out' }, { title: '3 items running low' }]}
        />

        <SummaryCard
          title="Today's Chores"
          icon="SquareCheck"
          onPress={handleViewAllChores}
          items={[
            { title: 'Dishes', meta: 'You' },
            { title: 'Take out trash', meta: 'Roommate' },
          ]}
        />

        <SummaryCard
          title="Who Owes What"
          icon="DollarSign"
          onPress={handleViewAllExpenses}
          items={[
            { title: 'You owe', meta: '₹400' },
            { title: 'You are owed', meta: '₹0' },
          ]}
        />

        <SummaryCard
          title="House Rules"
          icon="House"
          items={[
            { title: 'Quiet hours after 11pm' },
            { title: 'Clean kitchen after use' },
            { title: 'Guests need 24h notice' },
          ]}
        />

        {/* Spacer for FAB */}
        <View style={{ height: tokens.Spacing['4xl'] }} />
      </ScrollView>

      {/* Premium Floating Action Menu */}
      <FloatingActionMenu
        onAddExpense={handleAddExpense}
        onAddGrocery={handleAddGrocery}
        onAddChore={handleAddChore}
        onCreatePoll={handleCreatePoll}
      />

      <GlassModal
        visible={expenseVisible}
        onClose={() => setExpenseVisible(false)}
        accessibilityLabel="Add Expense"
      >
        <ExpenseForm onSuccess={() => setExpenseVisible(false)} />
      </GlassModal>

      <GlassModal
        visible={groceryVisible}
        onClose={() => setGroceryVisible(false)}
        accessibilityLabel="Add Grocery"
      >
        <GroceryForm onSuccess={() => setGroceryVisible(false)} />
      </GlassModal>

      <GlassModal
        visible={choreVisible}
        onClose={() => setChoreVisible(false)}
        accessibilityLabel="Add Chore"
      >
        <ChoreForm onSuccess={() => setChoreVisible(false)} />
      </GlassModal>

      {/* Modern Action Sheet - TODO: Implement when needed */}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
  },
});
