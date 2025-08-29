import React, { useState } from 'react';
import { View } from 'react-native';
import { 
  Text, 
  GlassButton, 
  Icon,
  useColors,
  useTokens 
} from '@/components/ui';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

// Premium Floating Action Menu Component
const FloatingActionMenu = ({ onAddExpense, onAddGrocery, onAddChore, onCreatePoll }) => {
  const colors = useColors();
  const tokens = useTokens();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const animation = useSharedValue(0);
  const rotation = useSharedValue(0);
  
  const toggleMenu = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    Haptics.impactAsync(
      newState ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    );
    
    animation.value = withSpring(newState ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
    
    rotation.value = withTiming(newState ? 45 : 0, {
      duration: 200,
    });
  };
  
  const mainButtonStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 45], [0, 45]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });
  
  const menuItem0Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      animation.value,
      [0, 1],
      [0, -(60 * 1 + 10 * 0)]
    );
    const opacity = interpolate(animation.value, [0, 0.3, 1], [0, 0, 1]);
    const scale = interpolate(animation.value, [0, 1], [0.3, 1]);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });
  
  const menuItem1Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      animation.value,
      [0, 1],
      [0, -(60 * 2 + 10 * 1)]
    );
    const opacity = interpolate(animation.value, [0, 0.3, 1], [0, 0, 1]);
    const scale = interpolate(animation.value, [0, 1], [0.3, 1]);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });
  
  const menuItem2Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      animation.value,
      [0, 1],
      [0, -(60 * 3 + 10 * 2)]
    );
    const opacity = interpolate(animation.value, [0, 0.3, 1], [0, 0, 1]);
    const scale = interpolate(animation.value, [0, 1], [0.3, 1]);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });
  
  const menuItem3Style = useAnimatedStyle(() => {
    const translateY = interpolate(
      animation.value,
      [0, 1],
      [0, -(60 * 4 + 10 * 3)]
    );
    const opacity = interpolate(animation.value, [0, 0.3, 1], [0, 0, 1]);
    const scale = interpolate(animation.value, [0, 1], [0.3, 1]);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });
  
  const menuStyles = [menuItem0Style, menuItem1Style, menuItem2Style, menuItem3Style];
  
  const menuItems = [
    { icon: 'DollarSign', label: 'Expense', onPress: onAddExpense, color: 'primary' },
    { icon: 'ShoppingCart', label: 'Grocery', onPress: onAddGrocery, color: 'success' },
    { icon: 'SquareCheck', label: 'Chore', onPress: onAddChore, color: 'warning' },
    { icon: 'Vote', label: 'Poll', onPress: onCreatePoll, color: 'info' },
  ];
  
  return (
    <View style={{
      position: 'absolute',
      bottom: tokens.Spacing['4xl'],
      right: tokens.Spacing.xl,
      alignItems: 'center',
    }}>
      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <Animated.View
          key={item.label}
          style={[
            menuStyles[index],
            {
              position: 'absolute',
              bottom: 0,
              alignItems: 'center',
              flexDirection: 'row',
            }
          ]}
        >
          <View style={{
            backgroundColor: colors.background.elevated,
            paddingHorizontal: tokens.Spacing.md,
            paddingVertical: tokens.Spacing.sm,
            borderRadius: tokens.BorderRadius.lg,
            marginRight: tokens.Spacing.sm,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}>
            <Text variant="labelMedium" weight="medium">
              {item.label}
            </Text>
          </View>
          <GlassButton
            variant={item.color}
            buttonStyle="tinted"
            size="medium"
            onPress={() => {
              toggleMenu();
              setTimeout(() => item.onPress(), 100);
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              padding: 0,
            }}
          >
            <Icon name={item.icon} size="md" color="inverse" />
          </GlassButton>
        </Animated.View>
      ))}
      
      {/* Main FAB */}
      <Animated.View style={mainButtonStyle}>
        <GlassButton
          variant="primary"
          buttonStyle="tinted"
          size="large"
          onPress={toggleMenu}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            padding: 0,
          }}
        >
          <Icon 
            name="Plus" 
            size="lg" 
            color="inverse"
          />
        </GlassButton>
      </Animated.View>
    </View>
  );
};

export default FloatingActionMenu;