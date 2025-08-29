/**
 * Text Scaling Utilities
 * Responsive text scaling and accessibility support
 */

import { useWindowDimensions, AccessibilityInfo } from 'react-native';
import { useState, useEffect } from 'react';

export interface TextScalingConfig {
  minScale: number;
  maxScale: number;
  baseSize: number;
  accessibilityMultiplier: number;
}

const DEFAULT_CONFIG: TextScalingConfig = {
  minScale: 0.8,
  maxScale: 2.0,
  baseSize: 16,
  accessibilityMultiplier: 1.2,
};

export const useTextScaling = (config: Partial<TextScalingConfig> = {}) => {
  const { width } = useWindowDimensions();
  const [accessibilityScale, setAccessibilityScale] = useState(1);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    // Check for accessibility preferences
    const checkAccessibilitySettings = async () => {
      try {
        const [isReduceMotionOn, isScreenReaderEnabled] = await Promise.all([
          AccessibilityInfo.isReduceMotionEnabled(),
          AccessibilityInfo.isScreenReaderEnabled(),
        ]);
        
        setIsReduceMotionEnabled(isReduceMotionOn);
        
        // Increase text scale if screen reader is enabled
        if (isScreenReaderEnabled) {
          setAccessibilityScale(finalConfig.accessibilityMultiplier);
        }
      } catch (error) {
        console.warn('Failed to check accessibility settings:', error);
      }
    };

    checkAccessibilitySettings();

    // Listen for accessibility changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    return () => {
      subscription?.remove();
    };
  }, [finalConfig.accessibilityMultiplier]);

  // Calculate responsive scale based on screen width
  const getResponsiveScale = () => {
    // Base breakpoints (adjust as needed)
    const breakpoints = {
      small: 320,
      medium: 768,
      large: 1024,
    };

    let responsiveScale = 1;
    
    if (width <= breakpoints.small) {
      responsiveScale = 0.9;
    } else if (width <= breakpoints.medium) {
      responsiveScale = 1;
    } else {
      responsiveScale = 1.1;
    }

    return responsiveScale;
  };

  // Calculate final scale
  const calculateScale = (baseScale: number = 1) => {
    const responsiveScale = getResponsiveScale();
    const combinedScale = baseScale * responsiveScale * accessibilityScale;
    
    return Math.max(
      finalConfig.minScale,
      Math.min(finalConfig.maxScale, combinedScale)
    );
  };

  // Get scaled font size
  const getScaledSize = (size: number) => {
    return size * calculateScale();
  };

  // Get scaled spacing (useful for padding, margins)
  const getScaledSpacing = (spacing: number) => {
    return spacing * calculateScale(0.8); // Less aggressive scaling for spacing
  };

  return {
    scale: calculateScale(),
    getScaledSize,
    getScaledSpacing,
    isReduceMotionEnabled,
    accessibilityScale,
    responsiveScale: getResponsiveScale(),
  };
};

export const TextScalePresets = {
  small: 0.875,
  normal: 1,
  large: 1.125,
  extraLarge: 1.25,
} as const;

export type TextScalePreset = keyof typeof TextScalePresets;