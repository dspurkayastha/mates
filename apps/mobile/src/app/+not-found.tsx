import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ScreenBackground, Text, useTokens } from '@/components/ui';

export default function NotFound() {
  const router = useRouter();
  const tokens = useTokens();

  return (
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: tokens.Spacing.lg,
        }}
      >
        <Text variant="headlineMedium" weight="bold" style={{ marginBottom: tokens.Spacing.md }}>
          Page not found
        </Text>
        <Button variant="primary" onPress={() => router.replace('/(tabs)')}>
          Go Home
        </Button>
      </View>
    </ScreenBackground>
  );
}
