import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {
  Text,
  GlassCard,
  GlassButton,
  GlassInput,
  Icon,
  StatusIndicator,
  useColors,
  useTokens
} from '@/components/ui';
import { useAuth } from '@/utils/auth/useAuth';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Premium Profile Header Component
const ProfileHeader = ({ 
  name, 
  email, 
  avatar, 
  houseName, 
  role,
  onEditPress 
}) => {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <GlassCard
      variant="translucent"
      size="large"
      style={{ marginBottom: tokens.Spacing.xl }}
    >
      <View style={{ padding: tokens.Spacing.xl, alignItems: 'center' }}>
        {/* Profile Avatar */}
        <View style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: colors.background.secondary,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: tokens.Spacing.lg,
          overflow: 'hidden',
        }}>
          {avatar ? (
            <Image 
              source={{ uri: avatar }} 
              style={{ width: 100, height: 100 }}
              resizeMode="cover"
            />
          ) : (
            <Icon name="User" size="3xl" color="secondary" />
          )}
        </View>
        
        {/* User Info */}
        <Text variant="headlineMedium" weight="bold" style={{ marginBottom: tokens.Spacing.xs }} align="center">
          {name}
        </Text>
        <Text variant="bodyLarge" color="secondary" style={{ marginBottom: tokens.Spacing.sm }} align="center">
          {email}
        </Text>
        
        {/* House Info */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: tokens.Spacing.lg,
        }}>
          <Icon name="House" size="sm" color="brand" style={{ marginRight: tokens.Spacing.xs }} />
          <Text variant="bodyMedium" weight="medium" color="primary">
            {houseName}
          </Text>
          <StatusIndicator
            variant="info"
            label={role}
            size="small"
            style={{ marginLeft: tokens.Spacing.sm }}
          />
        </View>
        
        {/* Edit Button */}
        <GlassButton
          variant="secondary"
          buttonStyle="outlined"
          size="medium"
          onPress={onEditPress}
          leftIcon={<Icon name="Pencil" size="xs" color="primary" />}
        >
          Edit Profile
        </GlassButton>
      </View>
    </GlassCard>
  );
};

// Profile Stats Component
const ProfileStats = ({ stats }) => {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <GlassCard
      variant="translucent"
      size="medium"
      style={{ marginBottom: tokens.Spacing.xl }}
    >
      <View style={{ padding: tokens.Spacing.lg }}>
        <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
          Your Activity
        </Text>
        
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          {stats.map((stat, index) => (
            <View key={index} style={{ alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.background.secondary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: tokens.Spacing.sm,
              }}>
                <Icon name={stat.icon} size="md" color="brand" />
              </View>
              <Text variant="headlineSmall" weight="bold" style={{ marginBottom: tokens.Spacing.xs }}>
                {stat.value}
              </Text>
              <Text variant="labelSmall" color="secondary" align="center">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </GlassCard>
  );
};

// Profile Action Item Component
const ProfileActionItem = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showChevron = true,
  destructive = false 
}) => {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <GlassCard
      variant="translucent"
      size="medium"
      interactive
      onPress={onPress}
      style={{ marginBottom: tokens.Spacing.md }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: tokens.Spacing.lg,
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: destructive ? colors.status.error : colors.background.secondary,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: tokens.Spacing.md,
        }}>
          <Icon 
            name={icon} 
            size="sm" 
            color={destructive ? "inverse" : "secondary"} 
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text 
            variant="titleMedium" 
            weight="medium" 
            color={destructive ? "error" : "primary"}
            style={{ marginBottom: subtitle ? tokens.Spacing.xs : 0 }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodySmall" color="secondary">
              {subtitle}
            </Text>
          )}
        </View>
        
        {showChevron && (
          <Icon name="ChevronRight" size="sm" color="tertiary" />
        )}
      </View>
    </GlassCard>
  );
};

export default function ProfileScreen() {
  const colors = useColors();
  const tokens = useTokens();
  const { signOut } = useAuth();
  const router = useRouter();
  
  // Mock user data - in a real app, this would come from your auth/user store
  const [user] = useState({
    name: 'Alex Smith',
    email: 'alex@example.com',
    avatar: null, // URL to profile image
    houseName: 'Our House',
    role: 'Admin',
  });
  
  // Mock activity stats
  const activityStats = [
    { icon: 'DollarSign', value: '₹1,240', label: 'This Month\nExpenses' },
    { icon: 'SquareCheck', value: '12', label: 'Chores\nCompleted' },
    { icon: 'ShoppingCart', value: '8', label: 'Groceries\nAdded' },
  ];

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Edit Profile', 'This would open the profile editing form');
  };

  const handleHouseManagement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('House Management', 'This would open house settings and member management');
  };

  const handlePaymentMethods = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Payment Methods', 'This would open payment method management');
  };

  const handleNotificationPrefs = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/settings');
  };

  const handleDataExport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Export Data', 'This would allow you to export your data');
  };

  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView 
        contentContainerStyle={{ 
          padding: tokens.Spacing.lg,
          paddingBottom: 120 // Extra space for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: tokens.Spacing['2xl'],
          paddingTop: tokens.Spacing.sm
        }}>
          <Icon name="User" size="xl" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
          <Text variant="headlineMedium" weight="bold">Profile</Text>
        </View>

        {/* Profile Header */}
        <ProfileHeader
          name={user.name}
          email={user.email}
          avatar={user.avatar}
          houseName={user.houseName}
          role={user.role}
          onEditPress={handleEditProfile}
        />

        {/* Activity Stats */}
        <ProfileStats stats={activityStats} />

        {/* House Management */}
        <View style={{ marginBottom: tokens.Spacing.xl }}>
          <Text 
            variant="titleLarge" 
            weight="semibold" 
            style={{ 
              marginBottom: tokens.Spacing.md,
              paddingHorizontal: tokens.Spacing.sm 
            }}
          >
            House Management
          </Text>
          
          <ProfileActionItem
            icon="House"
            title="Manage House"
            subtitle="Invite members, house settings"
            onPress={handleHouseManagement}
          />
        </View>

        {/* Account Settings */}
        <View style={{ marginBottom: tokens.Spacing.xl }}>
          <Text 
            variant="titleLarge" 
            weight="semibold" 
            style={{ 
              marginBottom: tokens.Spacing.md,
              paddingHorizontal: tokens.Spacing.sm 
            }}
          >
            Account Settings
          </Text>
          
          <ProfileActionItem
            icon="CreditCard"
            title="Payment Methods"
            subtitle="Manage cards and payment options"
            onPress={handlePaymentMethods}
          />
          
          <ProfileActionItem
            icon="Bell"
            title="Notification Preferences"
            subtitle="Customize your notifications"
            onPress={handleNotificationPrefs}
          />
          
          <ProfileActionItem
            icon="Download"
            title="Export Data"
            subtitle="Download your data"
            onPress={handleDataExport}
          />
        </View>

        {/* Danger Zone */}
        <View style={{ marginBottom: tokens.Spacing.xl }}>
          <Text 
            variant="titleLarge" 
            weight="semibold" 
            style={{ 
              marginBottom: tokens.Spacing.md,
              paddingHorizontal: tokens.Spacing.sm 
            }}
          >
            Danger Zone
          </Text>
          
          <ProfileActionItem
            icon="Trash2"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            showChevron={false}
            destructive={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}