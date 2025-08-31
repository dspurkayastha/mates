import React, { useState } from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Text,
  GlassCard,
  GlassButton,
  Icon,
  ListItem,
  useTheme,
  useTokens
} from '@/components/ui';
import * as Haptics from 'expo-haptics';

// Glass Section header component
const SectionHeader = ({ title, count }) => {
  const { theme } = useTheme();
  const colors = theme;
  const tokens = useTokens();
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.Spacing.md,
      paddingHorizontal: tokens.Spacing.sm
    }}>
      <Text variant="titleLarge" weight="semibold" style={{ marginRight: tokens.Spacing.sm }}>
        {title}
      </Text>
      <View style={{
        backgroundColor: colors.interactive.primary,
        borderRadius: tokens.BorderRadius.full,
        paddingVertical: tokens.Spacing.xs,
        paddingHorizontal: tokens.Spacing.sm,
        minWidth: 24,
        alignItems: 'center'
      }}>
        <Text variant="labelSmall" weight="bold" color="inverse">
          {count}
        </Text>
      </View>
    </View>
  );
};

export default function GroceriesScreen() {
  const { theme } = useTheme();
  const colors = theme;
  const tokens = useTokens();
  
  // Placeholder grocery items
  const [groceryItems, setGroceryItems] = useState([
    { id: '1', name: 'Milk', status: 'out', addedBy: 'You', notes: '1L, Amul' },
    { id: '2', name: 'Bread', status: 'low', addedBy: 'Roommate', notes: 'Brown bread preferred' },
    { id: '3', name: 'Eggs', status: 'out', addedBy: 'You', notes: '1 dozen' },
    { id: '4', name: 'Rice', status: 'needed', addedBy: 'Roommate', notes: '5kg bag' },
    { id: '5', name: 'Onions', status: 'needed', addedBy: 'You', notes: '1kg' },
    { id: '6', name: 'Toilet Paper', status: 'low', addedBy: 'Roommate', notes: '' },
    { id: '7', name: 'Tomatoes', status: 'bought', addedBy: 'You', notes: '500g' },
    { id: '8', name: 'Dish Soap', status: 'bought', addedBy: 'Roommate', notes: 'Any brand' },
  ]);

  const handleMarkBought = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Add Expense', 'Would you like to add this to expenses?', [
      {
        text: 'Yes',
        onPress: () => {
          Alert.alert(
            'Expense Details',
            'This would open the expense form with this grocery item pre-filled',
          );
          // Update item status
          setGroceryItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, status: 'bought' } : item)),
          );
        },
      },
      {
        text: 'Just Mark as Bought',
        onPress: () => {
          // Just update the status without creating an expense
          setGroceryItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? { ...item, status: 'bought' } : item)),
          );
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Add Item', 'This would open the add grocery item form');
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'out':
        return 'error';
      case 'low':
        return 'warning';
      case 'needed':
        return 'info';
      case 'bought':
        return 'success';
      default:
        return 'info';
    }
  };

  // Filter items by status
  const outItems = groceryItems.filter((item) => item.status === 'out');
  const lowItems = groceryItems.filter((item) => item.status === 'low');
  const neededItems = groceryItems.filter((item) => item.status === 'needed');
  const boughtItems = groceryItems.filter((item) => item.status === 'bought');

  // Count items that need attention
  const attentionCount = outItems.length + lowItems.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: tokens.Spacing.lg,
          paddingTop: tokens.Spacing.sm
        }}>
          <Icon name="ShoppingCart" size="xl" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
          <Text variant="headlineMedium" weight="bold">Groceries</Text>
        </View>

        {/* Glass Attention Banner */}
        {attentionCount > 0 && (
          <GlassCard
            variant="filled"
            style={{
              backgroundColor: colors.status.warning,
              marginBottom: tokens.Spacing.lg
            }}
          >
            <View style={{ padding: tokens.Spacing.md }}>
              <Text variant="titleSmall" weight="semibold" color="inverse" align="center">
                {attentionCount} items need attention!
              </Text>
            </View>
          </GlassCard>
        )}

        {/* Out Items Section */}
        {outItems.length > 0 && (
          <View style={{ marginBottom: tokens.Spacing.xl }}>
            <SectionHeader title="Out" count={outItems.length} />
            {outItems.map((item) => (
              <ListItem
                key={item.id}
                title={item.name}
                meta={`Added by ${item.addedBy}`}
                media={<Icon name="ShoppingCart" size="lg" color="brand" />}
                accessory={{
                  type: 'badge',
                  label: item.status.toUpperCase(),
                  variant: getStatusVariant(item.status),
                }}
                onPress={() => handleMarkBought(item.id)}
              />
            ))}
          </View>
        )}

        {/* Low Items Section */}
        {lowItems.length > 0 && (
          <View style={{ marginBottom: tokens.Spacing.xl }}>
            <SectionHeader title="Running Low" count={lowItems.length} />
            {lowItems.map((item) => (
              <ListItem
                key={item.id}
                title={item.name}
                meta={`Added by ${item.addedBy}`}
                media={<Icon name="ShoppingCart" size="lg" color="brand" />}
                accessory={{
                  type: 'badge',
                  label: item.status.toUpperCase(),
                  variant: getStatusVariant(item.status),
                }}
                onPress={() => handleMarkBought(item.id)}
              />
            ))}
          </View>
        )}

        {/* Needed Items Section */}
        {neededItems.length > 0 && (
          <View style={{ marginBottom: tokens.Spacing.xl }}>
            <SectionHeader title="Needed" count={neededItems.length} />
            {neededItems.map((item) => (
              <ListItem
                key={item.id}
                title={item.name}
                meta={`Added by ${item.addedBy}`}
                media={<Icon name="ShoppingCart" size="lg" color="brand" />}
                accessory={{
                  type: 'badge',
                  label: item.status.toUpperCase(),
                  variant: getStatusVariant(item.status),
                }}
                onPress={() => handleMarkBought(item.id)}
              />
            ))}
          </View>
        )}

        {/* Bought Items Section */}
        {boughtItems.length > 0 && (
          <View style={{ marginBottom: tokens.Spacing.xl }}>
            <SectionHeader title="Recently Bought" count={boughtItems.length} />
            {boughtItems.map((item) => (
              <ListItem
                key={item.id}
                title={item.name}
                meta={`Added by ${item.addedBy}`}
                media={<Icon name="ShoppingCart" size="lg" color="brand" />}
                accessory={{
                  type: 'badge',
                  label: item.status.toUpperCase(),
                  variant: getStatusVariant(item.status),
                }}
                onPress={() => handleMarkBought(item.id)}
              />
            ))}
          </View>
        )}

        {/* Glass Add Item Button */}
        <GlassButton
          variant="primary"
          buttonStyle="tinted"
          size="large"
          fullWidth
          onPress={handleAddItem}
          leftIcon={<Icon name="Plus" size="sm" color="inverse" />}
          style={{ marginVertical: tokens.Spacing.lg }}
        >
          Add Item
        </GlassButton>

        {/* Spacer for bottom tabs */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

