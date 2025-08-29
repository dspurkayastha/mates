/**
 * Accessibility Utilities
 * Comprehensive accessibility helpers for 2025 standards
 * Supports screen readers, voice control, and inclusive design
 */

import { AccessibilityInfo, Platform } from 'react-native';

// ============================================================================
// ACCESSIBILITY STATE MANAGEMENT
// ============================================================================

export interface AccessibilityState {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isHighContrastEnabled: boolean;
  preferredContentSizeCategory: string;
}

class AccessibilityManager {
  private state: AccessibilityState = {
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isHighContrastEnabled: false,
    preferredContentSizeCategory: 'medium',
  };

  private listeners: Array<(state: AccessibilityState) => void> = [];

  async initialize() {
    try {
      // Check screen reader status
      this.state.isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      
      // Check reduce motion (iOS only for now)
      if (Platform.OS === 'ios') {
        this.state.isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      }

      // Listen for changes
      AccessibilityInfo.addEventListener('screenReaderChanged', this.handleScreenReaderChange);
      if (Platform.OS === 'ios') {
        AccessibilityInfo.addEventListener('reduceMotionChanged', this.handleReduceMotionChange);
      }

      this.notifyListeners();
    } catch (error) {
      console.warn('Failed to initialize accessibility state:', error);
    }
  }

  private handleScreenReaderChange = (isEnabled: boolean) => {
    this.state.isScreenReaderEnabled = isEnabled;
    this.notifyListeners();
  };

  private handleReduceMotionChange = (isEnabled: boolean) => {
    this.state.isReduceMotionEnabled = isEnabled;
    this.notifyListeners();
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AccessibilityState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AccessibilityState {
    return { ...this.state };
  }

  // Announce message to screen reader
  announceForAccessibility(message: string) {
    if (this.state.isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }

  // Set accessibility focus
  setAccessibilityFocus(reactTag: number) {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  }
}

export const accessibilityManager = new AccessibilityManager();

// ============================================================================
// ACCESSIBILITY HELPERS
// ============================================================================

/**
 * Generate semantic accessibility label for common UI patterns
 */
export const generateAccessibilityLabel = {
  button: (text: string, state?: { loading?: boolean; disabled?: boolean }) => {
    let label = text;
    if (state?.loading) label += ', Loading';
    if (state?.disabled) label += ', Disabled';
    return label;
  },

  status: (status: string, description?: string) => {
    return `Status: ${status}${description ? `, ${description}` : ''}`;
  },

  navigation: (destination: string, current?: boolean) => {
    return `${destination}${current ? ', Current tab' : ', Tab'}`;
  },

  form: {
    field: (label: string, value?: string, required?: boolean, error?: string) => {
      let accessibilityLabel = label;
      if (required) accessibilityLabel += ', Required';
      if (value) accessibilityLabel += `, Current value: ${value}`;
      if (error) accessibilityLabel += `, Error: ${error}`;
      return accessibilityLabel;
    },

    validation: (fieldName: string, errors: string[]) => {
      if (errors.length === 0) return `${fieldName} is valid`;
      if (errors.length === 1) return `${fieldName} error: ${errors[0]}`;
      return `${fieldName} has ${errors.length} errors: ${errors.join(', ')}`;
    }
  },

  list: {
    item: (text: string, position: number, total: number, selected?: boolean) => {
      let label = `${text}, ${position} of ${total}`;
      if (selected) label += ', Selected';
      return label;
    },

    empty: (context: string) => `${context} list is empty`,
    
    loading: (context: string) => `Loading ${context} list`,
  },

  amount: (amount: number, currency = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    });
    return formatter.format(amount);
  },

  date: (date: Date, format: 'short' | 'long' = 'short') => {
    const options: Intl.DateTimeFormatOptions = format === 'long' 
      ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  },
};

/**
 * Generate semantic accessibility hints for common UI patterns
 */
export const generateAccessibilityHint = {
  button: {
    primary: 'Double tap to perform the main action',
    secondary: 'Double tap to perform a secondary action',
    danger: 'Double tap to perform a destructive action. This action cannot be undone',
    navigation: (destination: string) => `Double tap to navigate to ${destination}`,
    toggle: (state: boolean) => `Double tap to ${state ? 'disable' : 'enable'}`,
  },

  form: {
    textInput: 'Double tap to edit text',
    dropdown: 'Double tap to open selection menu',
    checkbox: (checked: boolean) => `Double tap to ${checked ? 'uncheck' : 'check'}`,
    radio: 'Double tap to select this option',
    submit: 'Double tap to submit the form',
  },

  list: {
    swipeActions: 'Swipe left or right for more actions',
    pullRefresh: 'Pull down to refresh content',
    infiniteScroll: 'Scroll to load more items',
  },

  navigation: {
    back: 'Double tap to go back to the previous screen',
    close: 'Double tap to close this dialog',
    menu: 'Double tap to open navigation menu',
  },
};

/**
 * Accessibility role helpers
 */
export const accessibilityRoles = {
  // Navigation
  tabButton: 'tab' as const,
  navigationButton: 'button' as const,
  
  // Content
  heading: 'header' as const,
  text: 'text' as const,
  summary: 'summary' as const,
  
  // Interactive
  button: 'button' as const,
  link: 'link' as const,
  checkbox: 'checkbox' as const,
  radio: 'radio' as const,
  textInput: 'none' as const, // TextInput has built-in accessibility
  
  // Lists
  list: 'list' as const,
  listItem: 'none' as const, // React Native doesn't support listitem
  
  // Status
  alert: 'alert' as const,
  status: 'text' as const,
  
  // Layout
  container: 'none' as const,
  image: 'image' as const,
} as const;

/**
 * Animation helpers that respect reduce motion preferences
 */
export const createAccessibleAnimation = {
  spring: (config: any) => ({
    ...config,
    duration: accessibilityManager.getState().isReduceMotionEnabled ? 0 : config.duration,
  }),

  timing: (config: any) => ({
    ...config,
    duration: accessibilityManager.getState().isReduceMotionEnabled ? 0 : config.duration,
  }),

  shouldAnimate: () => !accessibilityManager.getState().isReduceMotionEnabled,
};

/**
 * Focus management utilities
 */
export const focusManager = {
  announcePageChange: (pageName: string) => {
    accessibilityManager.announceForAccessibility(`Navigated to ${pageName}`);
  },

  announceAction: (action: string) => {
    accessibilityManager.announceForAccessibility(action);
  },

  announceError: (error: string) => {
    accessibilityManager.announceForAccessibility(`Error: ${error}`);
  },

  announceSuccess: (message: string) => {
    accessibilityManager.announceForAccessibility(`Success: ${message}`);
  },
};

/**
 * Touch target helpers for accessibility
 */
export const touchTargets = {
  minimum: 44, // Minimum touch target size per accessibility guidelines
  recommended: 48, // Recommended touch target size
  
  ensureMinimumSize: (size: number) => Math.max(size, touchTargets.minimum),
  
  addPadding: (currentSize: number) => {
    const needed = touchTargets.minimum - currentSize;
    return needed > 0 ? needed / 2 : 0;
  },
};

// Initialize accessibility manager
accessibilityManager.initialize();

export default {
  accessibilityManager,
  generateAccessibilityLabel,
  generateAccessibilityHint,
  accessibilityRoles,
  createAccessibleAnimation,
  focusManager,
  touchTargets,
};