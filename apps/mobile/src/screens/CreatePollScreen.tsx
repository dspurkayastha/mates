import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassInput, GlassButton, useTheme, useTokens } from '@/components/ui';
import TopBar from '@/components/TopBar';
import { usePollStore } from '@/utils/pollStore';

export default function CreatePollScreen() {
  const [question, setQuestion] = useState('');
  const { createPoll } = usePollStore();
  const router = useRouter();
  const { theme } = useTheme();
  const tokens = useTokens();

  const handleCreate = () => {
    if (!question) return;
    createPoll({ question });
    router.replace('/poll-results');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <TopBar title="Create Poll" onBackPress={() => router.back()} />
      <View style={{ flex: 1, padding: tokens.Spacing.lg }}>
        <GlassInput
          placeholder="Poll question"
          value={question}
          onChangeText={setQuestion}
          variant="default"
          size="large"
          style={{ marginBottom: tokens.Spacing.lg }}
        />
        <GlassButton
          variant="primary"
          buttonStyle="filled"
          size="large"
          onPress={handleCreate}
          disabled={!question}
        >
          Create
        </GlassButton>
      </View>
    </View>
  );
}
