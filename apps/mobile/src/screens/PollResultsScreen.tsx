import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, GlassButton, useTheme, useTokens } from '@/components/ui';
import TopBar from '@/components/TopBar';
import { usePollStore } from '@/utils/pollStore';

export default function PollResultsScreen() {
  const { activePoll } = usePollStore();
  const router = useRouter();
  const { theme } = useTheme();
  const tokens = useTokens();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <TopBar
        title={activePoll ? activePoll.question : 'No active poll'}
        onBackPress={() => router.replace('/(tabs)')}
      />
      <View
        style={{
          flex: 1,
          padding: tokens.Spacing.lg,
          justifyContent: 'center',
        }}
      >
        {activePoll && (
          <Text
            variant="bodyMedium"
            color="secondary"
            style={{ marginBottom: tokens.Spacing.lg }}
          >
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
    </View>
  );
}
