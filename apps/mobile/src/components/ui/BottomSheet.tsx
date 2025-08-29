/**
 * Modern Bottom Sheet Component
 * Premium bottom sheet with 2025 design standards
 * Replaces Alert.alert with modern slide-up interface
 */

import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, ViewStyle, BackHandler } from 'react-native';
import BottomSheet, { 
  BottomSheetView, 
  BottomSheetBackdrop,
  BottomSheetHandle,
  BottomSheetBackdropProps 
} from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import Text from './Text';
import Button from './Button';
import Icon from './Icon';

// ============================================================================
// TYPES
// ============================================================================

interface ActionSheetAction {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'destructive' | 'cancel';
  icon?: string;
  disabled?: boolean;
}

interface BottomSheetProps {
  title?: string;
  message?: string;
  actions?: ActionSheetAction[];
  children?: React.ReactNode;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  enableBackdropDismiss?: boolean;
  onClose?: () => void;
  style?: ViewStyle;
}

// ============================================================================
// BACKDROP COMPONENT
// ============================================================================

const CustomBackdrop = (props: BottomSheetBackdropProps) => {
  const colors = useColors();
  
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      style={[
        props.style,
        { backgroundColor: colors.background.overlay }
      ]}
    />
  );
};

// ============================================================================
// HANDLE COMPONENT
// ============================================================================

const CustomHandle = (props: any) => {
  const colors = useColors();
  const tokens = useTokens();
  
  return (
    <BottomSheetHandle
      {...props}
      style={{
        backgroundColor: colors.background.elevated,
        borderTopLeftRadius: tokens.BorderRadius['3xl'],
        borderTopRightRadius: tokens.BorderRadius['3xl'],
      }}
      indicatorStyle={{
        backgroundColor: colors.border.medium,
        width: 40,
        height: 4,
      }}
    />
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ModernBottomSheet = forwardRef<BottomSheet, BottomSheetProps>(({
  title,
  message,
  actions = [],
  children,
  snapPoints = ['25%', '50%'],
  enablePanDownToClose = true,
  enableBackdropDismiss = true,
  onClose,
  style,
}, ref) => {
  const colors = useColors();
  const tokens = useTokens();

  // Memoize snap points
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  // Handle sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose?.();
    }
    
    // Haptic feedback on sheet movement
    if (index >= 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [onClose]);

  // Handle back button on Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (ref && typeof ref === 'object' && ref.current) {
          ref.current.close();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription?.remove();
    }, [ref])
  );

  // Handle backdrop press
  const handleBackdropPress = useCallback(() => {
    if (enableBackdropDismiss && ref && typeof ref === 'object' && ref.current) {
      ref.current.close();
    }
  }, [enableBackdropDismiss, ref]);

  // Render action button
  const renderAction = (action: ActionSheetAction, index: number) => {
    let buttonVariant: 'primary' | 'secondary' | 'danger' = 'secondary';
    
    if (action.variant === 'destructive') {
      buttonVariant = 'danger';
    } else if (action.variant === 'cancel') {
      buttonVariant = 'secondary';
    } else if (index === 0 && actions.length > 1) {
      buttonVariant = 'primary';
    }

    return (
      <Button
        key={action.title}
        variant={buttonVariant}
        size="large"
        fullWidth
        disabled={action.disabled}
        leftIcon={action.icon ? <Icon name={action.icon as any} size="sm" /> : undefined}
        onPress={() => {
          action.onPress();
          if (ref && typeof ref === 'object' && ref.current) {
            ref.current.close();
          }
        }}
        style={{ marginBottom: tokens.Spacing.md }}
      >
        {action.title}
      </Button>
    );
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose={enablePanDownToClose}
      backdropComponent={CustomBackdrop}
      handleComponent={CustomHandle}
      onChange={handleSheetChanges}
      backgroundStyle={{
        backgroundColor: colors.background.elevated,
      }}
      style={style}
    >
      <BottomSheetView style={{
        flex: 1,
        paddingHorizontal: tokens.Spacing.lg,
        paddingBottom: tokens.Spacing.lg,
      }}>
        {/* Header */}
        {(title || message) && (
          <View style={{ marginBottom: tokens.Spacing.lg }}>
            {title && (
              <Text
                variant="titleLarge"
                color="primary"
                align="center"
                style={{ marginBottom: message ? tokens.Spacing.sm : 0 }}
              >
                {title}
              </Text>
            )}
            {message && (
              <Text
                variant="bodyMedium"
                color="secondary"
                align="center"
              >
                {message}
              </Text>
            )}
          </View>
        )}

        {/* Custom children content */}
        {children && (
          <View style={{ marginBottom: actions.length > 0 ? tokens.Spacing.lg : 0 }}>
            {children}
          </View>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <View style={{ marginTop: 'auto' }}>
            {actions.map(renderAction)}
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

ModernBottomSheet.displayName = 'ModernBottomSheet';

// ============================================================================
// ACTION SHEET HOOK
// ============================================================================

export const useActionSheet = () => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const show = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const hide = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const ActionSheet = useCallback((props: Omit<BottomSheetProps, 'ref'>) => (
    <ModernBottomSheet ref={bottomSheetRef} {...props} />
  ), []);

  return {
    show,
    hide,
    ActionSheet,
  };
};

export default ModernBottomSheet;