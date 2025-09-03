import React, { useState, useEffect, useMemo } from 'react';
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
import { useSceneBackground } from '@/components/ui/background/useSceneBackground';
import { usePalette } from '@/components/ui/background/palettes';
import * as Clipboard from 'expo-clipboard';
import { useAuth } from '@/features/auth/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/Notifications';
import { ensureMinTouchTarget } from '@/utils/a11y';
import { STORAGE_KEYS, clearAppStorage } from '@/utils/storage';
import { biometricAuthManager } from '@/utils/biometricAuth';

export default function SettingsScreen() {
  const tokens = useTokens();
  const { theme, isDark, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [notifications, setNotifications] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const debug = process.env.EXPO_PUBLIC_DEBUG?.includes('dev');
  const stops = usePalette('sunriseWash');
  const backgroundTheme = useMemo(
    () => ({
      key: 'settings',
      gradient: { type: 'linear', stops },
      shapes: [
        { kind: 'circle', x: -40, y: -60, r: 120, opacity: 0.05, colorIndex: 1 },
        { kind: 'circle', x: 140, y: 220, r: 100, opacity: 0.04, colorIndex: 2 },
      ],
      intensity: 'subtle',
      noise: false,
      seed: 404,
    }),
    [stops],
  );
  useSceneBackground(backgroundTheme);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.haptics).then((v) => {
      if (v !== null) setHapticsEnabled(v === 'true');
    });
    setBiometricsEnabled(biometricAuthManager.isBiometricAuthEnabled());
  }, []);

  const toggleHaptics = async () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    await AsyncStorage.setItem(STORAGE_KEYS.haptics, String(next));
  };

  const toggleBiometrics = async () => {
    const next = !biometricsEnabled;
    if (next) {
      const res = await biometricAuthManager.enableBiometricAuth();
      if (!res.success) return;
    } else {
      await biometricAuthManager.disableBiometricAuth();
    }
    setBiometricsEnabled(next);
  };

  return (
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
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
              node: (
                <GlassToggle
                  value={isDark}
                  onValueChange={toggleTheme}
                  accessibilityLabel="Dark mode"
                  style={ensureMinTouchTarget()}
                />
              ),
            }}
          />
          <ListItem
            title="App Tint"
            accessory={{
              type: 'custom',
              node: (
                <View
                  style={{
                    width: tokens.Spacing.lg,
                    height: tokens.Spacing.lg,
                    borderRadius: tokens.BorderRadius.md,
                    backgroundColor: theme.interactive.primary,
                  }}
                  accessibilityLabel="App tint preview"
                />
              ),
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
              node: (
                <GlassToggle
                  value={notifications}
                  onValueChange={setNotifications}
                  accessibilityLabel="Notifications"
                  style={ensureMinTouchTarget()}
                />
              ),
            }}
          />
        </Card>

        <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
          Preferences
        </Text>
        <Card
          variant="outlined"
          contentStyle={{ padding: 0 }}
          style={{ marginBottom: tokens.Spacing.xl }}
        >
          <ListItem
            title="Haptics"
            accessory={{
              type: 'custom',
              node: (
                <GlassToggle
                  value={hapticsEnabled}
                  onValueChange={toggleHaptics}
                  accessibilityLabel="Haptics"
                  style={ensureMinTouchTarget()}
                />
              ),
            }}
          />
          <ListItem
            title="Biometric Auth"
            accessory={{
              type: 'custom',
              node: (
                <GlassToggle
                  value={biometricsEnabled}
                  onValueChange={toggleBiometrics}
                  accessibilityLabel="Biometric authentication"
                  style={ensureMinTouchTarget()}
                />
              ),
            }}
          />
          <ListItem
            title="Reset Cache"
            onPress={async () => {
              await queryClient.clear();
              await clearAppStorage();
              toast.success('Cache cleared');
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
