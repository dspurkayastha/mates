import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import {
  Text,
  Icon,
  ListItem,
  Card,
  useTheme,
  useTokens,
} from '@/components/ui';
import { withOpacity } from '@/design-system/ThemeProvider';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import FloatingActionMenu from '@/components/FloatingActionMenu';
import { usePollStore } from '@/utils/pollStore';

const NavigationCard = ({ title, subtitle, icon, onPress }) => {
  const { theme } = useTheme();
  const tokens = useTokens();

  return (
    <Card
      variant="elevated"
      interactive
      onPress={onPress}
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      style={{ flex: 1, marginHorizontal: tokens.Spacing.xs }}
    >
      <ListItem
        title={title}
        meta={subtitle}
        density="compact"
        media={<Icon name={icon} size="lg" color="brand" />}
        accessory={{ type: 'chevron' }}
        style={{
          backgroundColor: theme.background.elevated,
          borderBottomWidth: 0,
          marginHorizontal: -tokens.Spacing.lg,
          marginVertical: -tokens.Spacing.lg,
        }}
      />
    </Card>
  );
};

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
          <Icon
            name={icon}
            size="md"
            color="brand"
            style={{ marginRight: tokens.Spacing.sm }}
          />
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
  const { theme } = useTheme();
  const tokens = useTokens();
  const router = useRouter();
  const { activePoll } = usePollStore();

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('FAB pressed - showing action sheet');
  };

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
  const handleAddExpense = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Add Expense', 'This would open the add expense form');
  };

  const handleAddGrocery = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Add Grocery Item', 'This would open the add grocery item form');
  };

  const handleAddChore = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Add Chore', 'This would open the add chore form');
  };

  const handleCreatePoll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/create-poll');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Header */}
        <View style={{
          marginBottom: tokens.Spacing.xl,
          paddingTop: tokens.Spacing.sm
        }}>
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

        <Pressable
          onPress={() =>
            router.push(activePoll ? '/poll-results' : '/create-poll')
          }
          style={{
            backgroundColor: withOpacity(theme.interactive.primary, 0.05),
            borderColor: theme.border.light,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: tokens.BorderRadius.lg,
            padding: tokens.Spacing.lg,
            marginBottom: tokens.Spacing.xl,
          }}
          accessibilityRole="button"
          accessibilityLabel={
            activePoll ? 'View poll results' : 'Create a poll'
          }
        >
          <Text
            variant="titleMedium"
            weight="semibold"
            style={{ marginBottom: tokens.Spacing.xs }}
          >
            {activePoll
              ? activePoll.question
              : 'Start a poll with your roommates'}
          </Text>
          <Text variant="bodySmall" color="secondary">
            {activePoll ? 'Tap to view results' : 'Tap to create a poll'}
          </Text>
        </Pressable>

        {/* Quick Navigation Grid */}
        <View style={{ marginBottom: tokens.Spacing.xl }}>
          <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
            Quick Access
          </Text>
          
          {/* First Row */}
          <View style={{ flexDirection: 'row', marginBottom: tokens.Spacing.md }}>
            <NavigationCard
              title="Expenses"
              subtitle="Track & split costs"
              icon="DollarSign"
              onPress={handleExpensesPress}
            />
            <NavigationCard
              title="Groceries"
              subtitle="Shopping lists"
              icon="ShoppingCart"
              onPress={handleGroceriesPress}
            />
          </View>
          
          {/* Second Row */}
          <View style={{ flexDirection: 'row', marginBottom: tokens.Spacing.md }}>
            <NavigationCard
              title="Chores"
              subtitle="Household tasks"
              icon="SquareCheck"
              onPress={handleChoresPress}
            />
            <NavigationCard
              title="Profile"
              subtitle="Your account"
              icon="User"
              onPress={handleProfilePress}
            />
          </View>
          
          {/* Third Row */}
          <View style={{ flexDirection: 'row' }}>
            <NavigationCard
              title="Settings"
              subtitle="App preferences"
              icon="Settings"
              onPress={handleSettingsPress}
            />
            <NavigationCard
              title="Coming Soon"
              subtitle="More features"
              icon="Plus"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                console.log('Coming soon features');
              }}
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
          items={[
            { title: '2 items out' },
            { title: '3 items running low' },
          ]}
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

      {/* Modern Action Sheet - TODO: Implement when needed */}
    </SafeAreaView>
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
