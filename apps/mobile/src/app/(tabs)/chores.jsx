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

// Chore item component
const ChoreItem = ({ icon, name, assignedTo, dueTime, isCompleted, onToggleComplete }) => (
  <View style={styles.choreItem}>
    <View style={styles.choreIconContainer}>
      <Text style={styles.choreIcon}>{icon}</Text>
    </View>
    
    <View style={styles.choreDetails}>
      <Text style={styles.choreName}>{name}</Text>
      <View style={styles.choreSubDetails}>
        <Text style={styles.choreAssigned}>
          Assigned to: <Text style={styles.emphasizedText}>{assignedTo}</Text>
        </Text>
        <Text style={styles.choreDue}>
          Due: <Text style={styles.emphasizedText}>{dueTime}</Text>
        </Text>
      </View>
    </View>
    
    <TouchableOpacity 
      style={[
        styles.completeButton, 
        isCompleted ? styles.completedButton : {}
      ]}
      onPress={onToggleComplete}
    >
      <Text style={[
        styles.completeButtonText,
        isCompleted ? styles.completedButtonText : {}
      ]}>
        {isCompleted ? '✓ Done' : 'Mark Done'}
      </Text>
    </TouchableOpacity>
  </View>
);

// Leaderboard item component
const LeaderboardItem = ({ rank, name, completedCount, streak }) => (
  <View style={styles.leaderboardItem}>
    <View style={styles.rankContainer}>
      <Text style={styles.rankText}>{rank}</Text>
    </View>
    
    <View style={styles.leaderDetails}>
      <Text style={styles.leaderName}>{name}</Text>
      <Text style={styles.leaderStats}>
        {completedCount} chores completed this week
      </Text>
    </View>
    
    <View style={styles.streakContainer}>
      <Text style={styles.streakText}>{streak}</Text>
      <Text style={styles.streakLabel}>day streak</Text>
    </View>
  </View>
);

export default function ChoresScreen() {
  const [activeTab, setActiveTab] = useState('today');
  
  // Placeholder chores data
  const todayChores = [
    { id: '1', icon: '🧹', name: 'Sweep Living Room', assignedTo: 'You', dueTime: 'Today, 6 PM', isCompleted: false },
    { id: '2', icon: '🍽️', name: 'Wash Dishes', assignedTo: 'You', dueTime: 'Today, 9 PM', isCompleted: true },
    { id: '3', icon: '🗑️', name: 'Take Out Trash', assignedTo: 'Roommate', dueTime: 'Today, 8 PM', isCompleted: false },
  ];
  
  const weekChores = [
    { id: '4', icon: '🧼', name: 'Clean Bathroom', assignedTo: 'You', dueTime: 'Tomorrow, 11 AM', isCompleted: false },
    { id: '5', icon: '👕', name: 'Do Laundry', assignedTo: 'Roommate', dueTime: 'Wednesday, 5 PM', isCompleted: false },
    { id: '6', icon: '🧽', name: 'Clean Kitchen', assignedTo: 'Roommate', dueTime: 'Thursday, 7 PM', isCompleted: false },
    { id: '7', icon: '🧺', name: 'Fold Clothes', assignedTo: 'You', dueTime: 'Friday, 6 PM', isCompleted: false },
  ];
  
  // Placeholder leaderboard data
  const leaderboard = [
    { id: '1', name: 'Roommate', completedCount: 8, streak: 5 },
    { id: '2', name: 'You', completedCount: 6, streak: 3 },
    { id: '3', name: 'Roommate 2', completedCount: 4, streak: 2 },
    { id: '4', name: 'Roommate 3', completedCount: 3, streak: 1 },
  ];

  const handleToggleComplete = (id) => {
    Alert.alert(
      'Complete Chore',
      'This would mark the chore as completed in a real app',
      [{ text: 'OK' }]
    );
  };
  
  const handleAddChore = () => {
    Alert.alert(
      'Add Chore',
      'This would open a form to add a new chore with:',
      [
        { text: 'Select Icon' },
        { text: 'Enter Task Name' },
        { text: 'Assign To' },
        { text: 'Set Due Date/Time' },
        { text: 'Set Frequency' },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🧹</Text>
          <Text style={styles.title}>Chores</Text>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'today' && styles.activeTab
            ]}
            onPress={() => setActiveTab('today')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'today' && styles.activeTabText
            ]}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'week' && styles.activeTab
            ]}
            onPress={() => setActiveTab('week')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'week' && styles.activeTabText
            ]}>This Week</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'leaderboard' && styles.activeTab
            ]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'leaderboard' && styles.activeTabText
            ]}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
        
        {/* Today's Chores */}
        {activeTab === 'today' && (
          <View style={styles.choresList}>
            <Text style={styles.sectionTitle}>Today's Chores</Text>
            {todayChores.map(chore => (
              <ChoreItem
                key={chore.id}
                icon={chore.icon}
                name={chore.name}
                assignedTo={chore.assignedTo}
                dueTime={chore.dueTime}
                isCompleted={chore.isCompleted}
                onToggleComplete={() => handleToggleComplete(chore.id)}
              />
            ))}
          </View>
        )}
        
        {/* This Week's Chores */}
        {activeTab === 'week' && (
          <View style={styles.choresList}>
            <Text style={styles.sectionTitle}>This Week's Chores</Text>
            {weekChores.map(chore => (
              <ChoreItem
                key={chore.id}
                icon={chore.icon}
                name={chore.name}
                assignedTo={chore.assignedTo}
                dueTime={chore.dueTime}
                isCompleted={chore.isCompleted}
                onToggleComplete={() => handleToggleComplete(chore.id)}
              />
            ))}
          </View>
        )}
        
        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <View style={styles.leaderboardList}>
            <Text style={styles.sectionTitle}>Chores Leaderboard</Text>
            {leaderboard.map((leader, index) => (
              <LeaderboardItem
                key={leader.id}
                rank={index + 1}
                name={leader.name}
                completedCount={leader.completedCount}
                streak={leader.streak}
              />
            ))}
          </View>
        )}
        
        {/* Add Chore Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddChore}
        >
          <Text style={styles.addButtonText}>Add Chore</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  choresList: {
    marginBottom: 20,
  },
  choreItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  choreIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0E8FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  choreIcon: {
    fontSize: 20,
  },
  choreDetails: {
    flex: 1,
  },
  choreName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  choreSubDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choreAssigned: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  choreDue: {
    fontSize: 14,
    color: '#666',
  },
  emphasizedText: {
    fontWeight: '500',
    color: '#333',
  },
  completeButton: {
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  completedButton: {
    backgroundColor: '#E8F8E8',
  },
  completeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A80F0',
  },
  completedButtonText: {
    color: '#4CAF50',
  },
  leaderboardList: {
    marginBottom: 20,
  },
  leaderboardItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0E8FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A80F0',
  },
  leaderDetails: {
    flex: 1,
  },
  leaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  leaderStats: {
    fontSize: 14,
    color: '#666',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  streakLabel: {
    fontSize: 12,
    color: '#888',
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
