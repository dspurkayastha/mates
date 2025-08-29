/**
 * GlassModal Component
 * iOS 26 glass modal with glassmorphism effects
 * Features translucent overlays, smooth animations, and proper accessibility
 */

import React, { useEffect } from 'react';
import {
  Modal,
  ModalProps,
  View,
  ViewStyle,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors, useTokens, withOpacity } from '../../design-system/ThemeProvider';
import GlassView from './GlassView';

// ============================================================================
// TYPES
// ============================================================================

type GlassModalSize = 'small' | 'medium' | 'large' | 'fullscreen';
type GlassModalPosition = 'center' | 'bottom' | 'top';

interface GlassModalProps extends Omit<ModalProps, 'children'> {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: GlassModalSize;
  position?: GlassModalPosition;
  glassIntensity?: 'ultraThin' | 'thin' | 'regular' | 'thick';
  dismissOnBackdropPress?: boolean;
  dismissOnSwipe?: boolean;
  hapticFeedback?: boolean;
  showHandle?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const GlassModal: React.FC<GlassModalProps> = ({
  visible,
  onClose,
  children,
  size = 'medium',
  position = 'center',
  glassIntensity = 'regular',
  dismissOnBackdropPress = true,
  dismissOnSwipe = true,
  hapticFeedback = true,
  showHandle = false,
  style,
  contentStyle,
  accessibilityLabel,
  testID,
  ...props
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const insets = useSafeAreaInsets();
  const isDark = colors.background.primary === tokens.BaseColors.neutral[950];
  
  // Screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Animation values
  const backdropOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.8);
  const modalTranslateY = useSharedValue(screenHeight);
  const modalOpacity = useSharedValue(0);
  
  // iOS 26 Spring animation
  const springConfig = tokens.SpringAnimations.modal;
  
  // Get modal dimensions based on size
  const getModalDimensions = () => {
    const maxWidth = screenWidth * 0.9;
    const maxHeight = screenHeight * 0.8;
    
    switch (size) {
      case 'small':
        return {
          width: Math.min(300, maxWidth),
          maxHeight: maxHeight * 0.5,
        };
      case 'large':
        return {
          width: Math.min(500, maxWidth),
          maxHeight: maxHeight,
        };
      case 'fullscreen':
        return {
          width: screenWidth,
          maxHeight: screenHeight,
        };
      default: // medium
        return {
          width: Math.min(400, maxWidth),
          maxHeight: maxHeight * 0.7,
        };
    }
  };
  
  const modalDimensions = getModalDimensions();
  
  // Get initial position for animations
  const getInitialPosition = () => {
    switch (position) {
      case 'top':
        return -screenHeight;
      case 'bottom':
        return screenHeight;
      default: // center
        return 0;
    }
  };
  
  // Show modal animation
  const showModal = () => {
    backdropOpacity.value = withTiming(1, { duration: 200 });
    modalOpacity.value = withTiming(1, { duration: 200 });
    
    if (position === 'center') {
      modalScale.value = withSpring(1, springConfig);
    } else {
      modalTranslateY.value = withSpring(0, springConfig);
    }
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Hide modal animation
  const hideModal = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    modalOpacity.value = withTiming(0, { duration: 200 });
    
    if (position === 'center') {
      modalScale.value = withSpring(0.8, springConfig);
    } else {
      modalTranslateY.value = withSpring(getInitialPosition(), springConfig);
    }
    
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);
  
  // Handle backdrop press
  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      onClose();
    }
  };
  
  // Animated styles
  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });
  
  const animatedModalStyle = useAnimatedStyle(() => {
    if (position === 'center') {
      return {
        opacity: modalOpacity.value,
        transform: [{ scale: modalScale.value }],
      };
    }
    
    return {
      opacity: modalOpacity.value,
      transform: [{ translateY: modalTranslateY.value }],
    };
  });
  
  // Container styles
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      justifyContent: position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center',
      alignItems: 'center',
      paddingTop: position === 'top' ? insets.top : 0,
      paddingBottom: position === 'bottom' ? insets.bottom : 0,
    };
    
    if (size === 'fullscreen') {
      return {
        ...baseStyle,
        paddingHorizontal: 0,
      };
    }
    
    return {
      ...baseStyle,
      paddingHorizontal: tokens.Spacing.lg,
    };
  };
  
  // Modal content styles
  const getModalContentStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      maxWidth: modalDimensions.width,
      maxHeight: modalDimensions.maxHeight,
      borderRadius: size === 'fullscreen' ? 0 : tokens.BorderRadius['3xl'],
      overflow: 'hidden',
    };
    
    if (position === 'bottom') {
      return {
        ...baseStyle,
        width: '100%',
        borderTopLeftRadius: tokens.BorderRadius['3xl'],
        borderTopRightRadius: tokens.BorderRadius['3xl'],
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      };
    }
    
    if (position === 'top') {
      return {
        ...baseStyle,
        width: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: tokens.BorderRadius['3xl'],
        borderBottomRightRadius: tokens.BorderRadius['3xl'],
      };
    }
    
    return baseStyle;
  };
  
  const containerStyle = getContainerStyle();
  const modalContentStyle = getModalContentStyle();
  
  // Handle component
  const renderHandle = () => {
    if (!showHandle || position === 'center') return null;
    
    return (
      <View
        style={{
          alignItems: 'center',
          paddingVertical: tokens.Spacing.sm,
        }}
      >
        <View
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: withOpacity(colors.text.tertiary, 0.5),
          }}
        />
      </View>
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      {...props}
    >
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isDark 
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(0, 0, 0, 0.4)',
            },
            animatedBackdropStyle,
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={handleBackdropPress}
            activeOpacity={1}
          />
        </Animated.View>
        
        {/* Modal Container */}
        <View style={[containerStyle, style]} pointerEvents="box-none">
          <Animated.View
            style={[animatedModalStyle]}
            accessible={true}
            accessibilityRole="dialog"
            accessibilityLabel={accessibilityLabel}
            testID={testID}
          >
            <GlassView
              intensity={glassIntensity}
              tint={isDark ? 'dark' : 'light'}
              style={[modalContentStyle, contentStyle]}
              shadowEnabled
              shadowIntensity="strong"
            >
              {renderHandle()}
              {children}
            </GlassView>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default GlassModal;