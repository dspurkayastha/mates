/**
 * GlassView Component
 * Foundation component for iOS 26 glassmorphism effects
 * Provides true translucent, frosted-glass backgrounds with blur effects
 */

import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColors, useTokens, withOpacity } from '../../design-system/ThemeProvider';

// ============================================================================
// TYPES
// ============================================================================

type GlassIntensity = 'ultraThin' | 'thin' | 'regular' | 'thick' | 'ultraThick';
type GlassTint = 'none' | 'light' | 'dark' | 'extraLight' | 'prominent' | 'regular' | 'systemUltraThinMaterial' | 'systemThinMaterial' | 'systemMaterial' | 'systemThickMaterial' | 'systemChromeMaterial';

interface GlassViewProps {
  children?: React.ReactNode;
  intensity?: GlassIntensity;
  tint?: GlassTint;
  style?: ViewStyle;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadowEnabled?: boolean;
  shadowIntensity?: 'subtle' | 'regular' | 'strong';
  // Accessibility
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const GlassView: React.FC<GlassViewProps> = ({
  children,
  intensity = 'regular',
  tint = 'systemMaterial',
  style,
  borderRadius = 16,
  borderWidth = 1,
  borderColor,
  shadowEnabled = true,
  shadowIntensity = 'regular',
  accessible = false,
  accessibilityLabel,
  accessibilityRole,
  testID,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const isDark = colors.background.primary === tokens.BaseColors.neutral[950];

  // Get blur intensity value
  const getBlurIntensity = (): number => {
    switch (intensity) {
      case 'ultraThin': return tokens.GlassmorphismTokens.blur.subtle;
      case 'thin': return tokens.GlassmorphismTokens.blur.light;
      case 'regular': return tokens.GlassmorphismTokens.blur.regular;
      case 'thick': return tokens.GlassmorphismTokens.blur.heavy;
      case 'ultraThick': return tokens.GlassmorphismTokens.blur.ultra;
      default: return tokens.GlassmorphismTokens.blur.regular;
    }
  };

  // Get opacity value for fallback backgrounds
  const getOpacity = (): number => {
    switch (intensity) {
      case 'ultraThin': return tokens.GlassmorphismTokens.opacity.ultraThin;
      case 'thin': return tokens.GlassmorphismTokens.opacity.thin;
      case 'regular': return tokens.GlassmorphismTokens.opacity.regular;
      case 'thick': return tokens.GlassmorphismTokens.opacity.thick;
      case 'ultraThick': return tokens.GlassmorphismTokens.opacity.ultraThick;
      default: return tokens.GlassmorphismTokens.opacity.regular;
    }
  };

  // Get border color
  const getBorderColor = (): string => {
    if (borderColor) return borderColor;
    
    const borderColors = isDark 
      ? tokens.GlassmorphismTokens.borderColors.dark
      : tokens.GlassmorphismTokens.borderColors.light;
    
    switch (intensity) {
      case 'ultraThin':
      case 'thin':
        return borderColors.subtle;
      case 'thick':
      case 'ultraThick':
        return borderColors.strong;
      default:
        return borderColors.regular;
    }
  };

  // Get shadow styles
  const getShadowStyles = (): ViewStyle => {
    if (!shadowEnabled) return {};
    
    const shadowColors = isDark 
      ? tokens.GlassmorphismTokens.shadowColors.dark
      : tokens.GlassmorphismTokens.shadowColors.light;
    
    let shadowColor: string;
    let shadowOpacity: number;
    let shadowRadius: number;
    let elevation: number;
    
    switch (shadowIntensity) {
      case 'subtle':
        shadowColor = shadowColors.subtle;
        shadowOpacity = 0.8;
        shadowRadius = 8;
        elevation = 2;
        break;
      case 'strong':
        shadowColor = shadowColors.strong;
        shadowOpacity = 1;
        shadowRadius = 20;
        elevation = 8;
        break;
      default: // regular
        shadowColor = shadowColors.regular;
        shadowOpacity = 0.9;
        shadowRadius = 12;
        elevation = 4;
        break;
    }
    
    return {
      shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity,
      shadowRadius,
      elevation,
    };
  };

  // Container styles
  const containerStyles: ViewStyle = {
    borderRadius,
    borderWidth,
    borderColor: getBorderColor(),
    overflow: 'hidden',
    ...getShadowStyles(),
    ...style,
  };

  // Fallback background for web and older platforms
  const fallbackBackground = withOpacity(
    isDark ? '#000000' : '#FFFFFF', 
    getOpacity()
  );

  // Use BlurView on supported platforms, fallback to semi-transparent View
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <View 
        style={containerStyles}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        testID={testID}
      >
        <BlurView
          intensity={getBlurIntensity()}
          tint={tint}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          {children}
        </BlurView>
      </View>
    );
  }

  // Fallback for web and other platforms
  return (
    <View 
      style={[
        containerStyles,
        {
          backgroundColor: fallbackBackground,
          backdropFilter: `blur(${getBlurIntensity()}px)`, // CSS backdrop-filter for web
        }
      ]}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      testID={testID}
    >
      {children}
    </View>
  );
};

export default GlassView;