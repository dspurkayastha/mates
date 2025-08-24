import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Linking } from 'expo';
import { supabase } from '@/lib/supabase';
import { useAuthStore, useAuthModal } from './store';

/**
 * This component renders a modal for authentication purposes.
 * To show it programmatically, you should either use the `useRequireAuth` hook or the `useAuthModal` hook.
 *
 * @example
 * ```js
 * import { useAuthModal } from '@/utils/useAuthModal';
 * function MyComponent() {
 * const { open } = useAuthModal();
 * return <Button title="Login" onPress={() => open({ mode: 'signin' })} />;
 * }
 * ```
 *
 * @example
 * ```js
 * import { useRequireAuth } from '@/utils/useAuth';
 * function MyComponent() {
 *   // automatically opens the auth modal if the user is not authenticated
 *   useRequireAuth();
 *   return <Text>Protected Content</Text>;
 * }
 *
 */
export const AuthModal = () => {
  const { isOpen, mode, close } = useAuthModal();
  const { auth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMagicLink = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: Linking.createURL('/'),
        },
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Check your email',
        'We sent you a magic link to sign in. Please check your email inbox.',
        [{ text: 'OK', onPress: close }],
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'signin' ? 'signup' : 'signin';
    useAuthModal.setState({ mode: newMode });
  };

  const headerText = mode === 'signin' ? 'Sign in to Mates' : 'Sign up for Mates';
  const buttonText = mode === 'signin' ? 'Send Magic Link' : 'Create Account';
  const toggleText =
    mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in';

  return (
    <Modal visible={isOpen && !auth} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{headerText}</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCompleteType="email"
            textContentType="emailAddress"
          />

          <TouchableOpacity style={styles.button} onPress={handleSendMagicLink} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{buttonText}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleContainer} onPress={toggleMode}>
            <Text style={styles.toggleText}>{toggleText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#4A80F0',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#4A80F0',
    fontSize: 14,
  },
});

// re-export hook so consumers can `import { useAuthModal } from '@/utils/auth/useAuthModal'`
export { useAuthModal } from './store';

export default useAuthModal;
