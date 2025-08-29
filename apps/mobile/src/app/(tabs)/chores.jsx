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
  useColors,
  useTokens
} from '@/components/ui';
import * as Haptics from 'expo-haptics';

// Glass Chore item component with iOS 26 styling
const ChoreItem = ({ icon, name, assignedTo, dueTime, isCompleted, onToggleComplete }) => {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <GlassCard
      variant="translucent"
      size="medium"
      interactive
      style={{ marginBottom: tokens.Spacing.md }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: tokens.Spacing.lg
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.background.secondary,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: tokens.Spacing.md,
        }}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" weight="semibold" style={{ marginBottom: 4 }}>
            {name}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text variant="bodySmall" color="secondary" style={{ marginRight: 12 }}>
              Assigned to: <Text variant="bodySmall" weight="medium" color="primary">{assignedTo}</Text>
            </Text>
            <Text variant="bodySmall" color="secondary">
              Due: <Text variant="bodySmall" weight="medium" color="primary">{dueTime}</Text>
            </Text>
          </View>
        </View>

        <GlassButton
          variant={isCompleted ? "success" : "secondary"}
          buttonStyle="tinted"
          size="small"
          onPress={onToggleComplete}
        >
          {isCompleted ? '✓ Done' : 'Mark Done'}
        </GlassButton>
      </View>
    </GlassCard>
  );
};

// Glass Leaderboard item component
const LeaderboardItem = ({ rank, name, completedCount, streak }) => {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <GlassCard
      variant="translucent"
      size="medium"
      style={{ marginBottom: tokens.Spacing.md }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: tokens.Spacing.lg
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.interactive.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: tokens.Spacing.md,
        }}>
          <Text variant="titleMedium" weight="bold" color="inverse">{rank}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" weight="semibold" style={{ marginBottom: 4 }}>
            {name}
          </Text>
          <Text variant="bodySmall" color="secondary">
            {completedCount} chores completed this week
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text variant="titleMedium" weight="bold" color="warning">
            {streak}
          </Text>
          <Text variant="labelSmall" color="tertiary">
            day streak
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

export default function ChoresScreen() {
  const [activeTab, setActiveTab] = useState('today');
  const colors = useColors();
  const tokens = useTokens();

  // Placeholder chores data
  const todayChores = [
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

  const weekChores = [
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
      dueTime: 'Thursday, 7 PM',
      isCompleted: false,
    },
    {
      id: '7',
      icon: '🧺',
      name: 'Fold Clothes',
      assignedTo: 'You',
      dueTime: 'Friday, 6 PM',
      isCompleted: false,
    },
  ];

  // Placeholder leaderboard data
  const leaderboard = [
    { id: '1', name: 'Roommate', completedCount: 8, streak: 5 },
    { id: '2', name: 'You', completedCount: 6, streak: 3 },
    { id: '3', name: 'Roommate 2', completedCount: 4, streak: 2 },
    { id: '4', name: 'Roommate 3', completedCount: 3, streak: 1 },
  ];

  const handleToggleComplete = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // This would mark the chore as completed in a real app
    console.log('Toggle complete for chore:', id);
  };

  const handleAddChore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // This would open a form to add a new chore
    console.log('Add new chore');
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
          <Icon name="SquareCheck" size="xl" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
          <Text variant="headlineMedium" weight="bold">Chores</Text>
        </View>

        {/* Glass Tabs */}
        <View style={{
          flexDirection: 'row',
          marginBottom: tokens.Spacing.lg,
          gap: tokens.Spacing.sm
        }}>
          <GlassButton
            variant={activeTab === 'today' ? 'primary' : 'secondary'}
            buttonStyle={activeTab === 'today' ? 'tinted' : 'outlined'}
            size="medium"
            onPress={() => setActiveTab('today')}
            style={{ flex: 1 }}
          >
            Today
          </GlassButton>

          <GlassButton
            variant={activeTab === 'week' ? 'primary' : 'secondary'}
            buttonStyle={activeTab === 'week' ? 'tinted' : 'outlined'}
            size="medium"
            onPress={() => setActiveTab('week')}
            style={{ flex: 1 }}
          >
            This Week
          </GlassButton>

          <GlassButton
            variant={activeTab === 'leaderboard' ? 'primary' : 'secondary'}
            buttonStyle={activeTab === 'leaderboard' ? 'tinted' : 'outlined'}
            size="medium"
            onPress={() => setActiveTab('leaderboard')}
            style={{ flex: 1 }}
          >
            Leaderboard
          </GlassButton>
        </View>

        {/* Today's Chores */}
        {activeTab === 'today' && (
          <View style={{ marginBottom: tokens.Spacing.xl }}>
            <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
              Today's Chores
            </Text>
            {todayChores.map((chore) => (
              <ChoreItem
                key={chore.id}
                icon={chore.icon}
                name={chore.name}
                assignedTo={chore.assignedTo}
                dueTime={chore.dueTime}
                isCompleted={chore.isCompleted}
                onToggleComplete={() => handleToggleComplete(chore.id)}
              />
            ))}
          </View>
        )}

        {/* This Week's Chores */}
        {activeTab === 'week' && (
          <View style={{ marginBottom: tokens.Spacing.xl }}>
            <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
              This Week's Chores
            </Text>
            {weekChores.map((chore) => (
              <ChoreItem
                key={chore.id}
                icon={chore.icon}
                name={chore.name}
                assignedTo={chore.assignedTo}
                dueTime={chore.dueTime}
                isCompleted={chore.isCompleted}
                onToggleComplete={() => handleToggleComplete(chore.id)}
              />
            ))}
          </View>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <View style={{ marginBottom: tokens.Spacing.xl }}>
            <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
              Chores Leaderboard
            </Text>
            {leaderboard.map((leader, index) => (
              <LeaderboardItem
                key={leader.id}
                rank={index + 1}
                name={leader.name}
                completedCount={leader.completedCount}
                streak={leader.streak}
              />
            ))}
          </View>
        )}

        {/* Add Chore Button */}
        <GlassButton
          variant="primary"
          buttonStyle="tinted"
          size="large"
          fullWidth
          onPress={handleAddChore}
          leftIcon={<Icon name="Plus" size="sm" color="inverse" />}
          style={{ marginVertical: tokens.Spacing.lg }}
        >
          Add Chore
        </GlassButton>

        {/* Spacer for bottom tabs */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

