/**
 * Premium Settings Screen
 * Modern settings interface with organized sections and premium UI
 * 2025 design standards with accessibility and smooth interactions
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens, useTheme } from '../design-system/ThemeProvider';
import { generateAccessibilityLabel, generateAccessibilityHint } from '../utils/accessibility';
import Text from '../components/ui/Text';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Icon from '../components/ui/Icon';
import { BiometricStatus } from '../components/ui/BiometricAuth';
import { FocusIndicator } from '../utils/keyboardNavigation';

// Temporary notification system
const useNotifications = () => ({
  show: {
    success: (title: string, message: string) => console.log('Success:', title, message),
    info: (title: string, message: string) => console.log('Info:', title, message),
    error: (title: string, message: string) => console.log('Error:', title, message),
  }
});

// ============================================================================
// TYPES
// ============================================================================

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'action' | 'info';
  value?: any;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
  disabled?: boolean;
  badge?: string | number;
}

interface SettingSection {
  id: string;
  title: string;
  subtitle?: string;
  items: SettingItem[];
}

// ============================================================================
// SETTING ITEM COMPONENT
// ============================================================================

interface SettingItemComponentProps {
  item: SettingItem;
  sectionId: string;
}

const SettingItemComponent: React.FC<SettingItemComponentProps> = ({ item, sectionId }) => {
  const colors = useColors();
  const tokens = useTokens();
  const { show: showToast } = useNotifications();

  const handlePress = () => {
    if (item.disabled) return;

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (item.onPress) {
      item.onPress();
    } else if (item.type === 'toggle' && item.onToggle) {
      item.onToggle(!item.value);
    }
  };

  const getAccessibilityProps = () => {
    let role: any = 'button';
    let hint = generateAccessibilityHint.button.navigation(item.title);
    
    if (item.type === 'toggle') {
      role = 'switch';
      hint = generateAccessibilityHint.button.toggle(item.value);
    }

    return {
      accessibilityRole: role,
      accessibilityLabel: generateAccessibilityLabel.button(
        item.title,
        { disabled: item.disabled }
      ),
      accessibilityHint: hint,
      accessibilityState: {
        disabled: item.disabled,
        checked: item.type === 'toggle' ? item.value : undefined,
      },
    };
  };

  return (
    <FocusIndicator style={{ marginBottom: tokens.Spacing.xs }}>
      <GlassCard
        variant="filled"
        size="medium"
        interactive={!item.disabled}
        onPress={handlePress}
        style={{
          opacity: item.disabled ? 0.5 : 1,
        }}
        {...getAccessibilityProps()}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: tokens.Spacing.lg,
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: item.destructive 
                ? colors.status.errorBackground 
                : colors.background.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: tokens.Spacing.md,
            }}
          >
            <Icon
              name={item.icon as any}
              size="md"
              color={item.destructive ? 'error' : 'secondary'}
            />
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Text
              variant="titleMedium"
              color={item.destructive ? 'error' : 'primary'}
              weight="semibold"
              style={{ marginBottom: item.subtitle ? 4 : 0 }}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text variant="bodySmall" color="secondary">
                {item.subtitle}
              </Text>
            )}
          </View>

          {/* Right Content */}
          <View style={{ alignItems: 'flex-end' }}>
            {/* Badge */}
            {item.badge && (
              <View
                style={{
                  backgroundColor: colors.interactive.primary,
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginBottom: 4,
                }}
              >
                <Text variant="labelSmall" color="inverse" weight="semibold">
                  {item.badge}
                </Text>
              </View>
            )}

            {/* Control */}
            {item.type === 'toggle' && (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                disabled={item.disabled}
                trackColor={{
                  false: colors.border.medium,
                  true: colors.interactive.primary,
                }}
                thumbColor={colors.background.primary}
                accessibilityElementsHidden={true}
              />
            )}

            {item.type === 'navigation' && (
              <Icon name="ChevronRight" size="sm" color="tertiary" />
            )}

            {item.type === 'info' && item.value && (
              <Text variant="bodyMedium" color="secondary">
                {item.value}
              </Text>
            )}
          </View>
        </View>
      </GlassCard>
    </FocusIndicator>
  );
};

// ============================================================================
// SETTING SECTION COMPONENT
// ============================================================================

interface SettingSectionComponentProps {
  section: SettingSection;
}

const SettingSectionComponent: React.FC<SettingSectionComponentProps> = ({ section }) => {
  const tokens = useTokens();

  return (
    <View style={{ marginBottom: tokens.Spacing['2xl'] }}>
      {/* Section Header */}
      <View style={{ marginBottom: tokens.Spacing.md, paddingHorizontal: tokens.Spacing.md }}>
        <Text
          variant="titleLarge"
          color="primary"
          weight="bold"
          accessibilityRole="header"
        >
          {section.title}
        </Text>
        {section.subtitle && (
          <Text
            variant="bodyMedium"
            color="secondary"
            style={{ marginTop: 4 }}
          >
            {section.subtitle}
          </Text>
        )}
      </View>

      {/* Section Items */}
      <View style={{ paddingHorizontal: tokens.Spacing.md }}>
        {section.items.map((item) => (
          <SettingItemComponent
            key={item.id}
            item={item}
            sectionId={section.id}
          />
        ))}
      </View>
    </View>
  );
};

// ============================================================================
// MAIN SETTINGS SCREEN
// ============================================================================

export const SettingsScreen: React.FC = () => {
  const colors = useColors();
  const tokens = useTokens();
  const theme = useTheme();
  const notifications = useNotifications();

  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(theme.isDark);
  const [highContrast, setHighContrast] = useState(theme.isHighContrast);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  // Handle theme changes
  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    theme.setColorScheme(enabled ? 'dark' : 'light');
    notifications.show.success('Theme Updated', `Switched to ${enabled ? 'dark' : 'light'} mode`);
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    setHighContrast(enabled);
    theme.toggleContrast();
    notifications.show.success('Accessibility Updated', `High contrast ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Settings sections configuration
  const settingSections: SettingSection[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      subtitle: 'Customize how the app looks and feels',
      items: [
        {
          id: 'dark_mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme throughout the app',
          icon: 'Moon',
          type: 'toggle',
          value: darkMode,
          onToggle: handleDarkModeToggle,
        },
        {
          id: 'high_contrast',
          title: 'High Contrast',
          subtitle: 'Improve visibility with enhanced contrast',
          icon: 'Eye',
          type: 'toggle',
          value: highContrast,
          onToggle: handleHighContrastToggle,
        },
        {
          id: 'text_size',
          title: 'Text Size',
          subtitle: 'Adjust text size for better readability',
          icon: 'Type',
          type: 'navigation',
          onPress: () => notifications.show.info('Coming Soon', 'Text size settings will be available soon'),
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage how you receive notifications',
      items: [
        {
          id: 'push_notifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications about expenses and activities',
          icon: 'Bell',
          type: 'toggle',
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          id: 'email_notifications',
          title: 'Email Notifications',
          subtitle: 'Get summaries and reminders via email',
          icon: 'Mail',
          type: 'toggle',
          value: false,
          onToggle: (value) => notifications.show.info('Email Setup', 'Configure email in account settings'),
        },
        {
          id: 'notification_settings',
          title: 'Notification Settings',
          subtitle: 'Customize notification types and frequency',
          icon: 'Settings',
          type: 'navigation',
          onPress: () => Linking.openSettings(),
        },
      ],
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      subtitle: 'Protect your account and data',
      items: [
        {
          id: 'biometric_auth',
          title: 'Biometric Authentication',
          subtitle: 'Use Face ID or Touch ID to unlock the app',
          icon: 'Shield',
          type: 'toggle',
          value: biometricAuth,
          onToggle: setBiometricAuth,
        },
        {
          id: 'change_password',
          title: 'Change Password',
          subtitle: 'Update your account password',
          icon: 'Lock',
          type: 'navigation',
          onPress: () => notifications.show.info('Coming Soon', 'Password change will be available soon'),
        },
        {
          id: 'privacy_settings',
          title: 'Privacy Settings',
          subtitle: 'Control what data is shared',
          icon: 'UserCheck',
          type: 'navigation',
          onPress: () => notifications.show.info('Privacy', 'Privacy settings coming soon'),
        },
      ],
    },
    {
      id: 'data',
      title: 'Data & Storage',
      subtitle: 'Manage your data and backups',
      items: [
        {
          id: 'auto_backup',
          title: 'Auto Backup',
          subtitle: 'Automatically backup your data to cloud',
          icon: 'Cloud',
          type: 'toggle',
          value: autoBackup,
          onToggle: setAutoBackup,
        },
        {
          id: 'export_data',
          title: 'Export Data',
          subtitle: 'Download your expenses and data',
          icon: 'Download',
          type: 'action',
          onPress: () => notifications.show.success('Export Started', 'Your data export will be ready shortly'),
        },
        {
          id: 'storage_usage',
          title: 'Storage Usage',
          subtitle: 'View app storage and cache usage',
          icon: 'HardDrive',
          type: 'info',
          value: '2.4 MB',
        },
      ],
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      subtitle: 'Features to improve app accessibility',
      items: [
        {
          id: 'haptic_feedback',
          title: 'Haptic Feedback',
          subtitle: 'Feel vibrations for interactions',
          icon: 'Vibrate',
          type: 'toggle',
          value: hapticFeedback,
          onToggle: setHapticFeedback,
        },
        {
          id: 'voice_control',
          title: 'Voice Control',
          subtitle: 'Navigate the app using voice commands',
          icon: 'Mic',
          type: 'toggle',
          value: false,
          disabled: true,
          onToggle: () => notifications.show.info('Coming Soon', 'Voice control will be available soon'),
        },
        {
          id: 'screen_reader',
          title: 'Screen Reader Support',
          subtitle: 'Enhanced support for screen readers',
          icon: 'Volume2',
          type: 'info',
          value: 'Enabled',
        },
      ],
    },
    {
      id: 'support',
      title: 'Support & About',
      subtitle: 'Get help and learn more about the app',
      items: [
        {
          id: 'help_center',
          title: 'Help Center',
          subtitle: 'Find answers to common questions',
          icon: 'CircleHelp',
          type: 'navigation',
          onPress: () => notifications.show.info('Help', 'Opening help center...'),
        },
        {
          id: 'contact_support',
          title: 'Contact Support',
          subtitle: 'Get help from our support team',
          icon: 'MessageCircle',
          type: 'navigation',
          onPress: () => notifications.show.info('Support', 'Opening support chat...'),
        },
        {
          id: 'rate_app',
          title: 'Rate This App',
          subtitle: 'Share your feedback on the app store',
          icon: 'Star',
          type: 'action',
          onPress: () => notifications.show.success('Thank You!', 'Redirecting to app store...'),
        },
        {
          id: 'version',
          title: 'Version',
          subtitle: 'Current app version',
          icon: 'Info',
          type: 'info',
          value: '1.0.0',
        },
      ],
    },
    {
      id: 'account',
      title: 'Account',
      subtitle: 'Manage your account and data',
      items: [
        {
          id: 'sign_out',
          title: 'Sign Out',
          subtitle: 'Sign out of your account',
          icon: 'LogOut',
          type: 'action',
          destructive: true,
          onPress: () => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: () => notifications.show.success('Signed Out', 'You have been signed out successfully'),
                },
              ]
            );
          },
        },
        {
          id: 'delete_account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account and data',
          icon: 'Trash2',
          type: 'action',
          destructive: true,
          onPress: () => {
            Alert.alert(
              'Delete Account',
              'This action cannot be undone. All your data will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => notifications.show.error('Account Deletion', 'Please contact support to delete your account'),
                },
              ]
            );
          },
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 60,
          paddingBottom: tokens.Spacing.lg,
          paddingHorizontal: tokens.Spacing.lg,
          backgroundColor: colors.background.elevated,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}
      >
        <Text
          variant="headlineLarge"
          color="primary"
          weight="bold"
          accessibilityRole="header"
        >
          Settings
        </Text>
        <Text variant="bodyMedium" color="secondary" style={{ marginTop: 4 }}>
          Customize your experience
        </Text>
      </View>

      {/* Settings Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: tokens.Spacing.lg,
          paddingBottom: 100, // Space for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {settingSections.map((section) => (
          <SettingSectionComponent key={section.id} section={section} />
        ))}

        {/* Footer */}
        <View
          style={{
            alignItems: 'center',
            marginTop: tokens.Spacing['2xl'],
            paddingVertical: tokens.Spacing.lg,
          }}
        >
          <Text variant="bodySmall" color="tertiary" align="center">
            Made with ❤️ for better roommate experiences
          </Text>
          <Text variant="labelSmall" color="tertiary" style={{ marginTop: 4 }}>
            © 2025 Mates App. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;