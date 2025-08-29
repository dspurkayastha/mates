import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { 
  Text, 
  GlassCard, 
  GlassButton, 
  Icon,
  StatusIndicator,
  useColors,
  useTokens 
} from '@/components/ui';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import FloatingActionMenu from '@/components/FloatingActionMenu';

// Premium Navigation Card Component - TEMPORARILY DISABLED FOR DEBUGGING
// const NavigationCard = ({ 
//   title, 
//   subtitle, 
//   icon, 
//   iconColor = "brand", 
//   onPress,
//   hasNotification = false,
//   notificationCount = 0
// }) => {
//   const colors = useColors();
//   const tokens = useTokens();
//   
//   return (
//     <GlassCard
//       variant="translucent"
//       size="medium"
//       interactive
//       onPress={onPress}
//       style={{ 
//         flex: 1,
//         marginHorizontal: tokens.Spacing.xs,
//         marginBottom: tokens.Spacing.md
//       }}
//     >
//       <View style={{
//         padding: tokens.Spacing.lg,
//         alignItems: 'center',
//         minHeight: 100,
//         justifyContent: 'center'
//       }}>
//         <View style={{ position: 'relative', marginBottom: tokens.Spacing.sm }}>
//           <Icon name={icon} size="xl" color={iconColor} />
//           {hasNotification && (
//             <View style={{
//               position: 'absolute',
//               top: -4,
//               right: -4,
//               backgroundColor: colors.semantic.error,
//               borderRadius: 10,
//               minWidth: 20,
//               height: 20,
//               justifyContent: 'center',
//               alignItems: 'center',
//               borderWidth: 2,
//               borderColor: colors.background.primary
//             }}>
//               <Text variant="labelSmall" color="inverse" weight="bold">
//                 {notificationCount > 9 ? '9+' : notificationCount}
//               </Text>
//             </View>
//           )}
//         </View>
//         <Text variant="titleSmall" weight="semibold" align="center" style={{ marginBottom: tokens.Spacing.xs }}>
//           {title}
//         </Text>
//         <Text variant="bodySmall" color="secondary" align="center">
//           {subtitle}
//         </Text>
//       </View>
//     </GlassCard>
//   );
// };

// Temporary simple replacement component for debugging
const NavigationCard = ({ title, subtitle, icon, onPress }) => {
  return (
    <View style={{ 
      flex: 1, 
      height: 100, 
      backgroundColor: '#f0f0f0', 
      margin: 8, 
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
      <Text style={{ fontSize: 12, color: '#666' }}>{subtitle}</Text>
    </View>
  );
};

const StatusCard = ({ title, children, color, icon, onPress, interactive = false }) => {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <GlassCard 
      variant="translucent" 
      size="medium" 
      interactive={interactive}
      onPress={interactive ? onPress : undefined}
      style={{ 
        marginBottom: tokens.Spacing.lg 
      }}
    >
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: tokens.Spacing.md,
        padding: tokens.Spacing.lg,
        paddingBottom: 0
      }}>
        <Text variant="titleMedium" weight="semibold">{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {icon && <Icon name={icon} size="lg" color="brand" />}
          {interactive && <Icon name="ChevronRight" size="sm" color="tertiary" style={{ marginLeft: tokens.Spacing.xs }} />}
        </View>
      </View>
      <View style={{ paddingHorizontal: tokens.Spacing.lg, paddingBottom: tokens.Spacing.lg }}>
        {children}
      </View>
    </GlassCard>
  );
};

export default function HomeScreen() {
  const [houseName] = useState('Our House'); // This would come from API/store in a real app
  const colors = useColors();
  const tokens = useTokens();
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 380;

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('FAB pressed - showing action sheet');
  };

  // Navigation handlers with haptic feedback
  const handleExpensesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/expenses');
  };

  const handleGroceriesPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/groceries');
  };

  const handleChoresPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/chores');
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/settings');
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/profile');
  };

  const handleViewAllExpenses = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/expenses');
  };

  const handleViewAllGroceries = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/groceries');
  };

  const handleViewAllChores = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/chores');
  };

  // Quick action handlers
  const handleAddExpense = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Add Expense', 'This would open the add expense form');
  };

  const handleAddGrocery = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Add Grocery Item', 'This would open the add grocery item form');
  };

  const handleAddChore = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Add Chore', 'This would open the add chore form');
  };

  const handleCreatePoll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Create Poll', 'This would open the create poll form');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Header */}
        <View style={{
          marginBottom: tokens.Spacing.xl,
          paddingTop: tokens.Spacing.sm
        }}>
          <Text variant="headlineLarge" weight="bold" style={{ marginBottom: tokens.Spacing.xs }}>
            Welcome back!
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="House" size="md" color="brand" style={{ marginRight: tokens.Spacing.sm }} />
            <Text variant="titleMedium" color="secondary">
              {houseName}
            </Text>
          </View>
        </View>

        {/* Quick Navigation Grid */}
        <View style={{ marginBottom: tokens.Spacing.xl }}>
          <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
            Quick Access
          </Text>
          
          {/* First Row */}
          <View style={{ flexDirection: 'row', marginBottom: tokens.Spacing.md }}>
            <NavigationCard
              title="Expenses"
              subtitle="Track & split costs"
              icon="DollarSign"
              onPress={handleExpensesPress}
              hasNotification={true}
              notificationCount={2}
            />
            <NavigationCard
              title="Groceries"
              subtitle="Shopping lists"
              icon="ShoppingCart"
              onPress={handleGroceriesPress}
              hasNotification={true}
              notificationCount={5}
            />
          </View>
          
          {/* Second Row */}
          <View style={{ flexDirection: 'row', marginBottom: tokens.Spacing.md }}>
            <NavigationCard
              title="Chores"
              subtitle="Household tasks"
              icon="SquareCheck"
              onPress={handleChoresPress}
              hasNotification={true}
              notificationCount={3}
            />
            <NavigationCard
              title="Profile"
              subtitle="Your account"
              icon="User"
              onPress={handleProfilePress}
            />
          </View>
          
          {/* Third Row */}
          <View style={{ flexDirection: 'row' }}>
            <NavigationCard
              title="Settings"
              subtitle="App preferences"
              icon="Settings"
              onPress={handleSettingsPress}
            />
            <NavigationCard
              title="Coming Soon"
              subtitle="More features"
              icon="Plus"
              iconColor="secondary"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                console.log('Coming soon features');
              }}
            />
          </View>
        </View>

        {/* Recent Activity Summary */}
        <View style={{ marginBottom: tokens.Spacing.xl }}>
          <Text variant="titleLarge" weight="semibold" style={{ marginBottom: tokens.Spacing.md }}>
            Recent Activity
          </Text>
        </View>

        {/* Active Poll Banner (if exists) */}
        <GlassCard 
          variant="filled" 
          interactive 
          style={{ 
            backgroundColor: colors.interactive.primary,
            marginBottom: tokens.Spacing.lg 
          }}
        >
          <Text variant="titleSmall" color="inverse" align="center">
            Poll: Dinner tonight? — Vote Now!
          </Text>
        </GlassCard>

        {/* Status Cards */}
        <StatusCard 
          title="Next Rent Due" 
          icon="DollarSign" 
          interactive 
          onPress={handleViewAllExpenses}
        >
          <View style={styles.cardContent}>
            <Text variant="headlineSmall" color="primary" style={{ marginBottom: tokens.Spacing.xs }}>
              ₹15,000
            </Text>
            <Text variant="bodyMedium" color="secondary" style={{ marginBottom: tokens.Spacing.sm }}>
              Due in 5 days
            </Text>
            <StatusIndicator 
              variant="warning" 
              label="2/4 PAID" 
              size="small"
            />
          </View>
        </StatusCard>

        <StatusCard 
          title="Groceries" 
          icon="ShoppingCart" 
          interactive 
          onPress={handleViewAllGroceries}
        >
          <View style={styles.cardContent}>
            <Text variant="bodyMedium" color="secondary" style={{ marginBottom: tokens.Spacing.sm }}>
              Current status:
            </Text>
            <View style={styles.bulletList}>
              <Text variant="bodyMedium" color="primary" style={{ marginBottom: tokens.Spacing.xs }}>
                • 2 items out
              </Text>
              <Text variant="bodyMedium" color="primary">
                • 3 items running low
              </Text>
            </View>
          </View>
        </StatusCard>

        <StatusCard 
          title="Today's Chores" 
          icon="SquareCheck" 
          interactive 
          onPress={handleViewAllChores}
        >
          <View style={styles.cardContent}>
            <Text variant="bodyMedium" color="secondary" style={{ marginBottom: tokens.Spacing.sm }}>
              Your tasks:
            </Text>
            <View style={styles.bulletList}>
              <Text variant="bodyMedium" color="primary" style={{ marginBottom: tokens.Spacing.xs }}>
                • Dishes (You)
              </Text>
              <Text variant="bodyMedium" color="primary">
                • Take out trash (Roommate)
              </Text>
            </View>
          </View>
        </StatusCard>

        <StatusCard title="Who Owes What" icon="DollarSign" interactive onPress={handleViewAllExpenses}>
          <View style={styles.cardContent}>
            <Text variant="bodyMedium" color="secondary" style={{ marginBottom: tokens.Spacing.sm }}>
              This month:
            </Text>
            <View style={styles.bulletList}>
              <Text variant="bodyMedium" color="primary" style={{ marginBottom: tokens.Spacing.xs }}>
                • You owe: ₹400
              </Text>
              <Text variant="bodyMedium" color="primary">
                • You are owed: ₹0
              </Text>
            </View>
          </View>
        </StatusCard>

        <StatusCard title="House Rules" icon="House">
          <View style={styles.cardContent}>
            <Text variant="bodyMedium" color="secondary" style={{ marginBottom: tokens.Spacing.sm }}>
              Pinned rules:
            </Text>
            <View style={styles.bulletList}>
              <Text variant="bodyMedium" color="primary" style={{ marginBottom: tokens.Spacing.xs }}>
                • Quiet hours after 11pm
              </Text>
              <Text variant="bodyMedium" color="primary" style={{ marginBottom: tokens.Spacing.xs }}>
                • Clean kitchen after use
              </Text>
              <Text variant="bodyMedium" color="primary">
                • Guests need 24h notice
              </Text>
            </View>
          </View>
        </StatusCard>

        {/* Spacer for FAB */}
        <View style={{ height: tokens.Spacing['4xl'] }} />
      </ScrollView>

      {/* Premium Floating Action Menu */}
      <FloatingActionMenu
        onAddExpense={handleAddExpense}
        onAddGrocery={handleAddGrocery}
        onAddChore={handleAddChore}
        onCreatePoll={handleCreatePoll}
      />

      {/* Modern Action Sheet - TODO: Implement when needed */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cardContent: {
    paddingTop: 4,
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  bulletList: {
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
  },
});
