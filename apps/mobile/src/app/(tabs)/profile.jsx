import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import {
  Text,
  ListItem,
  Icon,
  Button,
  Card,
  useTheme,
  useTokens,
} from '@/components/ui';
import { useRouter } from 'expo-router';
import { useAuth } from '@/utils/auth/useAuth';
import * as Haptics from 'expo-haptics';

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
        <Text
          variant="titleLarge"
          weight="bold"
          style={{ marginBottom: tokens.Spacing.xs }}
        >
          {name}
        </Text>
        <Text
          variant="bodyMedium"
          color="secondary"
          style={{ marginBottom: tokens.Spacing.sm }}
        >
          {email}
        </Text>

        <View style={{ flexDirection: 'row' }}>
          {actions.map((action) => (
            <ActionChip
              key={action.label}
              label={action.label}
              onPress={action.onPress}
            />
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
  const { signOut } = useAuth();

  const [user] = useState({
    name: 'Alex Smith',
    email: 'alex@example.com',
    avatar: null,
  });

  const actionChips = [
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
    signOut();
  };

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background.primary }}
    >
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
          <Icon
            name="User"
            size="xl"
            color="brand"
            style={{ marginRight: tokens.Spacing.sm }}
          />
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
          <Text
            variant="titleLarge"
            weight="semibold"
            style={{ marginBottom: tokens.Spacing.md }}
          >
            Management
          </Text>

          <Card variant="outlined" contentStyle={{ padding: 0 }}>
            <ListItem
              title="Manage House"
              meta="Invite members, house settings"
              media={iconContainer(
                'House',
                theme.background.secondary,
                'brand',
              )}
              accessory={{ type: 'chevron' }}
              onPress={handleHouseManagement}
            />

            <ListItem
              title="Payment Methods"
              meta="Manage cards and payment options"
              media={iconContainer(
                'CreditCard',
                theme.background.secondary,
                'brand',
              )}
              accessory={{ type: 'chevron' }}
              onPress={handlePaymentMethods}
            />

            <ListItem
              title="Notification Preferences"
              meta="Customize your notifications"
              media={iconContainer(
                'Bell',
                theme.background.secondary,
                'brand',
              )}
              accessory={{ type: 'chevron' }}
              onPress={handleNotificationPrefs}
            />

            <ListItem
              title="Export Data"
              meta="Download your data"
              media={iconContainer(
                'Download',
                theme.background.secondary,
                'brand',
              )}
              accessory={{ type: 'chevron' }}
              onPress={handleDataExport}
            />

            <ListItem
              title="Delete Account"
              meta="Permanently delete your account"
              media={iconContainer(
                'Trash2',
                theme.status.errorBackground,
                theme.status.error,
              )}
              onPress={handleDeleteAccount}
            />

            <ListItem
              title="Sign Out"
              meta="Leave this account"
              media={iconContainer(
                'LogOut',
                theme.status.errorBackground,
                theme.status.error,
              )}
              onPress={handleSignOut}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}