/**
 * Advanced Notification System
 * Premium toast notifications, banners, and in-app messaging
 * Modern 2025 design with animations and accessibility
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  View,
  ViewStyle,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
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

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type NotificationPosition = 'top' | 'bottom' | 'center';
export type NotificationStyle = 'toast' | 'banner' | 'modal' | 'inline';

export interface NotificationAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: string;
}

export interface NotificationConfig {
  id?: string;
  type?: NotificationType;
  title: string;
  message?: string;
  duration?: number; // 0 for persistent
  position?: NotificationPosition;
  style?: NotificationStyle;
  actions?: NotificationAction[];
  icon?: string;
  image?: string;
  haptics?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  onShow?: () => void;
  accessibilityLabel?: string;
}

interface NotificationContextType {
  show: (config: NotificationConfig) => string;
  hide: (id: string) => void;
  hideAll: () => void;
  update: (id: string, config: Partial<NotificationConfig>) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ============================================================================
// NOTIFICATION ITEM COMPONENT
// ============================================================================

interface NotificationItemProps {
  notification: NotificationConfig & { id: string };
  onDismiss: (id: string) => void;
  position: NotificationPosition;
  style: NotificationStyle;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDismiss,
  position,
  style: notificationStyle,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const translateY = useSharedValue(position === 'top' ? -200 : 200);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  // Animation on mount
  useEffect(() => {
    // Haptic feedback
    if (notification.haptics !== false) {
      switch (notification.type) {
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    // Entry animation
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 300,
    });
    scale.value = withSpring(1, {
      damping: 20,
      stiffness: 300,
    });
    opacity.value = withTiming(1, { duration: 300 });

    // Announce to screen reader
    const announcement = notification.accessibilityLabel || 
      generateAccessibilityLabel.status(
        notification.type || 'info',
        `${notification.title}${notification.message ? '. ' + notification.message : ''}`
      );
    focusManager.announceAction(announcement);

    // Auto dismiss
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, notification.duration);
      return () => clearTimeout(timer);
    }

    // Call onShow callback
    notification.onShow?.();
  }, []);

  const handleDismiss = () => {
    translateY.value = withSpring(
      position === 'top' ? -200 : 200,
      { damping: 20, stiffness: 300 }
    );
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.8, { duration: 200 }, () => {
      runOnJS(onDismiss)(notification.id);
      runOnJS(() => notification.onDismiss?.())();
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const getNotificationStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: tokens.BorderRadius['2xl'],
      padding: tokens.Spacing.lg,
      marginHorizontal: tokens.Spacing.md,
      marginVertical: tokens.Spacing.xs,
      ...tokens.Shadows.lg,
      flexDirection: 'row',
      alignItems: 'flex-start',
    };

    let backgroundColor = colors.background.elevated;
    let borderColor = colors.border.light;

    switch (notification.type) {
      case 'success':
        backgroundColor = colors.status.successBackground;
        borderColor = colors.status.success;
        break;
      case 'error':
        backgroundColor = colors.status.errorBackground;
        borderColor = colors.status.error;
        break;
      case 'warning':
        backgroundColor = colors.status.warningBackground;
        borderColor = colors.status.warning;
        break;
      case 'info':
        backgroundColor = colors.status.infoBackground;
        borderColor = colors.status.info;
        break;
    }

    return {
      ...baseStyle,
      backgroundColor,
      borderWidth: 1,
      borderColor,
    };
  };

  const getIconName = (): any => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case 'success': return 'Check';
      case 'error': return 'X';
      case 'warning': return 'Circle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case 'success': return colors.status.success;
      case 'error': return colors.status.error;
      case 'warning': return colors.status.warning;
      case 'info': return colors.status.info;
      default: return colors.text.secondary;
    }
  };

  return (
    <Animated.View 
      style={[animatedStyle, getNotificationStyles()]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={notification.accessibilityLabel}
    >
      {/* Icon */}
      <View style={{ marginRight: tokens.Spacing.md }}>
        <Icon 
          name={getIconName()}
          size="md"
          color={getIconColor()}
          accessibilityElementsHidden={true}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text 
          variant="titleSmall" 
          color="primary" 
          weight="semibold"
          style={{ marginBottom: notification.message ? tokens.Spacing.xs : 0 }}
          accessibilityElementsHidden={true}
        >
          {notification.title}
        </Text>
        
        {notification.message && (
          <Text 
            variant="bodyMedium" 
            color="secondary"
            style={{ marginBottom: notification.actions?.length ? tokens.Spacing.md : 0 }}
            accessibilityElementsHidden={true}
          >
            {notification.message}
          </Text>
        )}

        {/* Actions */}
        {notification.actions && notification.actions.length > 0 && (
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap',
            marginTop: tokens.Spacing.sm,
            gap: tokens.Spacing.sm,
          }}>
            {notification.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'secondary'}
                size="small"
                onPress={() => {
                  action.onPress();
                  handleDismiss();
                }}
                leftIcon={action.icon ? (
                  <Icon name={action.icon as any} size="xs" />
                ) : undefined}
                accessibilityElementsHidden={true}
              >
                {action.label}
              </Button>
            ))}
          </View>
        )}
      </View>

      {/* Dismiss Button */}
      {notification.dismissible !== false && (
        <Button
          variant="tertiary"
          size="small"
          onPress={handleDismiss}
          leftIcon={<Icon name="X" size="xs" />}
          style={{ marginLeft: tokens.Spacing.sm }}
          accessibilityLabel="Dismiss notification"
          accessibilityElementsHidden={true}
        >{''}</Button>
      )}
    </Animated.View>
  );
};

// ============================================================================
// NOTIFICATION PROVIDER
// ============================================================================

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
}) => {
  const [notifications, setNotifications] = useState<(NotificationConfig & { id: string })[]>([]);
  
  const show = (config: NotificationConfig): string => {
    const id = config.id || Date.now().toString() + Math.random().toString(36);
    const notification = { ...config, id };
    
    setNotifications(prev => {
      const updated = [notification, ...prev];
      // Limit number of notifications
      return updated.slice(0, maxNotifications);
    });
    
    return id;
  };

  const hide = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const hideAll = () => {
    setNotifications([]);
  };

  const update = (id: string, config: Partial<NotificationConfig>) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, ...config } : n
      )
    );
  };

  const contextValue: NotificationContextType = {
    show,
    hide,
    hideAll,
    update,
  };

  // Group notifications by position
  const topNotifications = notifications.filter(n => (n.position || 'top') === 'top');
  const bottomNotifications = notifications.filter(n => (n.position || 'top') === 'bottom');
  const centerNotifications = notifications.filter(n => (n.position || 'top') === 'center');

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Top Notifications */}
      {topNotifications.length > 0 && (
        <View style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 50 : 20,
          left: 0,
          right: 0,
          zIndex: 9999,
          pointerEvents: 'box-none',
        }}>
          <SafeAreaView>
            {topNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDismiss={hide}
                position="top"
                style={notification.style || 'toast'}
              />
            ))}
          </SafeAreaView>
        </View>
      )}

      {/* Bottom Notifications */}
      {bottomNotifications.length > 0 && (
        <View style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 90 : 20,
          left: 0,
          right: 0,
          zIndex: 9999,
          pointerEvents: 'box-none',
        }}>
          {bottomNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={hide}
              position="bottom"
              style={notification.style || 'toast'}
            />
          ))}
        </View>
      )}

      {/* Center Notifications (Modal style) */}
      {centerNotifications.length > 0 && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          {centerNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={hide}
              position="center"
              style={notification.style || 'modal'}
            />
          ))}
        </View>
      )}
    </NotificationContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

export const useToast = () => {
  const { show } = useNotifications();
  
  return {
    success: (title: string, message?: string, options?: Partial<NotificationConfig>) =>
      show({ type: 'success', title, message, duration: 4000, ...options }),
      
    error: (title: string, message?: string, options?: Partial<NotificationConfig>) =>
      show({ type: 'error', title, message, duration: 6000, ...options }),
      
    warning: (title: string, message?: string, options?: Partial<NotificationConfig>) =>
      show({ type: 'warning', title, message, duration: 5000, ...options }),
      
    info: (title: string, message?: string, options?: Partial<NotificationConfig>) =>
      show({ type: 'info', title, message, duration: 4000, ...options }),
      
    custom: (config: NotificationConfig) => show(config),
  };
};

export default {
  NotificationProvider,
  useNotifications,
  useToast,
};