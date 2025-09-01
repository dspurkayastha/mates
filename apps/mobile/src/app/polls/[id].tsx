import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, Icon, Button, Card, LoadingSkeleton, useTheme, useTokens } from '@/components/ui';
import { withOpacity } from '@/design-system/ThemeProvider';
import { usePoll, useVotePoll } from '@/features/polls/hooks';

export default function PollDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const tokens = useTokens();
  const { data, isLoading } = usePoll(String(id));
  const votePoll = useVotePoll();

  if (isLoading || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
        <View style={{ padding: tokens.Spacing.xl }}>
          <LoadingSkeleton height={200} />
        </View>
      </SafeAreaView>
    );
  }

  const { poll, votes, myVote } = data;
  const total = votes.yes + votes.no;
  const yesPct = total ? (votes.yes / total) * 100 : 0;
  const noPct = total ? (votes.no / total) * 100 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <View style={{ padding: tokens.Spacing.xl }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: tokens.Spacing.xl,
          }}
        >
          <Icon
            name="Vote"
            size="xl"
            color="brand"
            style={{ marginRight: tokens.Spacing.sm }}
          />
          <Text variant="headlineLarge" weight="bold">
            {poll.question}
          </Text>
        </View>

        {myVote === null ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              variant="primary"
              size="large"
              onPress={() => votePoll.mutate({ pollId: poll.id, vote: true })}
              disabled={votePoll.isPending}
            >
              Yes
            </Button>
            <Button
              variant="secondary"
              size="large"
              onPress={() => votePoll.mutate({ pollId: poll.id, vote: false })}
              disabled={votePoll.isPending}
            >
              No
            </Button>
          </View>
        ) : (
          <Card variant="elevated" style={{ padding: tokens.Spacing.lg }}>
            <Text variant="titleMedium" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
              Results
            </Text>
            <View style={{ marginBottom: tokens.Spacing.md }}>
              <Text variant="bodySmall" weight="medium" style={{ marginBottom: tokens.Spacing.xs }}>
                Yes ({votes.yes})
              </Text>
              <View
                style={{
                  height: 8,
                  backgroundColor: withOpacity(theme.interactive.primary, 0.08),
                  borderRadius: tokens.BorderRadius.md,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${yesPct}%`,
                    height: '100%',
                    backgroundColor: theme.interactive.primary,
                  }}
                />
              </View>
            </View>
            <View>
              <Text variant="bodySmall" weight="medium" style={{ marginBottom: tokens.Spacing.xs }}>
                No ({votes.no})
              </Text>
              <View
                style={{
                  height: 8,
                  backgroundColor: withOpacity(theme.interactive.primary, 0.08),
                  borderRadius: tokens.BorderRadius.md,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${noPct}%`,
                    height: '100%',
                    backgroundColor: theme.interactive.primary,
                  }}
                />
              </View>
            </View>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}
