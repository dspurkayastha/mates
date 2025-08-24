import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  ScrollView
} from 'react-native';

// Card component for dashboard items
const StatusCard = ({ title, children, color = '#E8F0FE' }) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

export default function HomeScreen() {
  const [houseName] = useState('Our House'); // This would come from API/store in a real app
  
  const handleFabPress = () => {
    Alert.alert(
      'Quick Actions',
      'What would you like to add?',
      [
        { text: 'Add Expense', onPress: () => console.log('Add expense') },
        { text: 'Add Grocery Item', onPress: () => console.log('Add grocery') },
        { text: 'Create Poll', onPress: () => console.log('Create poll') },
        { text: 'Add Chore', onPress: () => console.log('Add chore') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🏠</Text>
          <Text style={styles.houseName}>{houseName}</Text>
        </View>
        
        {/* Active Poll Banner (if exists) */}
        <TouchableOpacity style={styles.pollBanner}>
          <Text style={styles.pollBannerText}>
            Poll: Dinner tonight? — Vote Now!
          </Text>
        </TouchableOpacity>
        
        {/* Status Cards */}
        <StatusCard title="Next Rent Due" color="#FFE8E8">
          <View style={styles.cardContent}>
            <Text style={styles.cardValue}>₹15,000</Text>
            <Text style={styles.cardSubtext}>Due in 5 days</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>2/4 PAID</Text>
            </View>
          </View>
        </StatusCard>
        
        <StatusCard title="Groceries" color="#E8F8E8">
          <View style={styles.cardContent}>
            <Text style={styles.cardSubtext}>Current status:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• 2 items out</Text>
              <Text style={styles.bulletItem}>• 3 items running low</Text>
            </View>
          </View>
        </StatusCard>
        
        <StatusCard title="Today's Chores" color="#F0E8FE">
          <View style={styles.cardContent}>
            <Text style={styles.cardSubtext}>Your tasks:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Dishes (You)</Text>
              <Text style={styles.bulletItem}>• Take out trash (Roommate)</Text>
            </View>
          </View>
        </StatusCard>
        
        <StatusCard title="Who Owes What" color="#FEF8E8">
          <View style={styles.cardContent}>
            <Text style={styles.cardSubtext}>This month:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• You owe: ₹400</Text>
              <Text style={styles.bulletItem}>• You are owed: ₹0</Text>
            </View>
          </View>
        </StatusCard>
        
        <StatusCard title="House Rules" color="#E8F0FE">
          <View style={styles.cardContent}>
            <Text style={styles.cardSubtext}>Pinned rules:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Quiet hours after 11pm</Text>
              <Text style={styles.bulletItem}>• Clean kitchen after use</Text>
              <Text style={styles.bulletItem}>• Guests need 24h notice</Text>
            </View>
          </View>
        </StatusCard>
        
        {/* Spacer for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleFabPress}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  houseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pollBanner: {
    backgroundColor: '#4A80F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  pollBannerText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  cardContent: {
    paddingTop: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A80F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});
