/**
 * Biometric Authentication Utility
 * Comprehensive biometric authentication system with security and accessibility
 * Supports Face ID, Touch ID, Fingerprint, and fallback mechanisms
 */

import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// ============================================================================
// TYPES
// ============================================================================

export interface BiometricCapabilities {
  isAvailable: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
  securityLevel: LocalAuthentication.SecurityLevel;
  hasHardware: boolean;
}

export interface BiometricAuthOptions {
  promptMessage?: string;
  cancelLabel?: string;
  fallbackLabel?: string;
  disableDeviceFallback?: boolean;
  requireConfirmation?: boolean;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  warning?: string;
  biometricType?: LocalAuthentication.AuthenticationType;
}

export interface BiometricSettings {
  enabled: boolean;
  enrollmentDate: string;
  lastUsed?: string;
  failureCount: number;
  maxFailures: number;
  lockoutUntil?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
  BIOMETRIC_SETTINGS: '@mates_biometric_settings',
  BIOMETRIC_TOKEN: '@mates_biometric_token',
  ENROLLMENT_DATA: '@mates_biometric_enrollment',
} as const;

const DEFAULT_SETTINGS: BiometricSettings = {
  enabled: false,
  enrollmentDate: '',
  failureCount: 0,
  maxFailures: 5,
};

const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// ============================================================================
// BIOMETRIC AUTHENTICATION CLASS
// ============================================================================

class BiometricAuthManager {
  private static instance: BiometricAuthManager;
  private capabilities: BiometricCapabilities | null = null;
  private settings: BiometricSettings = DEFAULT_SETTINGS;

  private constructor() {
    this.loadSettings();
  }

  static getInstance(): BiometricAuthManager {
    if (!BiometricAuthManager.instance) {
      BiometricAuthManager.instance = new BiometricAuthManager();
    }
    return BiometricAuthManager.instance;
  }

  // ========================================================================
  // INITIALIZATION & CAPABILITIES
  // ========================================================================

  /**
   * Initialize biometric authentication and check device capabilities
   */
  async initialize(): Promise<BiometricCapabilities> {
    try {
      const [hasHardware, isEnrolled, supportedTypes, securityLevel] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
        LocalAuthentication.getEnrolledLevelAsync(),
      ]);

      this.capabilities = {
        isAvailable: hasHardware && isEnrolled,
        isEnrolled,
        supportedTypes,
        securityLevel,
        hasHardware,
      };

      return this.capabilities;
    } catch (error) {
      console.error('Failed to initialize biometric authentication:', error);
      this.capabilities = {
        isAvailable: false,
        isEnrolled: false,
        supportedTypes: [],
        securityLevel: LocalAuthentication.SecurityLevel.NONE,
        hasHardware: false,
      };
      return this.capabilities;
    }
  }

  /**
   * Get current device biometric capabilities
   */
  getCapabilities(): BiometricCapabilities | null {
    return this.capabilities;
  }

  /**
   * Get human-readable biometric type names
   */
  getBiometricTypeNames(): string[] {
    if (!this.capabilities) return [];

    return this.capabilities.supportedTypes.map(type => {
      switch (type) {
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
        case LocalAuthentication.AuthenticationType.IRIS:
          return 'Iris Recognition';
        default:
          return 'Biometric Authentication';
      }
    });
  }

  // ========================================================================
  // AUTHENTICATION
  // ========================================================================

  /**
   * Authenticate user with biometrics
   */
  async authenticate(options: BiometricAuthOptions = {}): Promise<BiometricAuthResult> {
    if (!this.capabilities?.isAvailable) {
      return {
        success: false,
        error: 'Biometric authentication is not available on this device',
      };
    }

    if (!this.settings.enabled) {
      return {
        success: false,
        error: 'Biometric authentication is disabled',
      };
    }

    // Check for lockout
    if (this.isLockedOut()) {
      const lockoutTime = this.getLockoutTimeRemaining();
      return {
        success: false,
        error: `Too many failed attempts. Try again in ${Math.ceil(lockoutTime / 60000)} minutes.`,
      };
    }

    try {
      const biometricTypes = this.getBiometricTypeNames();
      const primaryType = biometricTypes[0] || 'Biometric Authentication';

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: options.promptMessage || `Use ${primaryType} to authenticate`,
        cancelLabel: options.cancelLabel || 'Cancel',
        fallbackLabel: options.fallbackLabel || 'Use Passcode',
        disableDeviceFallback: options.disableDeviceFallback || false,
        requireConfirmation: options.requireConfirmation || false,
      });

      if (result.success) {
        // Reset failure count on success
        await this.resetFailureCount();
        await this.updateLastUsed();
        
        // Provide haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        return {
          success: true,
          biometricType: this.capabilities.supportedTypes[0],
        };
      } else {
        // Handle authentication failure
        if (result.error === 'user_cancel' || result.error === 'system_cancel') {
          return {
            success: false,
            error: 'Authentication was cancelled',
          };
        }

        if (result.error === 'user_fallback') {
          return {
            success: false,
            error: 'User chose to use device passcode',
            warning: 'Consider using biometric authentication for better security',
          };
        }

        // Increment failure count
        await this.incrementFailureCount();
        
        // Provide haptic feedback for failure
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        return {
          success: false,
          error: this.getErrorMessage(result.error),
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      return {
        success: false,
        error: 'An unexpected error occurred during authentication',
      };
    }
  }

  // ========================================================================
  // ENROLLMENT & SETTINGS
  // ========================================================================

  /**
   * Enable biometric authentication
   */
  async enableBiometricAuth(): Promise<BiometricAuthResult> {
    if (!this.capabilities?.isAvailable) {
      return {
        success: false,
        error: 'Biometric authentication is not available',
      };
    }

    // Test authentication first
    const authResult = await this.authenticate({
      promptMessage: 'Authenticate to enable biometric login',
      disableDeviceFallback: true,
    });

    if (authResult.success) {
      this.settings = {
        ...this.settings,
        enabled: true,
        enrollmentDate: new Date().toISOString(),
        failureCount: 0,
        lastUsed: new Date().toISOString(),
      };

      await this.saveSettings();
      await this.generateAndStoreToken();

      return { success: true };
    }

    return authResult;
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometricAuth(): Promise<void> {
    this.settings = {
      ...this.settings,
      enabled: false,
    };

    await this.saveSettings();
    await this.clearSecureData();
  }

  /**
   * Check if biometric authentication is enabled
   */
  isBiometricAuthEnabled(): boolean {
    return this.settings.enabled && this.capabilities?.isAvailable === true;
  }

  // ========================================================================
  // SECURITY & LOCKOUT
  // ========================================================================

  /**
   * Check if user is locked out due to too many failures
   */
  private isLockedOut(): boolean {
    if (!this.settings.lockoutUntil) return false;
    return new Date() < new Date(this.settings.lockoutUntil);
  }

  /**
   * Get remaining lockout time in milliseconds
   */
  private getLockoutTimeRemaining(): number {
    if (!this.settings.lockoutUntil) return 0;
    const remaining = new Date(this.settings.lockoutUntil).getTime() - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Increment failure count and handle lockout
   */
  private async incrementFailureCount(): Promise<void> {
    this.settings.failureCount += 1;

    if (this.settings.failureCount >= this.settings.maxFailures) {
      this.settings.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION).toISOString();
    }

    await this.saveSettings();
  }

  /**
   * Reset failure count
   */
  private async resetFailureCount(): Promise<void> {
    this.settings.failureCount = 0;
    this.settings.lockoutUntil = undefined;
    await this.saveSettings();
  }

  /**
   * Update last used timestamp
   */
  private async updateLastUsed(): Promise<void> {
    this.settings.lastUsed = new Date().toISOString();
    await this.saveSettings();
  }

  // ========================================================================
  // DATA MANAGEMENT
  // ========================================================================

  /**
   * Load settings from storage
   */
  private async loadSettings(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_SETTINGS);
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load biometric settings:', error);
      this.settings = DEFAULT_SETTINGS;
    }
  }

  /**
   * Save settings to storage
   */
  private async saveSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.BIOMETRIC_SETTINGS,
        JSON.stringify(this.settings)
      );
    } catch (error) {
      console.error('Failed to save biometric settings:', error);
    }
  }

  /**
   * Generate and store secure authentication token
   */
  private async generateAndStoreToken(): Promise<void> {
    try {
      const token = this.generateSecureToken();
      await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_TOKEN, token);
    } catch (error) {
      console.error('Failed to store biometric token:', error);
    }
  }

  /**
   * Clear all secure data
   */
  private async clearSecureData(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.ENROLLMENT_DATA),
      ]);
    } catch (error) {
      console.error('Failed to clear secure data:', error);
    }
  }

  /**
   * Generate a secure random token
   */
  private generateSecureToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // ========================================================================
  // ERROR HANDLING
  // ========================================================================

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: string): string {
    switch (error) {
      case 'authentication_failed':
        return 'Authentication failed. Please try again.';
      case 'user_cancel':
        return 'Authentication was cancelled.';
      case 'user_fallback':
        return 'Please use your device passcode.';
      case 'system_cancel':
        return 'Authentication was interrupted by the system.';
      case 'passcode_not_set':
        return 'Please set up a device passcode first.';
      case 'biometry_not_available':
        return 'Biometric authentication is not available.';
      case 'biometry_not_enrolled':
        return 'No biometric data is enrolled on this device.';
      case 'biometry_lockout':
        return 'Biometric authentication is temporarily locked. Please try again later.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }

  // ========================================================================
  // PUBLIC GETTERS
  // ========================================================================

  /**
   * Get current settings
   */
  getSettings(): BiometricSettings {
    return { ...this.settings };
  }

  /**
   * Get failure count
   */
  getFailureCount(): number {
    return this.settings.failureCount;
  }

  /**
   * Get lockout status
   */
  getLockoutStatus(): { isLockedOut: boolean; timeRemaining: number } {
    return {
      isLockedOut: this.isLockedOut(),
      timeRemaining: this.getLockoutTimeRemaining(),
    };
  }
}

// ============================================================================
// EXPORTED INSTANCE & UTILITIES
// ============================================================================

export const biometricAuthManager = BiometricAuthManager.getInstance();

/**
 * Quick authentication function for common use cases
 */
export const authenticateWithBiometrics = async (
  options: BiometricAuthOptions = {}
): Promise<BiometricAuthResult> => {
  return biometricAuthManager.authenticate(options);
};

/**
 * Check if biometric authentication is available and enabled
 */
export const isBiometricAuthAvailable = async (): Promise<boolean> => {
  const capabilities = await biometricAuthManager.initialize();
  return capabilities.isAvailable && biometricAuthManager.isBiometricAuthEnabled();
};

/**
 * Setup biometric authentication
 */
export const setupBiometricAuth = async (): Promise<BiometricAuthResult> => {
  await biometricAuthManager.initialize();
  return biometricAuthManager.enableBiometricAuth();
};

export default biometricAuthManager;