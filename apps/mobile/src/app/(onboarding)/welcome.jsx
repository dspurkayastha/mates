import React, { useState } from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/auth/useAuth';
import { useAuthModal } from '../../utils/auth/useAuthModal';
import {
  Text,
  GlassCard,
  GlassButton,
  GlassInput,
  Icon,
  useColors,
  useTokens
} from '@/components/ui';
import * as Haptics from 'expo-haptics';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, signIn, signUp } = useAuth();
  const { open: openAuthModal } = useAuthModal();
  const colors = useColors();
  const tokens = useTokens();

  const [groupCode, setGroupCode] = useState('');
  const [houseName, setHouseName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const handleJoinGroup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!groupCode) {
      Alert.alert('Missing Information', 'Please enter a group code to join.');
      return;
    }
    Alert.alert('Join Group', `You're joining group with code: ${groupCode}`);
    // In a real app, this would make an API call to join the group
  };

  const handleCreateGroup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsCreatingGroup(true);
    Alert.alert('Create Group', 'Creating a new house group...');
    // In a real app, this would make an API call to create the group
  };

  const handleInvite = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Invite', 'This would open WhatsApp to invite roommates');
    // In a real app, this would open a share dialog or WhatsApp deep link
  };

  const handleContinue = () => {
    if (isCreatingGroup && !houseName) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Missing Information', 'Please enter a house name.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Moving to your dashboard...', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
    // In a real app, this would save preferences and navigate to the main app
  };

  const handleSignIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openAuthModal({ mode: 'signin' });
  };

  const handleSignUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openAuthModal({ mode: 'signup' });
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <ScrollView contentContainerStyle={{
          flexGrow: 1,
          padding: tokens.Spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{ marginBottom: tokens.Spacing['2xl'] }}>
            <Icon name="House" size="6xl" color="brand" />
          </View>

          <Text variant="headlineLarge" weight="bold" style={{ marginBottom: tokens.Spacing.sm }} align="center">
            Mates
          </Text>
          <Text variant="titleMedium" color="secondary" style={{ marginBottom: tokens.Spacing['3xl'] }} align="center">
            Your Roommate Management App
          </Text>

          <GlassCard
            variant="translucent"
            size="large"
            style={{
              width: '100%',
              marginBottom: tokens.Spacing['2xl']
            }}
          >
            <View style={{ padding: tokens.Spacing.xl }}>
              <Text variant="bodyLarge" color="secondary" style={{ marginBottom: tokens.Spacing.xl }} align="center">
                Please sign in or create an account to continue
              </Text>

              <GlassButton
                variant="primary"
                buttonStyle="tinted"
                size="large"
                fullWidth
                onPress={handleSignIn}
                style={{ marginBottom: tokens.Spacing.md }}
              >
                Sign In
              </GlassButton>

              <GlassButton
                variant="secondary"
                buttonStyle="outlined"
                size="large"
                fullWidth
                onPress={handleSignUp}
              >
                Sign Up
              </GlassButton>
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        padding: tokens.Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{ marginBottom: tokens.Spacing['2xl'] }}>
          <Icon name="House" size="6xl" color="brand" />
        </View>

        <Text variant="headlineLarge" weight="bold" style={{ marginBottom: tokens.Spacing.sm }} align="center">
          Mates
        </Text>
        <Text variant="titleMedium" color="secondary" style={{ marginBottom: tokens.Spacing['3xl'] }} align="center">
          Join your house group
        </Text>

        <GlassCard
          variant="translucent"
          size="large"
          style={{
            width: '100%',
            marginBottom: tokens.Spacing['2xl']
          }}
        >
          <View style={{ padding: tokens.Spacing.xl }}>
            {!isCreatingGroup ? (
              <>
                <GlassInput
                  placeholder="Enter Group Code"
                  value={groupCode}
                  onChangeText={setGroupCode}
                  variant="default"
                  size="large"
                  style={{ marginBottom: tokens.Spacing.lg }}
                  leftIcon={<Icon name="Hash" size="sm" color="secondary" />}
                />

                <GlassButton
                  variant="primary"
                  buttonStyle="tinted"
                  size="large"
                  fullWidth
                  onPress={handleJoinGroup}
                  style={{ marginBottom: tokens.Spacing.md }}
                >
                  Join Group
                </GlassButton>

                <GlassButton
                  variant="secondary"
                  buttonStyle="outlined"
                  size="large"
                  fullWidth
                  onPress={handleCreateGroup}
                >
                  Create New Group
                </GlassButton>
              </>
            ) : (
              <>
                <GlassInput
                  placeholder="House Name"
                  value={houseName}
                  onChangeText={setHouseName}
                  variant="default"
                  size="large"
                  style={{ marginBottom: tokens.Spacing.lg }}
                  leftIcon={<Icon name="House" size="sm" color="secondary" />}
                />

                <GlassInput
                  placeholder="Your Nickname"
                  value={nickname}
                  onChangeText={setNickname}
                  variant="default"
                  size="large"
                  style={{ marginBottom: tokens.Spacing.lg }}
                  leftIcon={<Icon name="User" size="sm" color="secondary" />}
                />

                <GlassButton
                  variant="success"
                  buttonStyle="tinted"
                  size="large"
                  fullWidth
                  onPress={handleInvite}
                  leftIcon={<Icon name="MessageCircle" size="sm" color="inverse" />}
                >
                  Invite via WhatsApp
                </GlassButton>
              </>
            )}
          </View>
        </GlassCard>

        <GlassButton
          variant="primary"
          buttonStyle="filled"
          size="large"
          fullWidth
          onPress={handleContinue}
          style={{
            borderRadius: tokens.BorderRadius.full,
            paddingVertical: tokens.Spacing.lg,
            marginTop: tokens.Spacing.sm
          }}
        >
          Continue
        </GlassButton>
      </ScrollView>
    </SafeAreaView>
  );
}
