import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {
  Text,
  GlassCard,
  GlassButton,
  GlassToggle,
  Icon,
  useColors,
  useTokens
} from '@/components/ui';
import { useAuth } from '@/utils/auth/useAuth';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Premium Settings Item Component
const SettingsItem = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showToggle = false, 
  toggleValue = false, 
  onToggleChange,
  showChevron = true,
  destructive = false 
}) => {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <GlassCard
      variant="translucent"
      size="medium"
      interactive={!showToggle}
      onPress={showToggle ? undefined : onPress}
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
        
        {showToggle ? (
          <GlassToggle
            value={toggleValue}
            onValueChange={onToggleChange}
            size="medium"
          />
        ) : showChevron && (
          <Icon name="ChevronRight" size="sm" color="tertiary" />
        )}
      </View>
    </GlassCard>
  );
};

// Premium Settings Section Component
const SettingsSection = ({ title, children }) => {
  const tokens = useTokens();
  
  return (
    <View style={{ marginBottom: tokens.Spacing.xl }}>
      <Text 
        variant="titleLarge" 
        weight="semibold" 
        style={{ 
          marginBottom: tokens.Spacing.md,
          paddingHorizontal: tokens.Spacing.sm 
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
};

export default function SettingsScreen() {
  const colors = useColors();
  const tokens = useTokens();
  const { signOut } = useAuth();
  const router = useRouter();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const handleNotificationToggle = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(value);
    // In a real app, this would update user preferences
  };

  const handleDarkModeToggle = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDarkMode(value);
    // In a real app, this would update theme preferences
  };

  const handleHapticToggle = (value) => {
    if (value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setHapticFeedback(value);
    // In a real app, this would update haptic preferences
  };

  const handleBiometricsToggle = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setBiometrics(value);
    // In a real app, this would handle biometric authentication setup
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/profile');
  };

  const handleNotificationSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Notification Settings', 'This would open detailed notification preferences');
  };

  const handlePrivacyPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Privacy Settings', 'This would open privacy and data settings');
  };

  const handleSecurityPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Security Settings', 'This would open security preferences');
  };

  const handleHelpPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Help & Support', 'This would open help documentation or support chat');
  };

  const handleFeedbackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Send Feedback', 'This would open a feedback form or email composer');
  };

  const handleAboutPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('About Mates', 'Version 1.0.0\n\nYour Roommate Management App');
  };

  const handleRateApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In a real app, this would open the app store rating
    Alert.alert('Rate App', 'This would open the app store for rating');
  };

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
            router.replace('/(onboarding)/welcome');
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
          <Icon name="Settings" size="xl" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
          <Text variant="headlineMedium" weight="bold">Settings</Text>
        </View>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="User"
            title="Profile"
            subtitle="Manage your profile and preferences"
            onPress={handleProfilePress}
          />
          <SettingsItem
            icon="Bell"
            title="Notifications"
            subtitle="Configure notification preferences"
            onPress={handleNotificationSettings}
          />
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon="Moon"
            title="Dark Mode"
            subtitle="Enable dark theme"
            showToggle={true}
            toggleValue={darkMode}
            onToggleChange={handleDarkModeToggle}
            showChevron={false}
          />
          <SettingsItem
            icon="Vibrate"
            title="Haptic Feedback"
            subtitle="Enable tactile feedback"
            showToggle={true}
            toggleValue={hapticFeedback}
            onToggleChange={handleHapticToggle}
            showChevron={false}
          />
          <SettingsItem
            icon="Fingerprint"
            title="Biometric Auth"
            subtitle="Use Face ID or Touch ID"
            showToggle={true}
            toggleValue={biometrics}
            onToggleChange={handleBiometricsToggle}
            showChevron={false}
          />
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection title="Privacy & Security">
          <SettingsItem
            icon="Shield"
            title="Privacy Settings"
            subtitle="Manage your privacy preferences"
            onPress={handlePrivacyPress}
          />
          <SettingsItem
            icon="Lock"
            title="Security"
            subtitle="Password and security settings"
            onPress={handleSecurityPress}
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="CircleHelp"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={handleHelpPress}
          />
          <SettingsItem
            icon="MessageSquare"
            title="Send Feedback"
            subtitle="Share your thoughts and suggestions"
            onPress={handleFeedbackPress}
          />
          <SettingsItem
            icon="Star"
            title="Rate App"
            subtitle="Rate us on the App Store"
            onPress={handleRateApp}
          />
          <SettingsItem
            icon="Info"
            title="About"
            subtitle="App version and information"
            onPress={handleAboutPress}
          />
        </SettingsSection>

        {/* Sign Out Section */}
        <SettingsSection title="">
          <SettingsItem
            icon="LogOut"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleSignOut}
            showChevron={false}
            destructive={true}
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}