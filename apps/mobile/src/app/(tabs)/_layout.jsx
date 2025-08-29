import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { 
  HomeIcon, 
  DollarSignIcon, 
  ShoppingCartIcon, 
  CheckSquareIcon, 
  SettingsIcon,
  UserIcon,
  useColors,
  useTokens 
} from '@/components/ui';

// Premium tab bar icon component with enhanced styling
function TabBarIcon({ focused, IconComponent, hasNotification = false }) {
  const colors = useColors();
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
      <IconComponent 
        size="md" 
        color={focused ? colors.interactive.primary : colors.text.secondary} 
      />
      {hasNotification && (
        <View style={{
          position: 'absolute',
          top: -2,
          right: -6,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.status.error,
          borderWidth: 1,
          borderColor: colors.background.elevated,
        }} />
      )}
    </View>
  );
}

export default function TabsLayout() {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.interactive.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 12,
          backgroundColor: colors.background.elevated,
          borderTopWidth: 0,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 12,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={HomeIcon} />
          ),
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={UserIcon} />
          ),
        }}
      />
    </Tabs>
  );
}
