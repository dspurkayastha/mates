/**
 * Modern Status Indicator Component
 * Premium status pills with 2025 design standards
 * Supports semantic variants, sizes, and animations
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import Text from './Text';
import Icon from './Icon';

// ============================================================================
// TYPES
// ============================================================================

type StatusVariant = 
  | 'success' | 'warning' | 'error' | 'info' | 'neutral' 
  | 'pending' | 'processing' | 'completed' | 'cancelled';

type StatusSize = 'small' | 'medium' | 'large';

interface StatusIndicatorProps {
  variant?: StatusVariant;
  size?: StatusSize;
  label?: string;
  icon?: string;
  animated?: boolean;
  pulse?: boolean;
  style?: ViewStyle;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  variant = 'neutral',
  size = 'medium',
  label,
  icon,
  animated = false,
  pulse = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const scale = useSharedValue(1);

  // Setup pulse animation
  React.useEffect(() => {
    if (pulse) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.1, { damping: 15, stiffness: 150 }),
          withSpring(1, { damping: 15, stiffness: 150 })
        ),
        -1,
        false
      );
    }
  }, [pulse, scale]);

  // Animated style for pulse effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Get variant styles
  const getVariantStyles = () => {
    const baseStyle = {
      borderRadius: tokens.BorderRadius.full,
      paddingVertical: size === 'small' ? tokens.Spacing.xs : 
                     size === 'medium' ? tokens.Spacing.sm : tokens.Spacing.md,
      paddingHorizontal: size === 'small' ? tokens.Spacing.sm : 
                        size === 'medium' ? tokens.Spacing.md : tokens.Spacing.lg,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    let variantStyle: ViewStyle = {};
    let textColor = colors.text.primary;

    switch (variant) {
      case 'success':
      case 'completed':
        variantStyle = {
          backgroundColor: colors.status.successBackground,
          borderWidth: 1,
          borderColor: colors.status.success,
        };
        textColor = colors.status.success;
        break;

      case 'warning':
      case 'pending':
        variantStyle = {
          backgroundColor: colors.status.warningBackground,
          borderWidth: 1,
          borderColor: colors.status.warning,
        };
        textColor = colors.status.warning;
        break;

      case 'error':
      case 'cancelled':
        variantStyle = {
          backgroundColor: colors.status.errorBackground,
          borderWidth: 1,
          borderColor: colors.status.error,
        };
        textColor = colors.status.error;
        break;

      case 'info':
      case 'processing':
        variantStyle = {
          backgroundColor: colors.status.infoBackground,
          borderWidth: 1,
          borderColor: colors.status.info,
        };
        textColor = colors.status.info;
        break;

      case 'neutral':
      default:
        variantStyle = {
          backgroundColor: colors.background.secondary,
          borderWidth: 1,
          borderColor: colors.border.medium,
        };
        textColor = colors.text.secondary;
        break;
    }

    return { baseStyle, variantStyle, textColor };
  };

  // Get text variant based on size
  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'labelSmall' as const;
      case 'medium':
        return 'labelMedium' as const;
      case 'large':
        return 'labelLarge' as const;
      default:
        return 'labelMedium' as const;
    }
  };

  // Get icon size based on component size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'xs' as const;
      case 'medium':
        return 'sm' as const;
      case 'large':
        return 'md' as const;
      default:
        return 'sm' as const;
    }
  };

  const { baseStyle, variantStyle, textColor } = getVariantStyles();
  const textVariant = getTextVariant();
  const iconSize = getIconSize();

  // Generate accessibility properties
  const getAccessibilityProps = () => {
    const statusText = label || variant;
    const defaultLabel = accessibilityLabel || `Status: ${statusText}`;
    
    let defaultHint = accessibilityHint;
    if (!defaultHint) {
      switch (variant) {
        case 'success':
        case 'completed':
          defaultHint = 'This item has been completed successfully';
          break;
        case 'error':
        case 'cancelled':
          defaultHint = 'This item has an error or was cancelled';
          break;
        case 'warning':
        case 'pending':
          defaultHint = 'This item requires attention or is pending';
          break;
        case 'processing':
          defaultHint = 'This item is currently being processed';
          break;
        default:
          defaultHint = 'Status indicator';
      }
    }

    return {
      accessible: true,
      accessibilityLabel: defaultLabel,
      accessibilityHint: defaultHint,
      accessibilityRole: 'text' as const,
      testID,
    };
  };

  const StatusContent = () => {
    const accessibilityProps = getAccessibilityProps();
    
    return (
      <View 
        style={[baseStyle, variantStyle, style]}
        {...accessibilityProps}
      >
        {icon && (
          <>
            <Icon 
              name={icon as any} 
              size={iconSize} 
              color={textColor}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            />
            {label && <View style={{ width: tokens.Spacing.xs }} />}
          </>
        )}
        {label && (
          <Text
            variant={textVariant}
            color={textColor}
            weight="semibold"
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          >
            {label}
          </Text>
        )}
      </View>
    );
  };

  // Return with animation if needed
  if (animated || pulse) {
    return (
      <Animated.View style={animatedStyle}>
        <StatusContent />
      </Animated.View>
    );
  }

  return <StatusContent />;
};

// ============================================================================
// PRESET STATUS COMPONENTS
// ============================================================================

export const SuccessStatus = (props: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="success" icon="Check" {...props} />
);

export const ErrorStatus = (props: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="error" icon="X" {...props} />
);

export const WarningStatus = (props: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="warning" icon="AlertTriangle" {...props} />
);

export const InfoStatus = (props: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="info" icon="Info" {...props} />
);

export const PendingStatus = (props: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="pending" icon="Clock" pulse {...props} />
);

export const ProcessingStatus = (props: Omit<StatusIndicatorProps, 'variant'>) => (
  <StatusIndicator variant="processing" icon="Loader2" animated pulse {...props} />
);

export default StatusIndicator;