import React, { useState } from 'react';
import { View, Alert, SafeAreaView, ScrollView, TextInput, StyleSheet } from 'react-native';
import {
  Text,
  Icon,
  ListItem,
  Badge,
  Button,
  LoadingSkeleton,
  GlassModal,
  useTheme,
  useTokens,
} from '@/components/ui';
import * as Haptics from 'expo-haptics';
import { withOpacity } from '@/design-system/ThemeProvider';
import { useGroceries, useUpdateGrocery, useAddGrocery } from '@/hooks';

// Section header component
const SectionHeader = ({ title, count, variant = 'neutral' }) => {
  const tokens = useTokens();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: tokens.Spacing.md,
        paddingHorizontal: tokens.Spacing.sm,
      }}
    >
      <Text variant="titleMedium" weight="semibold" style={{ marginRight: tokens.Spacing.sm }}>
        {title}
      </Text>
      <Badge variant={variant}>{count}</Badge>
    </View>
  );
};

export default function GroceriesScreen() {
  const { theme } = useTheme();
  const colors = theme;
  const tokens = useTokens();

  const { data: groceryItems = [], isLoading } = useGroceries();
  const updateGrocery = useUpdateGrocery();
  const addGrocery = useAddGrocery();

  const [isModalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemNotes, setItemNotes] = useState('');

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
          updateGrocery.mutate({ id, status: 'bought' });
        },
      },
      {
        text: 'Just Mark as Bought',
        onPress: () => updateGrocery.mutate({ id, status: 'bought' }),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleSubmitItem = () => {
    if (!itemName.trim()) return;
    addGrocery.mutate(
      { name: itemName.trim(), status: 'needed', notes: itemNotes, addedBy: 'You' },
      {
        onSuccess: () => {
          setModalVisible(false);
          setItemName('');
          setItemNotes('');
        },
      },
    );
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'out':
        return 'danger';
      case 'low':
        return 'warn';
      default:
        return 'neutral';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
          {[...Array(5)].map((_, i) => (
            <LoadingSkeleton key={i} height={72} style={{ marginBottom: tokens.Spacing.md }} />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

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

        {/* Attention Banner */}
        {attentionCount > 0 && (
          <View
            style={{
              backgroundColor: withOpacity(colors.interactive.primary, 0.03),
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border.light,
              borderRadius: tokens.BorderRadius.lg,
              padding: tokens.Spacing.md,
              marginBottom: tokens.Spacing.lg,
            }}
          >
            <Text variant="titleSmall" weight="semibold" align="center">
              {attentionCount} items need attention!
            </Text>
          </View>
        )}

        {/* Out Items Section */}
        {outItems.length > 0 && (
          <View style={{ marginBottom: tokens.Spacing.xl }}>
            <SectionHeader title="Out" count={outItems.length} variant="danger" />
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
            <SectionHeader title="Running Low" count={lowItems.length} variant="warn" />
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
                  type: 'toggle',
                  value: true,
                  onValueChange: (val) =>
                    updateGrocery.mutate({ id: item.id, status: val ? 'bought' : 'needed' }),
                }}
              />
            ))}
          </View>
        )}

        {/* Add Item Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleAddItem}
          leftIcon={<Icon name="Plus" size="md" color="inverse" />}
          style={{ marginVertical: tokens.Spacing.lg }}
        >
          Add Item
        </Button>

        {/* Spacer for bottom tabs */}
        <View style={{ height: 80 }} />
      </ScrollView>

      <GlassModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        contentStyle={{ padding: tokens.Spacing.lg }}
      >
        <Text variant="titleMedium" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
          Add Grocery Item
        </Text>
        <TextInput
          value={itemName}
          onChangeText={setItemName}
          placeholder="Item name"
          placeholderTextColor={colors.text.secondary}
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border.light,
            borderRadius: tokens.BorderRadius.lg,
            padding: tokens.Spacing.md,
            backgroundColor: withOpacity(colors.interactive.primary, 0.03),
            color: colors.text.primary,
            marginBottom: tokens.Spacing.md,
          }}
          accessibilityLabel="Item name"
        />
        <TextInput
          value={itemNotes}
          onChangeText={setItemNotes}
          placeholder="Notes"
          placeholderTextColor={colors.text.secondary}
          multiline
          style={{
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border.light,
            borderRadius: tokens.BorderRadius.lg,
            padding: tokens.Spacing.md,
            backgroundColor: withOpacity(colors.interactive.primary, 0.03),
            color: colors.text.primary,
            marginBottom: tokens.Spacing.lg,
          }}
          accessibilityLabel="Notes"
        />
        <Button
          variant="primary"
          fullWidth
          onPress={handleSubmitItem}
          style={{ marginBottom: tokens.Spacing.sm }}
        >
          Save
        </Button>
        <Button variant="secondary" fullWidth onPress={() => setModalVisible(false)}>
          Cancel
        </Button>
      </GlassModal>
    </SafeAreaView>
  );
}

