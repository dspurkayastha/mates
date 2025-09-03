import React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Icon,
  ListItem,
  Badge,
  Button,
  LoadingSkeleton,
  ScreenBackground,
  GlassModal,
  useTheme,
  useTokens,
} from '@/components/ui';
import * as Haptics from 'expo-haptics';
import { useGroceries, useUpdateItemStatus } from '@/features/groceries/hooks';
import GroceryForm from '@/features/groceries/components/GroceryForm';

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
      <Text variant="titleLarge" weight="semibold" style={{ marginRight: tokens.Spacing.sm }}>
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
  const [formVisible, setFormVisible] = React.useState(false);

  const { data: groceryItems = [], isLoading } = useGroceries({
    groupId: process.env.EXPO_PUBLIC_PROJECT_GROUP_ID,
  });
  const updateItemStatus = useUpdateItemStatus(process.env.EXPO_PUBLIC_PROJECT_GROUP_ID);

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
          updateItemStatus.mutate({ id, status: 'BOUGHT' });
        },
      },
      {
        text: 'Just Mark as Bought',
        onPress: () => updateItemStatus.mutate({ id, status: 'BOUGHT' }),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormVisible(true);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'OUT':
        return 'danger';
      case 'LOW':
        return 'warn';
      case 'NEEDED':
        return 'brand';
      case 'BOUGHT':
        return 'positive';
      default:
        return 'info';
    }
  };

  if (isLoading) {
    return (
      <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
        <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
          {[...Array(5)].map((_, i) => (
            <LoadingSkeleton key={i} height={72} style={{ marginBottom: tokens.Spacing.md }} />
          ))}
        </ScrollView>
      </ScreenBackground>
    );
  }

  // Filter items by status
  const outItems = groceryItems.filter((item) => item.status === 'OUT');
  const lowItems = groceryItems.filter((item) => item.status === 'LOW');
  const neededItems = groceryItems.filter((item) => item.status === 'NEEDED');
  const boughtItems = groceryItems.filter((item) => item.status === 'BOUGHT');

  // Count items that need attention
  const attentionCount = outItems.length + lowItems.length;

  return (
    <ScreenBackground palette="brand" variant="subtle" gradientShape="linear">
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: tokens.Spacing.lg,
            paddingTop: tokens.Spacing.sm,
          }}
        >
          <Icon
            name="ShoppingCart"
            size="xl"
            color="brand"
            style={{ marginRight: tokens.Spacing.sm }}
          />
          <Text variant="headlineMedium" weight="bold">
            Groceries
          </Text>
        </View>

        {/* Glass Attention Banner */}
        {attentionCount > 0 && (
          <Card
            variant="glass"
            contentStyle={{ backgroundColor: colors.status.warning, padding: tokens.Spacing.md }}
            style={{ marginBottom: tokens.Spacing.lg }}
          >
            <Text variant="titleSmall" weight="semibold" color="inverse" align="center">
              {attentionCount} items need attention!
            </Text>
          </Card>
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
            <SectionHeader title="Recently Bought" count={boughtItems.length} variant="positive" />
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

        {/* Add Item Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleAddItem}
          leftIcon={<Icon name="Plus" size="md" color="inverse" />}
          style={{ marginVertical: tokens.Spacing.lg }}
          accessibilityLabel="Add Item"
        >
          Add Item
        </Button>

        {/* Spacer for bottom tabs */}
        <View style={{ height: 80 }} />
      </ScrollView>
      <GlassModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        accessibilityLabel="Add Grocery"
      >
        <GroceryForm onSuccess={() => setFormVisible(false)} />
      </GlassModal>
    </ScreenBackground>
  );
}
