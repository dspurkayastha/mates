import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

// Simple emoji tab icons
function TabBarIcon({ focused, color, emoji }) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: focused ? 1 : 0.7,
      }}
    >
      <Text style={{ fontSize: 20, color }}>{emoji}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A80F0',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 5,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} emoji="🏠" />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} emoji="💸" />
          ),
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          title: 'Groceries',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} emoji="🛒" />
          ),
        }}
      />
      <Tabs.Screen
        name="chores"
        options={{
          title: 'Chores',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon focused={focused} color={color} emoji="🧹" />
          ),
        }}
      />
    </Tabs>
  );
}
