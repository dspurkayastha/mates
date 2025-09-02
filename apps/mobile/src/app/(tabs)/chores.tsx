import React from 'react';
import { View, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  Text,
  Icon,
  ListItem,
  Button,
  SegmentedControl,
  LoadingSkeleton,
  ScreenBackground,
  useTheme,
  useTokens,
} from '@/components/ui';
import * as Haptics from 'expo-haptics';
import { useChores, useCompleteChore, Chore } from '@/features/chores/hooks';
import { isToday, isThisWeek } from 'date-fns';

interface Leader {
  id: string;
  name: string;
  completedCount: number;
  streak: number;
}

const segments = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'leaderboard', label: 'Leaderboard' },
];

export default function ChoresScreen() {
  const { theme } = useTheme();
  const tokens = useTokens();
  const [activeTab, setActiveTab] = React.useState<'today' | 'week' | 'leaderboard'>('today');
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID!;
  const { data: chores = [], isLoading } = useChores({ groupId });
  const completeChore = useCompleteChore(groupId);

  const todayChores = React.useMemo(
    () => chores.filter((c) => isToday(new Date(c.due_at))),
    [chores],
  );
  const weekChores = React.useMemo(
    () => chores.filter((c) => isThisWeek(new Date(c.due_at))),
    [chores],
  );
  const leaderboard = React.useMemo(() => {
    const counts: Record<string, number> = {};
    chores.forEach((c) => {
      if (c.completed_at && c.assignee) {
        counts[c.assignee] = (counts[c.assignee] || 0) + 1;
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
      completeChore.mutate({ id, complete: !current });
    },
    [completeChore],
  );

  const handleAddChore = React.useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Add new chore');
  }, []);

  const renderChore = React.useCallback(
    ({ item }: { item: Chore }) => (
      <ListItem
        title={item.title}
        meta={`Assigned to ${item.assignee || 'Unassigned'} • Due ${item.due_at}`}
        accessory={{
          type: 'toggle',
          value: !!item.completed_at,
          onValueChange: () => handleToggleComplete(item.id, !!item.completed_at),
        }}
      />
    ),
    [handleToggleComplete],
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
    [theme.interactive.primary, tokens],
  );

  const keyExtractor = React.useCallback((item: { id: string }) => item.id, []);

  const sectionTitle = React.useMemo(() => {
    switch (activeTab) {
      case 'today':
        return "Today's Chores";
      case 'week':
        return "This Week's Chores";
      default:
        return 'Chores Leaderboard';
    }
  }, [activeTab]);

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
          onChange={(v) => setActiveTab(v as 'today' | 'week' | 'leaderboard')}
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
    [activeTab, sectionTitle, tokens],
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
    [handleAddChore, tokens],
  );

  const data: any[] =
    activeTab === 'today' ? todayChores : activeTab === 'week' ? weekChores : leaderboard;
  const renderItem = activeTab === 'leaderboard' ? renderLeader : renderChore;

  const content = isLoading ? (
    <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
      {[...Array(5)].map((_, i) => (
        <LoadingSkeleton key={i} height={72} style={{ marginBottom: tokens.Spacing.md }} />
      ))}
    </ScrollView>
  ) : (
    <FlashList
      data={data as any[]}
      key={activeTab}
      keyExtractor={keyExtractor as any}
      renderItem={renderItem as any}
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
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
      {content}
    </ScreenBackground>
  );
}
