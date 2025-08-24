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

// Transaction card component
const TransactionCard = ({ title, date, paidBy, sharedWith, amount, status }) => (
  <View style={styles.transactionCard}>
    <View style={styles.transactionHeader}>
      <Text style={styles.transactionTitle}>{title}</Text>
      <View style={[
        styles.statusBadge, 
        { backgroundColor: status === 'SETTLED' ? '#E8F8E8' : '#FFE8E8' }
      ]}>
        <Text style={[
          styles.statusText, 
          { color: status === 'SETTLED' ? '#4CAF50' : '#F44336' }
        ]}>
          {status}
        </Text>
      </View>
    </View>
    
    <Text style={styles.transactionDate}>{date}</Text>
    
    <View style={styles.transactionDetails}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Paid by:</Text>
        <Text style={styles.detailValue}>{paidBy}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Shared with:</Text>
        <Text style={styles.detailValue}>{sharedWith}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Amount:</Text>
        <Text style={[styles.detailValue, styles.amount]}>₹{amount}</Text>
      </View>
    </View>
  </View>
);

export default function ExpensesScreen() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Placeholder transactions
  const transactions = [
    {
      id: '1',
      title: 'Grocery Shopping',
      date: 'August 20, 2025',
      paidBy: 'You',
      sharedWith: 'All roommates',
      amount: '2,450',
      status: 'PENDING'
    },
    {
      id: '2',
      title: 'Electricity Bill',
      date: 'August 15, 2025',
      paidBy: 'Roommate',
      sharedWith: 'All roommates',
      amount: '1,800',
      status: 'SETTLED'
    },
    {
      id: '3',
      title: 'Internet Bill',
      date: 'August 10, 2025',
      paidBy: 'You',
      sharedWith: 'All roommates',
      amount: '1,200',
      status: 'SETTLED'
    },
    {
      id: '4',
      title: 'Dinner Takeout',
      date: 'August 5, 2025',
      paidBy: 'Roommate',
      sharedWith: 'You, Roommate',
      amount: '850',
      status: 'PENDING'
    }
  ];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    // In a real app, this would filter the transactions
  };
  
  const handleSettleUp = () => {
    Alert.alert('Settle Up', 'This would open UPI/payment options');
  };
  
  const handleAddExpense = () => {
    Alert.alert('Add Expense', 'This would open the expense form');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>💸</Text>
          <Text style={styles.title}>Expenses</Text>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'all' && styles.activeTab
            ]}
            onPress={() => handleTabPress('all')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText
            ]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'settled' && styles.activeTab
            ]}
            onPress={() => handleTabPress('settled')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'settled' && styles.activeTabText
            ]}>Settled</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'owe' && styles.activeTab
            ]}
            onPress={() => handleTabPress('owe')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'owe' && styles.activeTabText
            ]}>Owe/Owed</Text>
          </TouchableOpacity>
        </View>
        
        {/* Transaction List */}
        <View style={styles.transactionList}>
          {transactions.map(transaction => (
            <TransactionCard 
              key={transaction.id}
              title={transaction.title}
              date={transaction.date}
              paidBy={transaction.paidBy}
              sharedWith={transaction.sharedWith}
              amount={transaction.amount}
              status={transaction.status}
            />
          ))}
        </View>
        
        {/* Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>August Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Expenses:</Text>
            <Text style={styles.summaryValue}>₹6,300</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You paid:</Text>
            <Text style={styles.summaryValue}>₹3,650</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You owe:</Text>
            <Text style={styles.summaryValue}>₹400</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You are owed:</Text>
            <Text style={styles.summaryValue}>₹850</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Net balance:</Text>
            <Text style={[styles.summaryValue, { color: '#4CAF50', fontWeight: 'bold' }]}>
              +₹450
            </Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.settleButton]} 
            onPress={handleSettleUp}
          >
            <Text style={styles.actionButtonText}>Settle Up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.addButton]} 
            onPress={handleAddExpense}
          >
            <Text style={styles.actionButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
        
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4A80F0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  transactionList: {
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  transactionDetails: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  amount: {
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settleButton: {
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4A80F0',
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
