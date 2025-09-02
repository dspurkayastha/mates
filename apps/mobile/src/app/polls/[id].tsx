import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  Text,
  Icon,
  Button,
  Card,
  LoadingSkeleton,
  ScreenBackground,
  useTheme,
  useTokens,
} from '@/components/ui';
import { withOpacity } from '@/design-system/ThemeProvider';
import { usePollResults, useVote } from '@/features/polls/hooks';

export default function PollDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const tokens = useTokens();
  const { data, isLoading } = usePollResults({ pollId: String(id) });
  const vote = useVote({ pollId: String(id) });

  if (isLoading || !data) {
    return (
      <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
        <View style={{ padding: tokens.Spacing.xl }}>
          <LoadingSkeleton height={200} />
        </View>
      </ScreenBackground>
    );
  }

  const { poll, votes, myVote } = data;
  const total = votes.yes + votes.no;
  const yesPct = total ? (votes.yes / total) * 100 : 0;
  const noPct = total ? (votes.no / total) * 100 : 0;

  return (
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
      <View style={{ padding: tokens.Spacing.xl }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: tokens.Spacing.xl,
          }}
        >
          <Icon name="Vote" size="xl" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
          <Text variant="headlineLarge" weight="bold">
            {poll.question}
          </Text>
        </View>

        {myVote === null ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              variant="primary"
              size="large"
              onPress={() => vote.mutate(true)}
              disabled={vote.isPending}
            >
              Yes
            </Button>
            <Button
              variant="secondary"
              size="large"
              onPress={() => vote.mutate(false)}
              disabled={vote.isPending}
            >
              No
            </Button>
          </View>
        ) : (
          <Card variant="elevated" style={{ padding: tokens.Spacing.lg }}>
            <Text
              variant="titleMedium"
              weight="semibold"
              style={{ marginBottom: tokens.Spacing.md }}
            >
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
                }}
              >
                <View style={{ overflow: 'hidden', borderRadius: tokens.BorderRadius.md }}>
                  <View
                    style={{
                      width: `${yesPct}%`,
                      height: '100%',
                      backgroundColor: theme.interactive.primary,
                    }}
                  />
                </View>
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
                }}
              >
                <View style={{ overflow: 'hidden', borderRadius: tokens.BorderRadius.md }}>
                  <View
                    style={{
                      width: `${noPct}%`,
                      height: '100%',
                      backgroundColor: theme.interactive.primary,
                    }}
                  />
                </View>
              </View>
            </View>
          </Card>
        )}
      </View>
    </ScreenBackground>
  );
}
