import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, GlassInput, GlassButton, useColors, useTokens } from '@/components/ui';
import { usePollStore } from '@/utils/pollStore';

export default function CreatePollScreen() {
  const [question, setQuestion] = useState('');
  const { createPoll } = usePollStore();
  const router = useRouter();
  const colors = useColors();
  const tokens = useTokens();

  const handleCreate = () => {
    if (!question) return;
    createPoll({ question });
    router.replace('/poll-results');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background.primary,
        padding: tokens.Spacing.lg,
      }}
    >
      <Text
        variant="titleLarge"
        weight="bold"
        style={{ marginBottom: tokens.Spacing.lg }}
      >
        Create Poll
      </Text>
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
  );
}
