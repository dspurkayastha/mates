import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/auth/useAuth';
import { useAuthModal } from '../../utils/auth/useAuthModal';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, signIn, signUp } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  const [groupCode, setGroupCode] = useState('');
  const [houseName, setHouseName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const handleJoinGroup = () => {
    if (!groupCode) {
      Alert.alert('Missing Information', 'Please enter a group code to join.');
      return;
    }
    Alert.alert('Join Group', `You're joining group with code: ${groupCode}`);
    // In a real app, this would make an API call to join the group
  };

  const handleCreateGroup = () => {
    setIsCreatingGroup(true);
    Alert.alert('Create Group', 'Creating a new house group...');
    // In a real app, this would make an API call to create the group
  };

  const handleInvite = () => {
    Alert.alert('Invite', 'This would open WhatsApp to invite roommates');
    // In a real app, this would open a share dialog or WhatsApp deep link
  };

  const handleContinue = () => {
    if (isCreatingGroup && !houseName) {
      Alert.alert('Missing Information', 'Please enter a house name.');
      return;
    }

    Alert.alert('Success', 'Moving to your dashboard...', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
    // In a real app, this would save preferences and navigate to the main app
  };

  const handleSignIn = () => {
    openAuthModal({ mode: 'signin' });
  };

  const handleSignUp = () => {
    openAuthModal({ mode: 'signup' });
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>🏠</Text>
          </View>

          <Text style={styles.title}>Mates</Text>
          <Text style={styles.subtitle}>Your Roommate Management App</Text>

          <View style={styles.card}>
            <Text style={styles.cardText}>Please sign in or create an account to continue</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUp}>
              <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>🏠</Text>
        </View>

        <Text style={styles.title}>Mates</Text>
        <Text style={styles.subtitle}>Join your house group</Text>

        <View style={styles.card}>
          {!isCreatingGroup ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter Group Code"
                value={groupCode}
                onChangeText={setGroupCode}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleJoinGroup}>
                <Text style={styles.primaryButtonText}>Join Group</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={handleCreateGroup}>
                <Text style={styles.secondaryButtonText}>Create New Group</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="House Name"
                value={houseName}
                onChangeText={setHouseName}
              />

              <TextInput
                style={styles.input}
                placeholder="Your Nickname"
                value={nickname}
                onChangeText={setNickname}
              />

              <TouchableOpacity style={styles.tertiaryButton} onPress={handleInvite}>
                <Text style={styles.tertiaryButtonText}>Invite via WhatsApp</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiContainer: {
    marginBottom: 20,
  },
  emoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A80F0',
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4A80F0',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#4A80F0',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 30,
    padding: 18,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
