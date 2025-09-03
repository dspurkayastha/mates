export type BiometricCapabilities = Record<string, any>;
export type BiometricAuthOptions = Record<string, any>;
export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storage';

let enabled = false;
void AsyncStorage.getItem(STORAGE_KEYS.biometrics).then((v) => {
  enabled = v === 'true';
});

export const biometricAuthManager = {
  isBiometricAuthEnabled: () => enabled,
  enableBiometricAuth: async (): Promise<BiometricAuthResult> => {
    enabled = true;
    await AsyncStorage.setItem(STORAGE_KEYS.biometrics, 'true');
    return { success: true };
  },
  disableBiometricAuth: async () => {
    enabled = false;
    await AsyncStorage.setItem(STORAGE_KEYS.biometrics, 'false');
  },
  initialize: async (): Promise<BiometricCapabilities> => ({}),
  authenticate: async (_opts?: BiometricAuthOptions): Promise<BiometricAuthResult> => ({
    success: false,
  }),
  getBiometricTypeNames: () => [],
};

export const isBiometricAuthAvailable = async () => false;
export const authenticateWithBiometrics = async () => ({ success: false });

export default biometricAuthManager;
