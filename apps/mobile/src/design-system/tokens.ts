/**
 * Design System Tokens
 * Modern 2025 Design Standards for Mates App
 * Semantic color tokens, typography scale, spacing system, and more
 */

import { Appearance } from 'react-native';

// ============================================================================
// iOS 26 GLASSMORPHISM TOKENS
// ============================================================================

// Glass morphism opacity and blur values (iOS 26 inspired)
export const GlassmorphismTokens = {
  // Glass opacity levels
  opacity: {
    ultraThin: 0.3,
    thin: 0.4,
    regular: 0.5,
    thick: 0.6,
    ultraThick: 0.75,
  },
  
  // Blur intensities (px values for expo-blur)
  blur: {
    subtle: 8,
    light: 12,
    regular: 20,
    heavy: 32,
    ultra: 50,
  },
  
  // Tinted glass colors for iOS 26 style buttons
  tintColors: {
    // Light mode tints
    light: {
      primary: 'rgba(74, 128, 240, 0.15)',
      secondary: 'rgba(115, 115, 115, 0.08)',
      success: 'rgba(34, 197, 94, 0.12)',
      warning: 'rgba(245, 158, 11, 0.12)',
      danger: 'rgba(239, 68, 68, 0.12)',
      neutral: 'rgba(0, 0, 0, 0.04)',
    },
    // Dark mode tints
    dark: {
      primary: 'rgba(74, 128, 240, 0.25)',
      secondary: 'rgba(255, 255, 255, 0.08)',
      success: 'rgba(74, 222, 128, 0.18)',
      warning: 'rgba(251, 191, 36, 0.18)',
      danger: 'rgba(248, 113, 113, 0.18)',
      neutral: 'rgba(255, 255, 255, 0.06)',
    },
  },
  
  // Glass border colors
  borderColors: {
    light: {
      subtle: 'rgba(255, 255, 255, 0.18)',
      regular: 'rgba(255, 255, 255, 0.25)',
      strong: 'rgba(255, 255, 255, 0.35)',
    },
    dark: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      regular: 'rgba(255, 255, 255, 0.12)',
      strong: 'rgba(255, 255, 255, 0.18)',
    },
  },
  
  // Glass shadow colors
  shadowColors: {
    light: {
      subtle: 'rgba(0, 0, 0, 0.04)',
      regular: 'rgba(0, 0, 0, 0.08)',
      strong: 'rgba(0, 0, 0, 0.12)',
    },
    dark: {
      subtle: 'rgba(0, 0, 0, 0.2)',
      regular: 'rgba(0, 0, 0, 0.3)',
      strong: 'rgba(0, 0, 0, 0.4)',
    },
  },
};

// iOS 26 Spring Animation Presets
export const SpringAnimations = {
  // Gentle spring for glass interactions
  glass: {
    damping: 25,
    stiffness: 400,
    mass: 0.8,
  },
  // Bouncy spring for buttons
  button: {
    damping: 20,
    stiffness: 500,
    mass: 0.6,
  },
  // Smooth spring for modals and sheets
  modal: {
    damping: 30,
    stiffness: 300,
    mass: 1.0,
  },
  // Quick spring for toggles
  toggle: {
    damping: 18,
    stiffness: 600,
    mass: 0.5,
  },
};

// ============================================================================
// COLOR PALETTE - Modern 2025 Standards
// ============================================================================

const BaseColors = {
  // Primary Brand Colors
  primary: {
    50: '#EEF4FF',
    100: '#E0EBFF', 
    200: '#C7DBFF',
    300: '#A5C4FF',
    400: '#82A3FF',
    500: '#4A80F0', // Main brand color
    600: '#3B6BDB',
    700: '#2C56C4',
    800: '#1E42AD',
    900: '#123096',
  },
  
  // Neutral Colors - Carefully crafted for readability
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  
  // Semantic Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    900: '#14532D',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    900: '#78350F',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    900: '#7F1D1D',
  },
  
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    900: '#1E3A8A',
  },
};

// ============================================================================
// SEMANTIC COLOR TOKENS
// ============================================================================

export const LightTheme = {
  // Surface Colors
  background: {
    primary: BaseColors.neutral[0],
    secondary: BaseColors.neutral[50],
    tertiary: BaseColors.neutral[100],
    elevated: BaseColors.neutral[0],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors
  text: {
    primary: BaseColors.neutral[900],
    secondary: BaseColors.neutral[600],
    tertiary: BaseColors.neutral[500],
    inverse: BaseColors.neutral[0],
    brand: BaseColors.primary[600],
  },
  
  // Border Colors
  border: {
    light: BaseColors.neutral[200],
    medium: BaseColors.neutral[300],
    strong: BaseColors.neutral[400],
    brand: BaseColors.primary[300],
  },
  
  // Interactive Colors
  interactive: {
    primary: BaseColors.primary[500],
    primaryHover: BaseColors.primary[600],
    primaryActive: BaseColors.primary[700],
    secondary: BaseColors.neutral[100],
    secondaryHover: BaseColors.neutral[200],
    danger: BaseColors.error[500],
    success: BaseColors.success[500],
  },
  
  // Status Colors
  status: {
    success: BaseColors.success[500],
    warning: BaseColors.warning[500],
    error: BaseColors.error[500],
    info: BaseColors.info[500],
    successBackground: BaseColors.success[50],
    warningBackground: BaseColors.warning[50],
    errorBackground: BaseColors.error[50],
    infoBackground: BaseColors.info[50],
  },
};

export const DarkTheme = {
  // Surface Colors
  background: {
    primary: BaseColors.neutral[950],
    secondary: BaseColors.neutral[900],
    tertiary: BaseColors.neutral[800],
    elevated: BaseColors.neutral[800],
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  
  // Text Colors
  text: {
    primary: BaseColors.neutral[50],
    secondary: BaseColors.neutral[400],
    tertiary: BaseColors.neutral[500],
    inverse: BaseColors.neutral[900],
    brand: BaseColors.primary[400],
  },
  
  // Border Colors
  border: {
    light: BaseColors.neutral[800],
    medium: BaseColors.neutral[700],
    strong: BaseColors.neutral[600],
    brand: BaseColors.primary[600],
  },
  
  // Interactive Colors
  interactive: {
    primary: BaseColors.primary[500],
    primaryHover: BaseColors.primary[400],
    primaryActive: BaseColors.primary[300],
    secondary: BaseColors.neutral[800],
    secondaryHover: BaseColors.neutral[700],
    danger: BaseColors.error[500],
    success: BaseColors.success[500],
  },
  
  // Status Colors
  status: {
    success: BaseColors.success[400],
    warning: BaseColors.warning[400],
    error: BaseColors.error[400],
    info: BaseColors.info[400],
    successBackground: 'rgba(34, 197, 94, 0.1)',
    warningBackground: 'rgba(245, 158, 11, 0.1)',
    errorBackground: 'rgba(239, 68, 68, 0.1)',
    infoBackground: 'rgba(59, 130, 246, 0.1)',
  },
};

// ============================================================================
// HIGH CONTRAST THEMES (Accessibility)
// ============================================================================

export const HighContrastLightTheme = {
  background: {
    primary: BaseColors.neutral[0],
    secondary: BaseColors.neutral[0],
    tertiary: BaseColors.neutral[0],
    elevated: BaseColors.neutral[0],
    overlay: BaseColors.neutral[900],
  },
  text: {
    primary: BaseColors.neutral[900],
    secondary: BaseColors.neutral[900],
    tertiary: BaseColors.neutral[700],
    inverse: BaseColors.neutral[0],
    brand: BaseColors.primary[900],
  },
  border: {
    light: BaseColors.neutral[900],
    medium: BaseColors.neutral[900],
    strong: BaseColors.neutral[900],
    brand: BaseColors.primary[900],
  },
  interactive: {
    primary: BaseColors.primary[900],
    primaryHover: BaseColors.primary[800],
    primaryActive: BaseColors.primary[700],
    secondary: BaseColors.neutral[0],
    secondaryHover: BaseColors.neutral[100],
    danger: BaseColors.error[900],
    success: BaseColors.success[900],
  },
  status: {
    success: BaseColors.success[900],
    warning: BaseColors.warning[900],
    error: BaseColors.error[900],
    info: BaseColors.info[900],
    successBackground: BaseColors.neutral[0],
    warningBackground: BaseColors.neutral[0],
    errorBackground: BaseColors.neutral[0],
    infoBackground: BaseColors.neutral[0],
  },
};

export const HighContrastDarkTheme = {
  background: {
    primary: BaseColors.neutral[900],
    secondary: BaseColors.neutral[900],
    tertiary: BaseColors.neutral[900],
    elevated: BaseColors.neutral[900],
    overlay: BaseColors.neutral[0],
  },
  text: {
    primary: BaseColors.neutral[0],
    secondary: BaseColors.neutral[0],
    tertiary: BaseColors.neutral[300],
    inverse: BaseColors.neutral[900],
    brand: BaseColors.primary[100],
  },
  border: {
    light: BaseColors.neutral[0],
    medium: BaseColors.neutral[0],
    strong: BaseColors.neutral[0],
    brand: BaseColors.primary[100],
  },
  interactive: {
    primary: BaseColors.primary[100],
    primaryHover: BaseColors.primary[200],
    primaryActive: BaseColors.primary[300],
    secondary: BaseColors.neutral[900],
    secondaryHover: BaseColors.neutral[800],
    danger: BaseColors.error[100],
    success: BaseColors.success[100],
  },
  status: {
    success: BaseColors.success[100],
    warning: BaseColors.warning[100],
    error: BaseColors.error[100],
    info: BaseColors.info[100],
    successBackground: BaseColors.neutral[900],
    warningBackground: BaseColors.neutral[900],
    errorBackground: BaseColors.neutral[900],
    infoBackground: BaseColors.neutral[900],
  },
};

// ============================================================================
// TYPOGRAPHY SCALE - Modern 2025 Standards
// ============================================================================

export const Typography = {
  // Display - For hero sections and large headlines
  display: {
    large: {
      fontSize: 57,
      lineHeight: 64,
      fontWeight: '700' as const,
      letterSpacing: -0.25,
    },
    medium: {
      fontSize: 45,
      lineHeight: 52,
      fontWeight: '700' as const,
      letterSpacing: 0,
    },
    small: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
  },
  
  // Headlines - For section headers
  headline: {
    large: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    medium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    small: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
  },
  
  // Title - For card titles and important text
  title: {
    large: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    medium: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0.15,
    },
    small: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '600' as const,
      letterSpacing: 0.1,
    },
  },
  
  // Body - For main content
  body: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0.5,
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      letterSpacing: 0.4,
    },
  },
  
  // Label - For buttons, form labels, captions
  label: {
    large: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500' as const,
      letterSpacing: 0.1,
    },
    medium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
    },
    small: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
    },
  },
};

// ============================================================================
// SPACING SYSTEM - 8px Base Grid
// ============================================================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
};

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// ============================================================================
// SHADOWS SYSTEM - Modern Elevation
// ============================================================================

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  inner: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: -1, // Inset shadow effect
  },
};

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const Animation = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  },
};

// ============================================================================
// BREAKPOINTS - For responsive design
// ============================================================================

export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

// ============================================================================
// THEME CONTEXT HELPER
// ============================================================================

export const getTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? DarkTheme : LightTheme;
};

// Export everything as default for easy importing
export default {
  BaseColors,
  LightTheme,
  DarkTheme,
  HighContrastLightTheme,
  HighContrastDarkTheme,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
  Breakpoints,
  GlassmorphismTokens,
  SpringAnimations,
  getTheme,
};