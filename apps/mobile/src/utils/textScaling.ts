/**
 * Text Scaling & Typography Accessibility
 * Dynamic font sizing for accessibility compliance
 * Supports system text scaling preferences and custom scaling
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Mock accessibility manager for now
const accessibilityManager = {
  subscribe: (callback: (state: any) => void) => {
    // Mock implementation
    return () => {}; // unsubscribe function
  }
};

// ============================================================================
// CONSTANTS
// ============================================================================

// Standard accessibility scaling categories
export const FONT_SCALE_CATEGORIES = {
  extraSmall: 0.8,
  small: 0.9,
  medium: 1.0,
  large: 1.1,
  extraLarge: 1.2,
  huge: 1.3,
  accessibility1: 1.4,
  accessibility2: 1.5,
  accessibility3: 1.6,
  accessibility4: 1.7,
  accessibility5: 1.8,
} as const;

export type FontScaleCategory = keyof typeof FONT_SCALE_CATEGORIES;

// Maximum safe scaling to prevent UI breakage
const MAX_SCALE = 2.0;
const MIN_SCALE = 0.8;

// ============================================================================
// TEXT SCALING CONTEXT
// ============================================================================

interface TextScalingContextType {
  fontScale: number;
  category: FontScaleCategory;
  isLargeText: boolean;
  setFontScale: (scale: number) => void;
  setCategory: (category: FontScaleCategory) => void;
  resetToSystemDefault: () => void;
  scaleText: (baseFontSize: number) => number;
}

const TextScalingContext = createContext<TextScalingContextType | undefined>(undefined);

// ============================================================================
// TEXT SCALING PROVIDER
// ============================================================================

interface TextScalingProviderProps {
  children: React.ReactNode;
  maxScale?: number;
  minScale?: number;
}

export const TextScalingProvider: React.FC<TextScalingProviderProps> = ({
  children,
  maxScale = MAX_SCALE,
  minScale = MIN_SCALE,
}) => {
  const [fontScale, setFontScale] = useState(1.0);
  const [category, setCategory] = useState<FontScaleCategory>('medium');
  const [systemFontScale, setSystemFontScale] = useState(1.0);

  // Determine if current scale qualifies as large text
  const isLargeText = fontScale >= 1.2;

  // Get system font scale
  useEffect(() => {
    const getSystemFontScale = () => {
      if (Platform.OS === 'web') {
        // Web platform - check for system preferences
        if (typeof window !== 'undefined') {
          // You can extend this to check for other accessibility preferences
          return 1.0;
        }
      }
      return 1.0;
    };

    setSystemFontScale(getSystemFontScale());
  }, []);

  // Listen to accessibility manager for system changes
  useEffect(() => {
    const unsubscribe = accessibilityManager.subscribe((state) => {
      // Update font scale based on system preferences
      if (state.preferredContentSizeCategory) {
        const categoryMapping: Record<string, FontScaleCategory> = {
          'UICTContentSizeCategoryXS': 'extraSmall',
          'UICTContentSizeCategoryS': 'small',
          'UICTContentSizeCategoryM': 'medium',
          'UICTContentSizeCategoryL': 'large',
          'UICTContentSizeCategoryXL': 'extraLarge',
          'UICTContentSizeCategoryXXL': 'huge',
          'UICTContentSizeCategoryXXXL': 'accessibility1',
        };
        
        const mappedCategory = categoryMapping[state.preferredContentSizeCategory] || 'medium';
        setCategory(mappedCategory);
        setFontScale(FONT_SCALE_CATEGORIES[mappedCategory]);
      }
    });

    return unsubscribe;
  }, []);

  // Constrain font scale within limits
  const constrainedFontScale = Math.max(minScale, Math.min(maxScale, fontScale));

  // Text scaling functions
  const handleSetFontScale = (scale: number) => {
    const constrainedScale = Math.max(minScale, Math.min(maxScale, scale));
    setFontScale(constrainedScale);
    
    // Find the closest category
    const closestCategory = Object.entries(FONT_SCALE_CATEGORIES)
      .reduce((closest, [key, value]) => {
        const currentDiff = Math.abs(value - constrainedScale);
        const closestDiff = Math.abs(FONT_SCALE_CATEGORIES[closest as FontScaleCategory] - constrainedScale);
        return currentDiff < closestDiff ? key as FontScaleCategory : closest;
      }, 'medium' as FontScaleCategory);
    
    setCategory(closestCategory);
  };

  const handleSetCategory = (newCategory: FontScaleCategory) => {
    setCategory(newCategory);
    setFontScale(FONT_SCALE_CATEGORIES[newCategory]);
  };

  const resetToSystemDefault = () => {
    setCategory('medium');
    setFontScale(systemFontScale);
  };

  const scaleText = (baseFontSize: number): number => {
    return Math.round(baseFontSize * constrainedFontScale);
  };

  const contextValue: TextScalingContextType = {
    fontScale: constrainedFontScale,
    category,
    isLargeText,
    setFontScale: handleSetFontScale,
    setCategory: handleSetCategory,
    resetToSystemDefault,
    scaleText,
  };

  return (
    <TextScalingContext.Provider value={contextValue}>
      {children}
    </TextScalingContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access text scaling context
 */
export const useTextScaling = (): TextScalingContextType => {
  const context = useContext(TextScalingContext);
  if (context === undefined) {
    throw new Error('useTextScaling must be used within a TextScalingProvider');
  }
  return context;
};

/**
 * Hook to get scaled font size
 */
export const useScaledFontSize = (baseFontSize: number): number => {
  const { scaleText } = useTextScaling();
  return scaleText(baseFontSize);
};

export default {
  TextScalingProvider,
  useTextScaling,
  useScaledFontSize,
  FONT_SCALE_CATEGORIES,
};