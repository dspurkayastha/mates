export type BiometricCapabilities = Record<string, any>;
export type BiometricAuthOptions = Record<string, any>;
export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export const biometricAuthManager = {
  isBiometricAuthEnabled: () => false,
  enableBiometricAuth: async (): Promise<BiometricAuthResult> => ({ success: false }),
  disableBiometricAuth: async () => {},
  initialize: async (): Promise<BiometricCapabilities> => ({}),
  authenticate: async (_opts?: BiometricAuthOptions): Promise<BiometricAuthResult> => ({
    success: false,
  }),
  getBiometricTypeNames: () => [],
};

export const isBiometricAuthAvailable = async () => false;
export const authenticateWithBiometrics = async () => ({ success: false });

export default biometricAuthManager;
