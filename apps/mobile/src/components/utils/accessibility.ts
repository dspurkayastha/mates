/**
 * Accessibility Utilities
 * Helper functions for generating consistent accessibility labels and hints
 */

export const generateAccessibilityLabel = {
  /**
   * Generate accessibility labels for list items
   */
  list: {
    item: (content: string, index: number, total: number) => {
      return `${content}. Item ${index} of ${total}`;
    },
    
    section: (title: string, itemCount: number) => {
      return `${title} section with ${itemCount} items`;
    }
  },

  /**
   * Generate accessibility labels for buttons
   */
  button: {
    action: (action: string, context?: string) => {
      return context ? `${action} for ${context}` : action;
    },
    
    toggle: (isActive: boolean, label: string) => {
      return `${label}, ${isActive ? 'active' : 'inactive'}`;
    }
  },

  /**
   * Generate accessibility labels for form elements
   */
  form: {
    input: (label: string, value?: string, required?: boolean) => {
      const requiredText = required ? ', required' : '';
      const valueText = value ? `, current value: ${value}` : '';
      return `${label}${requiredText}${valueText}`;
    },
    
    validation: (fieldName: string, error?: string) => {
      return error ? `${fieldName} has error: ${error}` : `${fieldName} is valid`;
    }
  }
};

export const generateAccessibilityHint = {
  /**
   * Generate accessibility hints for interactive elements
   */
  interaction: {
    tap: (action: string) => `Double tap to ${action}`,
    swipe: (action: string, direction: string) => `Swipe ${direction} to ${action}`,
    longPress: (action: string) => `Long press to ${action}`
  },

  /**
   * Generate accessibility hints for navigation
   */
  navigation: {
    screen: (screenName: string) => `Navigate to ${screenName}`,
    back: () => 'Go back to previous screen',
    close: () => 'Close current screen'
  },

  /**
   * Generate accessibility hints for content
   */
  content: {
    expand: (isExpanded: boolean) => 
      isExpanded ? 'Double tap to collapse content' : 'Double tap to expand content',
    
    filter: (filterName: string, isActive: boolean) =>
      `Double tap to ${isActive ? 'remove' : 'apply'} ${filterName} filter`
  }
};

export const AccessibilityRoles = {
  BUTTON: 'button' as const,
  LINK: 'link' as const,
  TEXT: 'text' as const,
  HEADER: 'header' as const,
  SEARCH: 'search' as const,
  TAB: 'tab' as const,
  SWITCH: 'switch' as const,
  IMAGE: 'image' as const,
  LIST: 'list' as const,
  LISTITEM: 'listitem' as const,
} as const;

export type AccessibilityRole = typeof AccessibilityRoles[keyof typeof AccessibilityRoles];