import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Icon, GlassInput, Button, useTheme, useTokens } from '@/components/ui';
import { useCreatePoll } from '@/features/polls/hooks';

export default function CreatePollScreen() {
  const { theme } = useTheme();
  const tokens = useTokens();
  const router = useRouter();
  const [question, setQuestion] = React.useState('');
  const createPoll = useCreatePoll();

  const handleCreate = async () => {
    if (!question) return;
    try {
      const poll = await createPoll.mutateAsync(question);
      router.replace(`/polls/${poll.id}`);
    } catch (e) {
      console.error(e);
    }
  };

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
            Create Poll
          </Text>
        </View>
        <GlassInput
          placeholder="Poll question"
          value={question}
          onChangeText={setQuestion}
          style={{ marginBottom: tokens.Spacing.lg }}
        />
        <Button
          variant="primary"
          size="large"
          onPress={handleCreate}
          disabled={!question || createPoll.isPending}
        >
          Create Poll
        </Button>
      </View>
    </SafeAreaView>
  );
}
