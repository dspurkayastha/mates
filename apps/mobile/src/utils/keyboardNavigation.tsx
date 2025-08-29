/**
 * Keyboard Navigation & Focus Management
 * Web platform accessibility support for keyboard navigation
 * Provides focus indicators and keyboard interaction patterns
 */

import React, { useRef, useEffect, useState } from 'react';
import { Platform, View, ViewStyle } from 'react-native';
import { useColors, useTokens } from '../design-system/ThemeProvider';

// ============================================================================
// KEYBOARD NAVIGATION HOOK
// ============================================================================

interface KeyboardNavigationOptions {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions) => {
  const { enabled = true } = options;

  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          options.onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          options.onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          options.onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          options.onArrowRight?.();
          break;
        case 'Enter':
          event.preventDefault();
          options.onEnter?.();
          break;
        case ' ':
          event.preventDefault();
          options.onSpace?.();
          break;
        case 'Escape':
          event.preventDefault();
          options.onEscape?.();
          break;
        case 'Tab':
          options.onTab?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [options, enabled]);
};

// ============================================================================
// FOCUS MANAGEMENT HOOK
// ============================================================================

interface FocusManagerOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}

export const useFocusManager = (options: FocusManagerOptions = {}) => {
  const containerRef = useRef<View>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const container = containerRef.current as any;
    if (!container) return;

    // Store the previously focused element
    if (options.restoreFocus) {
      previousActiveElement.current = document.activeElement;
    }

    // Auto focus the container if specified
    if (options.autoFocus) {
      container.focus();
    }

    // Focus trap implementation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!options.trapFocus || event.key !== 'Tab') return;

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleFocusIn = () => setIsFocused(true);
    const handleFocusOut = (event: FocusEvent) => {
      if (!container.contains(event.relatedTarget as Node)) {
        setIsFocused(false);
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', handleFocusOut);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', handleFocusOut);

      // Restore focus to the previously focused element
      if (options.restoreFocus && previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    };
  }, [options]);

  return {
    containerRef,
    isFocused,
    setFocus: () => {
      if (Platform.OS === 'web' && containerRef.current) {
        (containerRef.current as any).focus();
      }
    },
  };
};

// ============================================================================
// FOCUS INDICATOR COMPONENT
// ============================================================================

interface FocusIndicatorProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  children,
  style,
  onFocus,
  onBlur,
}) => {
  const colors = useColors();
  const tokens = useTokens();

  return (
    <View
      style={[
        {
          borderRadius: tokens.BorderRadius.md,
        },
        style,
      ]}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </View>
  );
};

// ============================================================================
// KEYBOARD NAVIGATION MANAGER
// ============================================================================

class KeyboardNavigationManager {
  private focusableElements: Array<{ id: string; element: any }> = [];
  private currentIndex = -1;

  registerElement(id: string, element: any) {
    this.focusableElements.push({ id, element });
  }

  unregisterElement(id: string) {
    this.focusableElements = this.focusableElements.filter(item => item.id !== id);
  }

  focusNext() {
    if (this.focusableElements.length === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
    const element = this.focusableElements[this.currentIndex]?.element;
    if (element && element.focus) {
      element.focus();
    }
  }

  focusPrevious() {
    if (this.focusableElements.length === 0) return;
    
    this.currentIndex = this.currentIndex <= 0 
      ? this.focusableElements.length - 1 
      : this.currentIndex - 1;
    const element = this.focusableElements[this.currentIndex]?.element;
    if (element && element.focus) {
      element.focus();
    }
  }

  focusFirst() {
    if (this.focusableElements.length === 0) return;
    
    this.currentIndex = 0;
    const element = this.focusableElements[0]?.element;
    if (element && element.focus) {
      element.focus();
    }
  }

  focusLast() {
    if (this.focusableElements.length === 0) return;
    
    this.currentIndex = this.focusableElements.length - 1;
    const element = this.focusableElements[this.currentIndex]?.element;
    if (element && element.focus) {
      element.focus();
    }
  }
}

export const keyboardNavigationManager = new KeyboardNavigationManager();

export default {
  FocusIndicator,
  keyboardNavigationManager,
};
