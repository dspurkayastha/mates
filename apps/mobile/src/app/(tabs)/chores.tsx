import React from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  Text,
  Icon,
  ListItem,
  Button,
  SegmentedControl,
  LoadingSkeleton,
  useTheme,
  useTokens,
} from '@/components/ui';
import * as Haptics from 'expo-haptics';
import { useChores, useToggleChore, Chore } from '@/hooks';
import { isToday, isThisWeek } from 'date-fns';

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

  const { data: chores = [], isLoading } = useChores();
  const toggleChore = useToggleChore();

  const todayChores = chores.filter((c) => isToday(new Date(c.dueTime)));
  const weekChores = chores.filter((c) => isThisWeek(new Date(c.dueTime)));
  const leaderboard = React.useMemo(() => {
    const counts: Record<string, number> = {};
    chores.forEach((c) => {
      if (c.isCompleted) {
        counts[c.assignedTo] = (counts[c.assignedTo] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, completedCount], index) => ({
        id: String(index),
        name,
        completedCount,
        streak: 0,
      }))
      .sort((a, b) => b.completedCount - a.completedCount);
  }, [chores]);

  const handleToggleComplete = React.useCallback(
    (id: string, current: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleChore.mutate({ id, isCompleted: !current });
    },
    [toggleChore],
  );

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
          onValueChange: () => handleToggleComplete(item.id, item.isCompleted),
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

  const content = isLoading ? (
    <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
      {[...Array(5)].map((_, i) => (
        <LoadingSkeleton
          key={i}
          height={72}
          style={{ marginBottom: tokens.Spacing.md }}
        />
      ))}
    </ScrollView>
  ) : (
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
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      {content}
    </SafeAreaView>
  );
}
