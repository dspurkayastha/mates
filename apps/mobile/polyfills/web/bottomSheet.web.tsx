/**
 * Bottom Sheet Web Polyfill
 * Provides web-compatible implementation of @gorhom/bottom-sheet
 */

import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

// Mock types to match the original library
export interface BottomSheetBackdropProps {
  style?: ViewStyle;
  disappearsOnIndex?: number;
  appearsOnIndex?: number;
}

export interface BottomSheetMethods {
  close: () => void;
  expand: () => void;
  collapse: () => void;
  snapToIndex: (index: number) => void;
}

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints: string[];
  index?: number;
  enablePanDownToClose?: boolean;
  onChange?: (index: number) => void;
  backdropComponent?: React.ComponentType<BottomSheetBackdropProps>;
  handleComponent?: React.ComponentType;
  backgroundStyle?: ViewStyle;
  style?: ViewStyle;
}

// Web implementation using CSS transforms and animations
const BottomSheet = forwardRef<BottomSheetMethods, BottomSheetProps>(({
  children,
  snapPoints,
  index = -1,
  enablePanDownToClose = true,
  onChange,
  backdropComponent: BackdropComponent,
  handleComponent: HandleComponent,
  backgroundStyle,
  style,
}, ref) => {
  const [isVisible, setIsVisible] = useState(index >= 0);
  const [currentIndex, setCurrentIndex] = useState(index);
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    close: () => {
      animateToIndex(-1);
    },
    expand: () => {
      animateToIndex(snapPoints.length - 1);
    },
    collapse: () => {
      animateToIndex(0);
    },
    snapToIndex: (targetIndex: number) => {
      animateToIndex(targetIndex);
    },
  }));

  const animateToIndex = (targetIndex: number) => {
    const screenHeight = Dimensions.get('window').height;
    let targetTranslateY = screenHeight;

    if (targetIndex >= 0 && targetIndex < snapPoints.length) {
      const snapPoint = snapPoints[targetIndex];
      const percentage = parseInt(snapPoint.replace('%', '')) / 100;
      targetTranslateY = screenHeight * (1 - percentage);
    }

    setCurrentIndex(targetIndex);
    setIsVisible(targetIndex >= 0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: targetTranslateY,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: targetIndex >= 0 ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onChange?.(targetIndex);
    });
  };

  useEffect(() => {
    animateToIndex(index);
  }, [index]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      const screenHeight = Dimensions.get('window').height;
      const currentTranslateY = screenHeight * (1 - parseInt(snapPoints[currentIndex]?.replace('%', '') || '0') / 100);
      const newTranslateY = Math.max(currentTranslateY + gestureState.dy, 0);
      translateY.setValue(newTranslateY);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (enablePanDownToClose && gestureState.dy > 100) {
        animateToIndex(-1);
      } else {
        animateToIndex(currentIndex);
      }
    },
  });

  if (!isVisible && currentIndex === -1) {
    return null;
  }

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    }}>
      {/* Backdrop */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: backdropOpacity,
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => animateToIndex(-1)}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            minHeight: '25%',
            transform: [{ translateY }],
          },
          backgroundStyle,
          style,
        ]}
        {...panResponder.panHandlers}
      >
        {HandleComponent && <HandleComponent />}
        <View style={{ flex: 1 }}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
});

export default BottomSheet;

// Mock exports for other components
export const BottomSheetView: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => (
  <View style={style}>{children}</View>
);

export const BottomSheetBackdrop: React.FC<BottomSheetBackdropProps> = ({ style }) => (
  <View style={[{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }, style]} />
);

export const BottomSheetHandle: React.FC<{ style?: ViewStyle; indicatorStyle?: ViewStyle }> = ({ 
  style, 
  indicatorStyle 
}) => (
  <View style={[{ alignItems: 'center', paddingVertical: 10 }, style]}>
    <View style={[
      { 
        width: 40, 
        height: 4, 
        backgroundColor: '#ccc', 
        borderRadius: 2 
      }, 
      indicatorStyle
    ]} />
  </View>
);