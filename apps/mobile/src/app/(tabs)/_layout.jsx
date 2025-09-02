import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  CheckSquareIcon,
  UserIcon,
  Icon,
  useTheme,
  useTokens,
} from '@/components/ui';
import { withOpacity } from '@/design-system/ThemeProvider';

// Premium tab bar icon component with enhanced styling
function TabBarIcon({ focused, IconComponent, hasNotification = false }) {
  const { theme } = useTheme();
  const tokens = useTokens();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: focused ? 1 : 0.7,
        position: 'relative',
      }}
    >
      <IconComponent size="md" color={focused ? theme.interactive.primary : theme.text.secondary} />
      {hasNotification && (
        <View
          style={{
            position: 'absolute',
            top: -tokens.Spacing.xs,
            right: -tokens.Spacing.xs,
            width: tokens.Spacing.sm,
            height: tokens.Spacing.sm,
            borderRadius: tokens.BorderRadius.full,
            backgroundColor: theme.status.error,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.background.elevated,
          }}
        />
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();
  const tokens = useTokens();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.interactive.primary,
        tabBarInactiveTintColor: theme.text.secondary,
        tabBarStyle: {
          ...tokens.Shadows.lg,
          height: tokens.Spacing['6xl'] + insets.bottom,
          paddingBottom: insets.bottom + tokens.Spacing.sm,
          paddingTop: tokens.Spacing.sm,
          backgroundColor: withOpacity(theme.interactive.primary, 0.03),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.border.light,
          borderTopLeftRadius: tokens.BorderRadius.xl,
          borderTopRightRadius: tokens.BorderRadius.xl,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: tokens.Typography.label.small.fontSize,
          lineHeight: tokens.Typography.label.small.lineHeight,
          fontWeight: tokens.Typography.label.small.fontWeight,
          marginTop: tokens.Spacing.xs,
          color: theme.text.secondary,
        },
        tabBarIconStyle: {
          marginTop: tokens.Spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} IconComponent={HomeIcon} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={DollarSignIcon} hasNotification={true} />
          ),
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          title: 'Groceries',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={ShoppingCartIcon} hasNotification={true} />
          ),
        }}
      />
      <Tabs.Screen
        name="chores"
        options={{
          title: 'Chores',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={CheckSquareIcon} hasNotification={true} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ focused }) => (
            <Icon name="Chart" size="md" color={focused ? 'brand' : 'secondary'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} IconComponent={UserIcon} />,
        }}
      />
    </Tabs>
  );
}
