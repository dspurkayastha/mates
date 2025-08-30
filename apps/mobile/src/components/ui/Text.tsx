/**
 * Modern Text Component
 * A typography component that follows 2025 design standards
 * Supports semantic variants, responsive sizing, and accessibility
 */

import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps, Platform } from 'react-native';
import { useColors, useTokens, useTheme } from '../../design-system/ThemeProvider';

// ============================================================================
// TYPES
// ============================================================================

type TypographyVariant = 
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall';

type ColorVariant = 
  | 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'brand'
  | 'success' | 'warning' | 'error' | 'info';

interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TypographyVariant;
  color?: ColorVariant | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  style?: RNTextProps['style'];
  children: React.ReactNode;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'text' | 'header' | 'summary' | 'none';
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color = 'primary',
  align = 'left',
  weight,
  style,
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
  ...props
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const { accessibility } = useTheme();

  const typographyStyle = useMemo(() => {
    switch (variant) {
      case 'displayLarge':
        return tokens.Typography.display.large;
      case 'displayMedium':
        return tokens.Typography.display.medium;
      case 'displaySmall':
        return tokens.Typography.display.small;
      case 'headlineLarge':
        return tokens.Typography.headline.large;
      case 'headlineMedium':
        return tokens.Typography.headline.medium;
      case 'headlineSmall':
        return tokens.Typography.headline.small;
      case 'titleLarge':
        return tokens.Typography.title.large;
      case 'titleMedium':
        return tokens.Typography.title.medium;
      case 'titleSmall':
        return tokens.Typography.title.small;
      case 'bodyLarge':
        return tokens.Typography.body.large;
      case 'bodyMedium':
        return tokens.Typography.body.medium;
      case 'bodySmall':
        return tokens.Typography.body.small;
      case 'labelLarge':
        return tokens.Typography.label.large;
      case 'labelMedium':
        return tokens.Typography.label.medium;
      case 'labelSmall':
        return tokens.Typography.label.small;
      default:
        return tokens.Typography.body.medium;
    }
  }, [variant, tokens]);

  const textColorValue = useMemo(() => {
    if (
      typeof color === 'string' &&
      (color.startsWith('#') || color.startsWith('rgb'))
    ) {
      return color;
    }

    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'tertiary':
        return colors.text.tertiary;
      case 'inverse':
        return colors.text.inverse;
      case 'brand':
        return colors.text.brand;
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
      case 'info':
        return colors.status.info;
      default:
        return colors.text.primary;
    }
  }, [color, colors]);

  const fontWeightValue = useMemo(() => {
    if (weight) {
      switch (weight) {
        case 'normal':
          return '400';
        case 'medium':
          return '500';
        case 'semibold':
          return '600';
        case 'bold':
          return '700';
        default:
          return weight;
      }
    }
    return typographyStyle.fontWeight;
  }, [weight, typographyStyle]);

  const scaledTypographyStyle = useMemo(() => {
    const scaleMap: Record<string, number> = {
      extraSmall: 0.8,
      small: 0.9,
      medium: 1,
      large: 1.1,
      extraLarge: 1.2,
      huge: 1.3,
      accessibility1: 1.4,
      accessibility2: 1.5,
      accessibility3: 1.6,
      accessibility4: 1.7,
      accessibility5: 1.8,
    };
    const scale = scaleMap[accessibility.preferredContentSizeCategory] || 1;
    return {
      ...typographyStyle,
      fontSize: typographyStyle.fontSize * scale,
      lineHeight: typographyStyle.lineHeight
        ? typographyStyle.lineHeight * scale
        : undefined,
    };
  }, [typographyStyle, accessibility.preferredContentSizeCategory]);

  const textStyle = useMemo(
    () => ({
      ...scaledTypographyStyle,
      fontWeight: fontWeightValue,
      color: textColorValue,
      textAlign: align,
      fontFamily: Platform.select({ ios: 'SF Pro', default: 'System' }),
    }),
    [scaledTypographyStyle, fontWeightValue, textColorValue, align]
  );

  // Determine accessibility role based on variant
  const getDefaultAccessibilityRole = () => {
    if (accessibilityRole) return accessibilityRole;
    
    if (variant.startsWith('display') || variant.startsWith('headline') || variant.startsWith('title')) {
      return 'header';
    }
    return 'text';
  };

  return (
    <RNText
      style={[textStyle, style]}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityRole={getDefaultAccessibilityRole()}
      testID={testID}
      accessible={true}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;