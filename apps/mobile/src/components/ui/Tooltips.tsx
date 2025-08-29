/**
 * Contextual Tooltips & Helpful Hints
 * Smart tooltip system with contextual help and progressive disclosure
 * 2025 design standards with animations and accessibility
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import { generateAccessibilityLabel, focusManager } from '../../utils/accessibility';
import Text from './Text';
import Icon from './Icon';
import Button from './Button';

// ============================================================================
// TYPES
// ============================================================================

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type TooltipTrigger = 'press' | 'longPress' | 'hover' | 'focus' | 'manual';
export type TooltipVariant = 'default' | 'info' | 'warning' | 'success' | 'error';

export interface TooltipConfig {
  id: string;
  title?: string;
  content: string;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  maxWidth?: number;
  showDelay?: number;
  hideDelay?: number;
  persistent?: boolean;
  showArrow?: boolean;
  actions?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
  }[];
  onShow?: () => void;
  onHide?: () => void;
  dismissOnTouchOutside?: boolean;
}

interface TooltipContextType {
  showTooltip: (config: TooltipConfig, targetRef: React.RefObject<View>) => void;
  hideTooltip: (id: string) => void;
  hideAllTooltips: () => void;
  isVisible: (id: string) => boolean;
}

interface ActiveTooltip extends TooltipConfig {
  targetRef: React.RefObject<View>;
  measurements?: {
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
  };
}

// ============================================================================
// CONTEXT
// ============================================================================

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

// ============================================================================
// TOOLTIP BUBBLE COMPONENT
// ============================================================================

interface TooltipBubbleProps {
  tooltip: ActiveTooltip;
  onHide: (id: string) => void;
}

const TooltipBubble: React.FC<TooltipBubbleProps> = ({ tooltip, onHide }) => {
  const colors = useColors();
  const tokens = useTokens();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [actualPosition, setActualPosition] = useState<TooltipPosition>('top');
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(-10);

  const screenDimensions = Dimensions.get('window');

  // Calculate optimal position
  useEffect(() => {
    if (!tooltip.measurements) return;

    const { pageX, pageY, width, height } = tooltip.measurements;
    const tooltipWidth = Math.min(tooltip.maxWidth || 280, screenDimensions.width - 32);
    const tooltipHeight = 100; // Estimated height
    const margin = 16;

    let finalPosition = tooltip.position || 'auto';
    let x = pageX + width / 2 - tooltipWidth / 2;
    let y = pageY;

    // Auto positioning logic
    if (finalPosition === 'auto') {
      const spaceAbove = pageY;
      const spaceBelow = screenDimensions.height - (pageY + height);
      const spaceLeft = pageX;
      const spaceRight = screenDimensions.width - (pageX + width);

      if (spaceBelow >= tooltipHeight + margin) {
        finalPosition = 'bottom';
      } else if (spaceAbove >= tooltipHeight + margin) {
        finalPosition = 'top';
      } else if (spaceRight >= tooltipWidth + margin) {
        finalPosition = 'right';
      } else if (spaceLeft >= tooltipWidth + margin) {
        finalPosition = 'left';
      } else {
        finalPosition = 'bottom'; // Default fallback
      }
    }

    // Position calculation based on final position
    switch (finalPosition) {
      case 'top':
        y = pageY - tooltipHeight - 12;
        break;
      case 'bottom':
        y = pageY + height + 12;
        break;
      case 'left':
        x = pageX - tooltipWidth - 12;
        y = pageY + height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        x = pageX + width + 12;
        y = pageY + height / 2 - tooltipHeight / 2;
        break;
    }

    // Boundary constraints
    x = Math.max(margin, Math.min(x, screenDimensions.width - tooltipWidth - margin));
    y = Math.max(margin, Math.min(y, screenDimensions.height - tooltipHeight - margin));

    setPosition({ x, y });
    setActualPosition(finalPosition);
  }, [tooltip.measurements, tooltip.maxWidth, tooltip.position]);

  // Entry animation
  useEffect(() => {
    const showDelay = tooltip.showDelay || 0;
    
    opacity.value = withDelay(
      showDelay,
      withTiming(1, { duration: 200 })
    );
    scale.value = withDelay(
      showDelay,
      withSpring(1, { damping: 20, stiffness: 300 })
    );
    translateY.value = withDelay(
      showDelay,
      withSpring(0, { damping: 20, stiffness: 300 })
    );

    // Haptic feedback
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, showDelay);

    // Announce to screen reader
    setTimeout(() => {
      const announcement = tooltip.title 
        ? `${tooltip.title}. ${tooltip.content}`
        : tooltip.content;
      focusManager.announceAction(announcement);
    }, showDelay + 100);

    // Call onShow callback
    setTimeout(() => {
      tooltip.onShow?.();
    }, showDelay);

    // Auto hide if not persistent
    if (!tooltip.persistent) {
      const hideDelay = tooltip.hideDelay || 5000;
      setTimeout(() => {
        handleHide();
      }, showDelay + hideDelay);
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handleHide = () => {
    opacity.value = withTiming(0, { duration: 150 });
    scale.value = withTiming(0.8, { duration: 150 });
    translateY.value = withTiming(-10, { duration: 150 }, () => {
      runOnJS(onHide)(tooltip.id);
      runOnJS(() => tooltip.onHide?.())();
    });
  };

  const getVariantStyles = () => {
    let backgroundColor = colors.background.elevated;
    let borderColor = colors.border.light;
    let iconName = 'Info';
    let iconColor = colors.text.secondary;

    switch (tooltip.variant) {
      case 'info':
        backgroundColor = colors.status.infoBackground;
        borderColor = colors.status.info;
        iconName = 'Info';
        iconColor = colors.status.info;
        break;
      case 'warning':
        backgroundColor = colors.status.warningBackground;
        borderColor = colors.status.warning;
        iconName = 'AlertTriangle';
        iconColor = colors.status.warning;
        break;
      case 'success':
        backgroundColor = colors.status.successBackground;
        borderColor = colors.status.success;
        iconName = 'Check';
        iconColor = colors.status.success;
        break;
      case 'error':
        backgroundColor = colors.status.errorBackground;
        borderColor = colors.status.error;
        iconName = 'AlertCircle';
        iconColor = colors.status.error;
        break;
    }

    return { backgroundColor, borderColor, iconName, iconColor };
  };

  const variantStyles = getVariantStyles();

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: position.x,
          top: position.y,
          maxWidth: tooltip.maxWidth || 280,
          zIndex: 10000,
        },
        animatedStyle,
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={generateAccessibilityLabel.status('tooltip', tooltip.content)}
    >
      {/* Arrow */}
      {tooltip.showArrow !== false && (
        <View
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            ...(actualPosition === 'top' && {
              bottom: -6,
              left: '50%',
              marginLeft: -6,
              borderLeftWidth: 6,
              borderRightWidth: 6,
              borderTopWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: variantStyles.backgroundColor,
            }),
            ...(actualPosition === 'bottom' && {
              top: -6,
              left: '50%',
              marginLeft: -6,
              borderLeftWidth: 6,
              borderRightWidth: 6,
              borderBottomWidth: 6,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: variantStyles.backgroundColor,
            }),
            ...(actualPosition === 'left' && {
              right: -6,
              top: '50%',
              marginTop: -6,
              borderTopWidth: 6,
              borderBottomWidth: 6,
              borderLeftWidth: 6,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: variantStyles.backgroundColor,
            }),
            ...(actualPosition === 'right' && {
              left: -6,
              top: '50%',
              marginTop: -6,
              borderTopWidth: 6,
              borderBottomWidth: 6,
              borderRightWidth: 6,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderRightColor: variantStyles.backgroundColor,
            }),
          }}
        />
      )}

      {/* Tooltip Content */}
      <View
        style={{
          backgroundColor: variantStyles.backgroundColor,
          borderRadius: tokens.BorderRadius.lg,
          padding: tokens.Spacing.lg,
          ...tokens.Shadows.lg,
          borderWidth: 1,
          borderColor: variantStyles.borderColor,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: tooltip.title ? tokens.Spacing.sm : 0,
          }}
        >
          {/* Icon */}
          {tooltip.variant && tooltip.variant !== 'default' && (
            <Icon
              name={variantStyles.iconName as any}
              size="sm"
              color={variantStyles.iconColor}
              style={{ marginRight: tokens.Spacing.sm, marginTop: 2 }}
            />
          )}

          {/* Title */}
          {tooltip.title && (
            <Text
              variant="titleSmall"
              color="primary"
              weight="semibold"
              style={{ flex: 1 }}
            >
              {tooltip.title}
            </Text>
          )}

          {/* Close Button */}
          {tooltip.persistent && (
            <Button
              variant="tertiary"
              size="small"
              onPress={handleHide}
              leftIcon={<Icon name="X" size="xs" />}
              style={{ marginLeft: tokens.Spacing.sm }}
              accessibilityLabel="Close tooltip"
            >
              Close
            </Button>
          )}
        </View>

        {/* Content */}
        <Text
          variant="bodyMedium"
          color="secondary"
          style={{
            lineHeight: tokens.Typography.body.medium.lineHeight * 1.2,
            marginBottom: tooltip.actions?.length ? tokens.Spacing.md : 0,
          }}
        >
          {tooltip.content}
        </Text>

        {/* Actions */}
        {tooltip.actions && tooltip.actions.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              gap: tokens.Spacing.sm,
              justifyContent: 'flex-end',
            }}
          >
            {tooltip.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'secondary'}
                size="small"
                onPress={() => {
                  action.onPress();
                  handleHide();
                }}
              >
                {action.label}
              </Button>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ============================================================================
// TOOLTIP PROVIDER
// ============================================================================

interface TooltipProviderProps {
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  const [activeTooltips, setActiveTooltips] = useState<ActiveTooltip[]>([]);

  const showTooltip = (config: TooltipConfig, targetRef: React.RefObject<View>) => {
    // Measure target element
    targetRef.current?.measureInWindow((x, y, width, height) => {
      const measurements = { x, y, width, height, pageX: x, pageY: y };
      
      const newTooltip: ActiveTooltip = {
        ...config,
        targetRef,
        measurements,
      };

      setActiveTooltips(prev => {
        // Remove existing tooltip with same ID
        const filtered = prev.filter(t => t.id !== config.id);
        return [...filtered, newTooltip];
      });
    });
  };

  const hideTooltip = (id: string) => {
    setActiveTooltips(prev => prev.filter(t => t.id !== id));
  };

  const hideAllTooltips = () => {
    setActiveTooltips([]);
  };

  const isVisible = (id: string) => {
    return activeTooltips.some(t => t.id === id);
  };

  const contextValue: TooltipContextType = {
    showTooltip,
    hideTooltip,
    hideAllTooltips,
    isVisible,
  };

  const handleTouchOutside = () => {
    // Hide tooltips that allow dismissOnTouchOutside
    setActiveTooltips(prev => 
      prev.filter(tooltip => tooltip.dismissOnTouchOutside === false)
    );
  };

  return (
    <TooltipContext.Provider value={contextValue}>
      <TouchableWithoutFeedback onPress={handleTouchOutside}>
        <View style={{ flex: 1 }}>
          {children}
          
          {/* Render Active Tooltips */}
          {activeTooltips.map(tooltip => (
            <TooltipBubble
              key={tooltip.id}
              tooltip={tooltip}
              onHide={hideTooltip}
            />
          ))}
        </View>
      </TouchableWithoutFeedback>
    </TooltipContext.Provider>
  );
};

// ============================================================================
// TOOLTIP WRAPPER COMPONENT
// ============================================================================

interface TooltipProps {
  children: React.ReactNode;
  tooltip: Omit<TooltipConfig, 'id'>;
  trigger?: TooltipTrigger;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  tooltip,
  trigger = 'longPress',
  disabled = false,
  style,
}) => {
  const { showTooltip } = useTooltips();
  const targetRef = useRef<View>(null);
  const tooltipId = `tooltip_${Date.now()}_${Math.random()}`;

  const handleTrigger = () => {
    if (disabled) return;
    
    showTooltip({ ...tooltip, id: tooltipId }, targetRef as React.RefObject<View>);
  };

  const getTriggerProps = () => {
    switch (trigger) {
      case 'press':
        return { onPress: handleTrigger };
      case 'longPress':
        return { onLongPress: handleTrigger };
      case 'hover':
        return Platform.OS === 'web' ? { onMouseEnter: handleTrigger } : {};
      case 'focus':
        return { onFocus: handleTrigger };
      default:
        return {};
    }
  };

  return (
    <View
      ref={targetRef}
      style={style}
      {...getTriggerProps()}
    >
      {children}
    </View>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

export const useTooltips = (): TooltipContextType => {
  const context = useContext(TooltipContext);
  if (context === undefined) {
    throw new Error('useTooltips must be used within a TooltipProvider');
  }
  return context;
};

// ============================================================================
// HELPFUL HINTS SYSTEM
// ============================================================================

interface HelpfulHint {
  id: string;
  selector: string; // Element identifier
  content: string;
  title?: string;
  variant?: TooltipVariant;
  showOnFirstVisit?: boolean;
  showAfterDelay?: number;
  priority?: number; // Higher priority shows first
}

export const useHelpfulHints = (hints: HelpfulHint[]) => {
  const { showTooltip } = useTooltips();
  const [shownHints, setShownHints] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load shown hints from storage
    // Implementation would load from AsyncStorage
  }, []);

  const showHint = (hint: HelpfulHint, targetRef: React.RefObject<View>) => {
    if (shownHints.has(hint.id)) return;

    const delay = hint.showAfterDelay || 0;
    
    setTimeout(() => {
      showTooltip({
        id: hint.id,
        title: hint.title,
        content: hint.content,
        variant: hint.variant || 'info',
        persistent: true,
        dismissOnTouchOutside: true,
        onHide: () => {
          setShownHints(prev => new Set(prev).add(hint.id));
          // Save to AsyncStorage
        },
      }, targetRef);
    }, delay);
  };

  const showAllHints = () => {
    // Implementation would show hints based on priority and timing
  };

  const resetHints = () => {
    setShownHints(new Set());
    // Clear AsyncStorage
  };

  return {
    showHint,
    showAllHints,
    resetHints,
    hasShownHint: (id: string) => shownHints.has(id),
  };
};

export default {
  TooltipProvider,
  Tooltip,
  useTooltips,
  useHelpfulHints,
};