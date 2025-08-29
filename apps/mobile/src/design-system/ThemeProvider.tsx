/**
 * Theme Provider Component
 * Manages theme state and provides design tokens throughout the app
 * Supports automatic dark mode detection and manual theme switching
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DesignTokens, { 
  LightTheme, 
  DarkTheme, 
  HighContrastLightTheme, 
  HighContrastDarkTheme 
} from './tokens';
import { accessibilityManager, AccessibilityState } from '../utils/accessibility';

// ============================================================================
// TYPES
// ============================================================================

export type ColorScheme = 'light' | 'dark' | 'auto';
export type ContrastMode = 'normal' | 'high';
export type Theme = typeof LightTheme;

interface ThemeConfig {
  colorScheme: ColorScheme;
  contrast: ContrastMode;
  followSystemContrast: boolean;
}

interface ThemeContextType {
  theme: Theme;
  config: ThemeConfig;
  isDark: boolean;
  isHighContrast: boolean;
  toggleTheme: () => void;
  toggleContrast: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setContrastMode: (contrast: ContrastMode) => void;
  tokens: typeof DesignTokens;
  accessibility: AccessibilityState;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@mates_app_theme';
const CONTRAST_STORAGE_KEY = '@mates_app_contrast';

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>({
    colorScheme: 'auto',
    contrast: 'normal',
    followSystemContrast: true,
  });
  const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme() || 'light');
  const [accessibility, setAccessibility] = useState<AccessibilityState>({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isHighContrastEnabled: false,
    preferredContentSizeCategory: 'medium',
  });

  // Calculate the actual theme to use
  const actualScheme = config.colorScheme === 'auto' ? systemScheme : config.colorScheme;
  const isDark = actualScheme === 'dark';
  
  // Determine if high contrast should be used
  const isHighContrast = config.contrast === 'high' ||
    (config.followSystemContrast && accessibility.isHighContrastEnabled);
  
  // Select the appropriate theme
  const getTheme = (): Theme => {
    if (isHighContrast) {
      return isDark ? HighContrastDarkTheme : HighContrastLightTheme;
    }
    return isDark ? DarkTheme : LightTheme;
  };
  
  const theme = getTheme();

  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [savedScheme, savedContrast] = await Promise.all([
          AsyncStorage.getItem(THEME_STORAGE_KEY),
          AsyncStorage.getItem(CONTRAST_STORAGE_KEY),
        ]);
        
        const newConfig: Partial<ThemeConfig> = {};
        
        if (savedScheme && ['light', 'dark', 'auto'].includes(savedScheme)) {
          newConfig.colorScheme = savedScheme as ColorScheme;
        }
        
        if (savedContrast) {
          const contrastData = JSON.parse(savedContrast);
          newConfig.contrast = contrastData.mode || 'normal';
          newConfig.followSystemContrast = contrastData.followSystem !== false;
        }
        
        if (Object.keys(newConfig).length > 0) {
          setConfig(prev => ({ ...prev, ...newConfig }));
        }
      } catch (error) {
        console.warn('Failed to load theme preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      setSystemScheme(newScheme || 'light');
    });

    return () => subscription?.remove();
  }, []);

  // Listen to accessibility changes
  useEffect(() => {
    // Initialize accessibility manager
    accessibilityManager.initialize().catch(error => {
      console.warn('Failed to initialize accessibility manager:', error);
    });
    
    const unsubscribe = accessibilityManager.subscribe(setAccessibility);
    return unsubscribe;
  }, []);

  // Update status bar style when theme changes
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [isDark]);

  // Save preferences when they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(THEME_STORAGE_KEY, config.colorScheme),
          AsyncStorage.setItem(CONTRAST_STORAGE_KEY, JSON.stringify({
            mode: config.contrast,
            followSystem: config.followSystemContrast,
          })),
        ]);
      } catch (error) {
        console.warn('Failed to save theme preferences:', error);
      }
    };

    savePreferences();
  }, [config]);

  // Theme manipulation functions
  const toggleTheme = () => {
    const nextScheme: ColorScheme = config.colorScheme === 'light' ? 'dark' : 'light';
    setConfig(prev => ({ ...prev, colorScheme: nextScheme }));
  };

  const toggleContrast = () => {
    const nextContrast: ContrastMode = config.contrast === 'normal' ? 'high' : 'normal';
    setConfig(prev => ({ ...prev, contrast: nextContrast }));
  };

  const handleSetColorScheme = (scheme: ColorScheme) => {
    setConfig(prev => ({ ...prev, colorScheme: scheme }));
  };

  const handleSetContrastMode = (contrast: ContrastMode) => {
    setConfig(prev => ({ ...prev, contrast }));
  };

  const contextValue: ThemeContextType = {
    theme,
    config,
    isDark,
    isHighContrast,
    toggleTheme,
    toggleContrast,
    setColorScheme: handleSetColorScheme,
    setContrastMode: handleSetContrastMode,
    tokens: DesignTokens,
    accessibility,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access theme context
 * Throws error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Hook to get current theme colors
 * Convenience hook for quick access to colors
 */
export const useColors = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Provide fallback light theme when context is not ready
    console.warn('useColors called outside ThemeProvider, using fallback light theme');
    return LightTheme;
  }
  const { theme } = context;
  return theme;
};

/**
 * Hook to get design tokens
 * Convenience hook for accessing typography, spacing, etc.
 */
export const useTokens = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Provide fallback tokens when context is not ready
    console.warn('useTokens called outside ThemeProvider, using fallback tokens');
    return DesignTokens;
  }
  const { tokens } = context;
  return tokens;
};

/**
 * Hook to get glassmorphism colors based on current theme
 * Provides theme-aware glass tint colors and opacity values
 */
export const useGlassColors = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Provide fallback glass colors when context is not ready
    console.warn('useGlassColors called outside ThemeProvider, using fallback values');
    const glassTokens = DesignTokens.GlassmorphismTokens;
    const tintColors = glassTokens.tintColors.light; // Default to light theme
    const borderColors = glassTokens.borderColors.light;
    const shadowColors = glassTokens.shadowColors.light;
    
    return {
      tint: tintColors,
      borders: borderColors,
      shadows: shadowColors,
      opacity: glassTokens.opacity,
      blur: glassTokens.blur,
      isDark: false,
    };
  }
  
  const { isDark, tokens } = context;
  
  const glassTokens = tokens.GlassmorphismTokens;
  const tintColors = isDark ? glassTokens.tintColors.dark : glassTokens.tintColors.light;
  const borderColors = isDark ? glassTokens.borderColors.dark : glassTokens.borderColors.light;
  const shadowColors = isDark ? glassTokens.shadowColors.dark : glassTokens.shadowColors.light;
  
  return {
    tint: tintColors,
    borders: borderColors,
    shadows: shadowColors,
    opacity: glassTokens.opacity,
    blur: glassTokens.blur,
    isDark,
  };
};

/**
 * Hook to get glass variant colors
 * Returns appropriate glass colors for different component variants
 */
export const useGlassVariant = (variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral' = 'primary') => {
  const { tint, borders, shadows } = useGlassColors();
  
  return {
    tintColor: tint[variant],
    borderColor: borders.regular,
    shadowColor: shadows.regular,
  };
};

/**
 * Hook to get glass intensity settings
 * Returns blur and opacity values for different glass intensities
 */
export const useGlassIntensity = (intensity: 'ultraThin' | 'thin' | 'regular' | 'thick' | 'ultraThick' = 'regular') => {
  const { opacity, blur } = useGlassColors();
  
  return {
    opacity: opacity[intensity],
    blur: blur[intensity === 'ultraThin' ? 'subtle' : 
          intensity === 'thin' ? 'light' : 
          intensity === 'regular' ? 'regular' : 
          intensity === 'thick' ? 'heavy' : 'ultra'],
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates styles with theme-aware colors
 * Usage: createThemedStyles((theme) => ({ container: { backgroundColor: theme.background.primary } }))
 */
export const createThemedStyles = <T extends Record<string, any>>(
  stylesFactory: (theme: Theme) => T
) => {
  return (theme: Theme): T => stylesFactory(theme);
};

/**
 * Get color value with opacity
 * Usage: withOpacity(theme.text.primary, 0.5)
 */
export const withOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('rgba')) {
    // Replace the alpha value in existing rgba
    return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, `rgba($1,$2,$3,${opacity})`);
  }
  
  if (color.startsWith('#')) {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Return as-is for named colors or other formats
  return color;
};

/**
 * Get responsive value based on screen size
 * Usage: getResponsiveValue({ mobile: 16, tablet: 18, desktop: 20 })
 */
export function getResponsiveValue<T>(values: {
  mobile: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}): T {
  // For now, return mobile value (implement proper responsive logic later)
  return values.mobile;
}

// ============================================================================
// GLASSMORPHISM UTILITIES
// ============================================================================

/**
 * Generate glass background color with tint and opacity
 * Usage: getGlassBackground(theme, 'primary', 'regular')
 */
export const getGlassBackground = (
  theme: Theme, 
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral' = 'primary',
  intensity: 'ultraThin' | 'thin' | 'regular' | 'thick' | 'ultraThick' = 'regular'
): string => {
  const isDark = theme.background.primary === theme.BaseColors.neutral[950];
  const glassTokens = DesignTokens.GlassmorphismTokens;
  const tintColors = isDark ? glassTokens.tintColors.dark : glassTokens.tintColors.light;
  const opacity = glassTokens.opacity[intensity];
  
  return withOpacity(tintColors[variant], opacity);
};

/**
 * Generate glass border color based on theme and intensity
 * Usage: getGlassBorder(theme, 'subtle')
 */
export const getGlassBorder = (
  theme: Theme,
  strength: 'subtle' | 'regular' | 'strong' = 'regular'
): string => {
  const isDark = theme.background.primary === theme.BaseColors.neutral[950];
  const glassTokens = DesignTokens.GlassmorphismTokens;
  const borderColors = isDark ? glassTokens.borderColors.dark : glassTokens.borderColors.light;
  
  return borderColors[strength];
};

/**
 * Generate glass shadow color based on theme
 * Usage: getGlassShadow(theme, 'regular')
 */
export const getGlassShadow = (
  theme: Theme,
  intensity: 'subtle' | 'regular' | 'strong' = 'regular'
): string => {
  const isDark = theme.background.primary === theme.BaseColors.neutral[950];
  const glassTokens = DesignTokens.GlassmorphismTokens;
  const shadowColors = isDark ? glassTokens.shadowColors.dark : glassTokens.shadowColors.light;
  
  return shadowColors[intensity];
};

/**
 * Create complete glass style object
 * Usage: createGlassStyle(theme, { variant: 'primary', intensity: 'regular', borderRadius: 16 })
 */
export const createGlassStyle = (
  theme: Theme,
  options: {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral';
    intensity?: 'ultraThin' | 'thin' | 'regular' | 'thick' | 'ultraThick';
    borderRadius?: number;
    borderWidth?: number;
    shadowEnabled?: boolean;
  } = {}
) => {
  const {
    variant = 'neutral',
    intensity = 'regular',
    borderRadius = 16,
    borderWidth = 1,
    shadowEnabled = true,
  } = options;

  const backgroundColor = getGlassBackground(theme, variant, intensity);
  const borderColor = getGlassBorder(theme, 'regular');
  const shadowColor = getGlassShadow(theme, 'regular');
  
  return {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    overflow: 'hidden' as const,
    ...(shadowEnabled && {
      shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    }),
  };
};

/**
 * Generate dynamic glass colors based on context
 * Usage: getDynamicGlassColors(theme, { isPressed: true, isError: false })
 */
export const getDynamicGlassColors = (
  theme: Theme,
  state: {
    isPressed?: boolean;
    isFocused?: boolean;
    isError?: boolean;
    isDisabled?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral';
  } = {}
) => {
  const {
    isPressed = false,
    isFocused = false,
    isError = false,
    isDisabled = false,
    variant = 'neutral',
  } = state;

  let finalVariant = variant;
  
  // Override variant based on state
  if (isError) finalVariant = 'danger';
  
  // Get base colors
  const baseBackground = getGlassBackground(theme, finalVariant, 'regular');
  const baseBorder = getGlassBorder(theme, 'regular');
  
  // Modify based on state
  let backgroundColor = baseBackground;
  let borderColor = baseBorder;
  
  if (isDisabled) {
    backgroundColor = withOpacity(backgroundColor, 0.5);
    borderColor = withOpacity(borderColor, 0.5);
  } else if (isPressed) {
    backgroundColor = withOpacity(backgroundColor, 0.8);
  } else if (isFocused) {
    borderColor = theme.interactive.primary;
  }
  
  return {
    backgroundColor,
    borderColor,
    tintColor: getGlassBackground(theme, finalVariant, 'thin'),
  };
};

// Export theme types for TypeScript
// Note: Types are already exported above where they're defined