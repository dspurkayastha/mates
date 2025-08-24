import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';

// Grocery item component
const GroceryItem = ({ name, status, addedBy, notes, onMarkBought }) => (
  <TouchableOpacity
    style={styles.groceryItem}
    onLongPress={() => Alert.alert('Hint', 'Swipe right to mark as bought, left to change status')}
  >
    <View style={styles.itemContent}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{name}</Text>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor:
                status === 'out'
                  ? '#FFE8E8'
                  : status === 'low'
                    ? '#FEF8E8'
                    : status === 'needed'
                      ? '#E8F0FE'
                      : '#E8F8E8',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  status === 'out'
                    ? '#F44336'
                    : status === 'low'
                      ? '#FF9800'
                      : status === 'needed'
                        ? '#4A80F0'
                        : '#4CAF50',
              },
            ]}
          >
            {status.toUpperCase()}
          </Text>
        </View>
      </View>

      {notes && <Text style={styles.itemNotes}>{notes}</Text>}

      <View style={styles.itemFooter}>
        <Text style={styles.addedBy}>Added by {addedBy}</Text>
        <TouchableOpacity style={styles.boughtButton} onPress={onMarkBought}>
          <Text style={styles.boughtButtonText}>✓ Bought</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

// Section header component
const SectionHeader = ({ title, count }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.countBadge}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  </View>
);

export default function GroceriesScreen() {
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
    Alert.alert('Add Item', 'This would open the add grocery item form');
  };

  // Filter items by status
  const outItems = groceryItems.filter((item) => item.status === 'out');
  const lowItems = groceryItems.filter((item) => item.status === 'low');
  const neededItems = groceryItems.filter((item) => item.status === 'needed');
  const boughtItems = groceryItems.filter((item) => item.status === 'bought');

  // Count items that need attention
  const attentionCount = outItems.length + lowItems.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🛒</Text>
          <Text style={styles.title}>Groceries</Text>
        </View>

        {/* Attention Banner */}
        {attentionCount > 0 && (
          <View style={styles.attentionBanner}>
            <Text style={styles.attentionText}>{attentionCount} items need attention!</Text>
          </View>
        )}

        {/* Out Items Section */}
        {outItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Out" count={outItems.length} />
            {outItems.map((item) => (
              <GroceryItem
                key={item.id}
                name={item.name}
                status={item.status}
                addedBy={item.addedBy}
                notes={item.notes}
                onMarkBought={() => handleMarkBought(item.id)}
              />
            ))}
          </View>
        )}

        {/* Low Items Section */}
        {lowItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Running Low" count={lowItems.length} />
            {lowItems.map((item) => (
              <GroceryItem
                key={item.id}
                name={item.name}
                status={item.status}
                addedBy={item.addedBy}
                notes={item.notes}
                onMarkBought={() => handleMarkBought(item.id)}
              />
            ))}
          </View>
        )}

        {/* Needed Items Section */}
        {neededItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Needed" count={neededItems.length} />
            {neededItems.map((item) => (
              <GroceryItem
                key={item.id}
                name={item.name}
                status={item.status}
                addedBy={item.addedBy}
                notes={item.notes}
                onMarkBought={() => handleMarkBought(item.id)}
              />
            ))}
          </View>
        )}

        {/* Bought Items Section */}
        {boughtItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Recently Bought" count={boughtItems.length} />
            {boughtItems.map((item) => (
              <GroceryItem
                key={item.id}
                name={item.name}
                status={item.status}
                addedBy={item.addedBy}
                notes={item.notes}
                onMarkBought={() => handleMarkBought(item.id)}
              />
            ))}
          </View>
        )}

        {/* Add Item Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>

        {/* Spacer for bottom tabs */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  emoji: {
    fontSize: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  attentionBanner: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  attentionText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A80F0',
  },
  groceryItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusPill: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemNotes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addedBy: {
    fontSize: 12,
    color: '#888',
  },
  boughtButton: {
    backgroundColor: '#E8F8E8',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  boughtButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
