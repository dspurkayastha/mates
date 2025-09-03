import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Modal, ScrollView, View } from 'react-native';

import { FormField, FormScreen, TextArea, TextInput as FormTextInput } from '@/components/form';
import {
  Button,
  Card,
  Icon,
  ListItem,
  ScreenBackground,
  Text,
  useTheme,
  useTokens,
} from '@/components/ui';
import { usePalette } from '@/components/ui/background/palettes';
import { useSceneBackground } from '@/components/ui/background/useSceneBackground';
import { withOpacity } from '@/design-system/ThemeProvider';
import { useAuth } from '@/features/auth/useAuth';

// -----------------------------------------------------------------------------
// Action Chip
// -----------------------------------------------------------------------------

const ActionChip = ({ label, onPress }) => {
  const tokens = useTokens();
  return (
    <Button
      variant="secondary"
      size="sm"
      onPress={onPress}
      style={{ marginRight: tokens.Spacing.sm }}
    >
      {label}
    </Button>
  );
};

// -----------------------------------------------------------------------------
// Profile Header
// -----------------------------------------------------------------------------

const ProfileHeader = ({ name, email, avatar, actions }) => {
  const { theme } = useTheme();
  const tokens = useTokens();

  const avatarSize = 72;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: tokens.Spacing['2xl'],
      }}
    >
      <View
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: theme.background.secondary,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          marginRight: tokens.Spacing.lg,
        }}
      >
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={{ width: avatarSize, height: avatarSize }}
            resizeMode="cover"
          />
        ) : (
          <Icon name="User" size="xl" color="secondary" />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text variant="titleLarge" weight="bold" style={{ marginBottom: tokens.Spacing.xs }}>
          {name}
        </Text>
        <Text variant="bodyMedium" color="secondary" style={{ marginBottom: tokens.Spacing.sm }}>
          {email}
        </Text>

        <View style={{ flexDirection: 'row' }}>
          {actions.map((action) => (
            <ActionChip key={action.label} label={action.label} onPress={action.onPress} />
          ))}
        </View>
      </View>
    </View>
  );
};

// -----------------------------------------------------------------------------
// Screen
// -----------------------------------------------------------------------------

export default function ProfileScreen() {
  const { theme } = useTheme();
  const tokens = useTokens();
  const router = useRouter();
  const { signOut, isAuthenticated } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [signOutVisible, setSignOutVisible] = useState(false);

  const [user] = useState({
    name: 'Alex Smith',
    email: 'alex@example.com',
    avatar: null,
  });

  const actionChips = [
    { label: 'Edit', onPress: () => setEditing(true) },
    { label: 'Expenses', onPress: () => router.push('/(tabs)/expenses') },
    { label: 'Chores', onPress: () => router.push('/(tabs)/chores') },
    { label: 'Groceries', onPress: () => router.push('/(tabs)/groceries') },
  ];

  const handleHouseManagement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('House Management', 'Invite members, manage settings.');
  };

  const handlePaymentMethods = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Payment Methods', 'Manage cards and payment options.');
  };

  const handleNotificationPrefs = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/settings');
  };

  const handleDataExport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Export Data', 'Download your data.');
  };

  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('Delete Account', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => Alert.alert('Account Deleted'),
      },
    ]);
  };

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSignOutVisible(true);
  };

  const stops = usePalette('neutralHint');
  const backgroundTheme = useMemo(
    () => ({
      key: 'profile',
      gradient: { type: 'linear', stops },
      shapes: [
        { kind: 'circle', x: 40, y: 80, r: 80, opacity: 0.05, colorIndex: 1 },
        {
          kind: 'arc',
          x: 20,
          y: 200,
          r: 160,
          start: 20,
          end: 60,
          thickness: 12,
          opacity: 0.024,
          colorIndex: 1,
        },
      ],
      intensity: 'subtle',
      noise: false,
      seed: 303,
    }),
    [stops],
  );
  useSceneBackground(backgroundTheme);

  const navigatedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated && !navigatedRef.current) {
      navigatedRef.current = true;
      router.replace?.('/(onboarding)/welcome');
    }
  }, [isAuthenticated, router]);

  const iconContainer = (name, bgColor, iconColor) => (
    <View
      style={{
        width: tokens.Spacing['4xl'],
        height: tokens.Spacing['4xl'],
        borderRadius: tokens.BorderRadius.full,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon name={name} size="sm" color={iconColor} />
    </View>
  );

  return (
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
      <ScrollView
        contentContainerStyle={{
          padding: tokens.Spacing.lg,
          paddingBottom: tokens.Spacing['7xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: tokens.Spacing['2xl'],
            paddingTop: tokens.Spacing.sm,
          }}
        >
          <Icon name="User" size="xl" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
          <Text variant="headlineMedium" weight="bold">
            Profile
          </Text>
        </View>

        <ProfileHeader
          name={user.name}
          email={user.email}
          avatar={user.avatar}
          actions={actionChips}
        />

        <View>
          <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
            Management
          </Text>

          <Card variant="outlined" contentStyle={{ padding: 0 }}>
            <ListItem
              title="Manage House"
              meta="Invite members, house settings"
              media={iconContainer('House', theme.background.secondary, 'brand')}
              accessory={{ type: 'chevron' }}
              onPress={handleHouseManagement}
            />

            <ListItem
              title="Payment Methods"
              meta="Manage cards and payment options"
              media={iconContainer('CreditCard', theme.background.secondary, 'brand')}
              accessory={{ type: 'chevron' }}
              onPress={handlePaymentMethods}
            />

            <ListItem
              title="Notification Preferences"
              meta="Customize your notifications"
              media={iconContainer('Bell', theme.background.secondary, 'brand')}
              accessory={{ type: 'chevron' }}
              onPress={handleNotificationPrefs}
            />

            <ListItem
              title="Export Data"
              meta="Download your data"
              media={iconContainer('Download', theme.background.secondary, 'brand')}
              accessory={{ type: 'chevron' }}
              onPress={handleDataExport}
            />

            <ListItem
              title="Delete Account"
              meta="Permanently delete your account"
              media={iconContainer('Trash2', theme.status.errorBackground, theme.status.error)}
              onPress={handleDeleteAccount}
            />

            <ListItem
              title="Sign Out"
              meta="Leave this account"
              media={iconContainer('LogOut', theme.status.errorBackground, theme.status.error)}
              onPress={handleSignOut}
            />
          </Card>
        </View>
      </ScrollView>
      {editing && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setEditing(false)}>
          <FormScreen>
            <FormField label="Display Name" required>
              <FormTextInput value={editName} onChangeText={setEditName} />
            </FormField>
            <FormField label="Bio" helper="Tell us about yourself">
              <TextArea value={editBio} onChangeText={setEditBio} />
            </FormField>
            <Button
              variant="primary"
              onPress={() => {
                // TODO: save profile
                setEditing(false);
              }}
              accessibilityLabel="Save Profile"
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onPress={() => setEditing(false)}
              style={{ marginTop: tokens.Spacing.sm }}
              accessibilityLabel="Cancel Edit"
            >
              Cancel
            </Button>
          </FormScreen>
        </Modal>
      )}
      {signOutVisible && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setSignOutVisible(false)}
        >
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
