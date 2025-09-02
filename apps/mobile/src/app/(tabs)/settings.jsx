import React, { useState } from 'react';
import { View, ScrollView, Modal } from 'react-native';
import {
  Text,
  ListItem,
  GlassToggle,
  ScreenBackground,
  useTokens,
  useTheme,
  Button,
  Card,
} from '@/components/ui';
import { withOpacity } from '@/design-system/ThemeProvider';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '@/features/auth/useAuth';

export default function SettingsScreen() {
  const tokens = useTokens();
  const { theme } = useTheme();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const debug = process.env.EXPO_PUBLIC_DEBUG?.includes('dev');
  const backgroundShapes = [
    {
      type: 'circle',
      size: 240,
      color: withOpacity(theme.interactive.primary, 0.04),
      offset: { x: -80, y: -100 },
    },
    {
      type: 'blob',
      size: 160,
      color: withOpacity(theme.interactive.primary, 0.03),
      offset: { x: 120, y: 200 },
    },
  ];

  return (
    <ScreenBackground
      palette="brand"
      variant="subtle"
      gradientShape="linear"
      shapes={backgroundShapes}
    >
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
          Account
        </Text>
        <Card
          variant="outlined"
          contentStyle={{ padding: 0 }}
          style={{ marginBottom: tokens.Spacing.xl }}
        >
          <ListItem title="Sign Out" onPress={() => setSignOutVisible(true)} />
        </Card>

        <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
          Appearance
        </Text>
        <Card
          variant="outlined"
          contentStyle={{ padding: 0 }}
          style={{ marginBottom: tokens.Spacing.xl }}
        >
          <ListItem
            title="Dark Mode"
            accessory={{
              type: 'custom',
              node: <GlassToggle value={darkMode} onValueChange={setDarkMode} />,
            }}
          />
        </Card>

        <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
          Notifications
        </Text>
        <Card
          variant="outlined"
          contentStyle={{ padding: 0 }}
          style={{ marginBottom: tokens.Spacing.xl }}
        >
          <ListItem
            title="Enable Notifications"
            accessory={{
              type: 'custom',
              node: <GlassToggle value={notifications} onValueChange={setNotifications} />,
            }}
          />
        </Card>

        {debug && (
          <>
            <Text
              variant="titleLarge"
              weight="semibold"
              style={{ marginBottom: tokens.Spacing.md }}
            >
              Advanced
            </Text>
            <Card variant="outlined" contentStyle={{ padding: 0 }}>
              <ListItem title={`Deeplink channel: dev`} />
              <ListItem
                title="Copy Debug Info"
                onPress={async () => {
                  await Clipboard.setStringAsync('debug-info');
                }}
              />
            </Card>
          </>
        )}
      </ScrollView>
      {signOutVisible && (
        <Modal transparent visible onRequestClose={() => setSignOutVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: tokens.Spacing.lg,
              backgroundColor: withOpacity(theme.text.primary, 0.3),
            }}
          >
            <Card variant="elevated" style={{ padding: tokens.Spacing.lg }}>
              <Text variant="titleMedium" style={{ marginBottom: tokens.Spacing.md }}>
                Sign out?
              </Text>
              <Button
                variant="primary"
                onPress={() => {
                  setSignOutVisible(false);
                  signOut();
                }}
                accessibilityLabel="Confirm Sign Out"
              >
                Confirm
              </Button>
              <Button
                variant="secondary"
                onPress={() => setSignOutVisible(false)}
                style={{ marginTop: tokens.Spacing.sm }}
                accessibilityLabel="Cancel Sign Out"
              >
                Cancel
              </Button>
            </Card>
          </View>
        </Modal>
      )}
    </ScreenBackground>
  );
}
