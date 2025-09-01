import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  Text,
  Icon,
  ListItem,
  Button,
  SegmentedControl,
  useTheme,
  useTokens,
} from '@/components/ui';
import * as Haptics from 'expo-haptics';

interface Chore {
  id: string;
  icon: string;
  name: string;
  assignedTo: string;
  dueTime: string;
  isCompleted: boolean;
}

interface Leader {
  id: string;
  name: string;
  completedCount: number;
  streak: number;
}

const segments = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'Leaderboard', value: 'leaderboard' },
];

export default function ChoresScreen() {
  const { theme } = useTheme();
  const tokens = useTokens();
  const [activeTab, setActiveTab] = React.useState<'today' | 'week' | 'leaderboard'>('today');

  const todayChores: Chore[] = [
    {
      id: '1',
      icon: '🧹',
      name: 'Sweep Living Room',
      assignedTo: 'You',
      dueTime: 'Today, 6 PM',
      isCompleted: false,
    },
    {
      id: '2',
      icon: '🍽️',
      name: 'Wash Dishes',
      assignedTo: 'You',
      dueTime: 'Today, 9 PM',
      isCompleted: true,
    },
    {
      id: '3',
      icon: '🗑️',
      name: 'Take Out Trash',
      assignedTo: 'Roommate',
      dueTime: 'Today, 8 PM',
      isCompleted: false,
    },
  ];

  const weekChores: Chore[] = [
    {
      id: '4',
      icon: '🧼',
      name: 'Clean Bathroom',
      assignedTo: 'You',
      dueTime: 'Tomorrow, 11 AM',
      isCompleted: false,
    },
    {
      id: '5',
      icon: '👕',
      name: 'Do Laundry',
      assignedTo: 'Roommate',
      dueTime: 'Wednesday, 5 PM',
      isCompleted: false,
    },
    {
      id: '6',
      icon: '🧽',
      name: 'Clean Kitchen',
      assignedTo: 'Roommate',
      dueTime: 'Friday, 7 PM',
      isCompleted: false,
    },
  ];

  const leaderboard: Leader[] = [
    { id: '1', name: 'Roommate', completedCount: 8, streak: 5 },
    { id: '2', name: 'You', completedCount: 6, streak: 3 },
    { id: '3', name: 'Roommate 2', completedCount: 4, streak: 2 },
    { id: '4', name: 'Roommate 3', completedCount: 3, streak: 1 },
  ];

  const handleToggleComplete = React.useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Toggle complete for chore:', id);
  }, []);

  const handleAddChore = React.useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Add new chore');
  }, []);

  const renderChore = React.useCallback(
    ({ item }: { item: Chore }) => (
      <ListItem
        media={<Text style={{ fontSize: 20 }}>{item.icon}</Text>}
        title={item.name}
        meta={`Assigned to ${item.assignedTo} • Due ${item.dueTime}`}
        accessory={{
          type: 'toggle',
          value: item.isCompleted,
          onValueChange: () => handleToggleComplete(item.id),
        }}
      />
    ),
    [handleToggleComplete]
  );

  const renderLeader = React.useCallback(
    ({ item, index }: { item: Leader; index: number }) => (
      <ListItem
        media={
          <View
            style={{
              width: tokens.Spacing['4xl'],
              height: tokens.Spacing['4xl'],
              borderRadius: tokens.Spacing['2xl'],
              backgroundColor: theme.interactive.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text variant="labelLarge" weight="bold" color="inverse">
              {index + 1}
            </Text>
          </View>
        }
        title={item.name}
        meta={`${item.completedCount} chores`}
        accessory={{ type: 'badge', label: `${item.streak}d`, variant: 'warning' }}
      />
    ),
    [theme.interactive.primary, tokens.Spacing]
  );

  const data =
    activeTab === 'today' ? todayChores : activeTab === 'week' ? weekChores : leaderboard;
  const renderItem = activeTab === 'leaderboard' ? renderLeader : renderChore;
  const keyExtractor = React.useCallback((item: { id: string }) => item.id, []);

  const sectionTitle =
    activeTab === 'today'
      ? "Today's Chores"
      : activeTab === 'week'
      ? "This Week's Chores"
      : 'Chores Leaderboard';

  const renderHeader = React.useCallback(
    () => (
      <View style={{ paddingTop: tokens.Spacing.lg }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: tokens.Spacing.lg,
            paddingTop: tokens.Spacing.sm,
          }}
        >
          <Icon
            name="SquareCheck"
            size="xl"
            color="brand"
            style={{ marginRight: tokens.Spacing.sm }}
          />
          <Text variant="headlineMedium" weight="bold">
            Chores
          </Text>
        </View>
        <SegmentedControl
          segments={segments}
          value={activeTab}
          onChange={setActiveTab}
        />
        <Text
          variant="titleLarge"
          weight="semibold"
          style={{ marginTop: tokens.Spacing.lg, marginBottom: tokens.Spacing.md }}
        >
          {sectionTitle}
        </Text>
      </View>
    ),
    [activeTab, sectionTitle, tokens]
  );

  const renderFooter = React.useCallback(
    () => (
      <View style={{ marginTop: tokens.Spacing.lg }}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleAddChore}
          leftIcon={<Icon name="Plus" size="sm" color="inverse" />}
        >
          Add Chore
        </Button>
        <View style={{ height: 80 }} />
      </View>
    ),
    [handleAddChore, tokens.Spacing.lg]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <FlashList
        data={data}
        key={activeTab}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={72}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingHorizontal: tokens.Spacing.lg,
          paddingBottom: tokens.Spacing.lg,
        }}
      />
    </SafeAreaView>
  );
}
