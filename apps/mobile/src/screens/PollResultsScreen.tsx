import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, GlassButton, useColors, useTokens } from '@/components/ui';
import { usePollStore } from '@/utils/pollStore';

export default function PollResultsScreen() {
  const { activePoll } = usePollStore();
  const router = useRouter();
  const colors = useColors();
  const tokens = useTokens();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background.primary,
        padding: tokens.Spacing.lg,
        justifyContent: 'center',
      }}
    >
      <Text
        variant="titleLarge"
        weight="bold"
        style={{ marginBottom: tokens.Spacing.md }}
      >
        {activePoll ? activePoll.question : 'No active poll'}
      </Text>
      {activePoll && (
        <Text variant="bodyMedium" color="secondary" style={{ marginBottom: tokens.Spacing.lg }}>
          Results coming soon
        </Text>
      )}
      <GlassButton
        variant="primary"
        buttonStyle="filled"
        size="large"
        onPress={() => router.replace('/(tabs)')}
      >
        Back to Dashboard
      </GlassButton>
    </View>
  );
}
