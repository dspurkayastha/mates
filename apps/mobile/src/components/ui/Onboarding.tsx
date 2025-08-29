/**
 * Interactive Onboarding Flow
 * Modern onboarding experience with tutorials and animations
 * 2025 design standards with step-by-step guidance
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  ViewStyle,
  Dimensions,
  ScrollView,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors, useTokens } from '../../design-system/ThemeProvider';
import { generateAccessibilityLabel, focusManager } from '../../utils/accessibility';
import Text from './Text';
import Button from './Button';
import Card from './Card';
import Icon from './Icon';

// ============================================================================
// TYPES
// ============================================================================

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  illustration?: React.ReactNode;
  highlightElement?: string; // CSS selector or component ref
  actions?: {
    primary?: {
      label: string;
      onPress: () => void;
    };
    secondary?: {
      label: string;
      onPress: () => void;
    };
  };
  skippable?: boolean;
  autoAdvance?: number; // Auto advance after X milliseconds
}

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  isActive: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  startOnboarding: (steps: OnboardingStep[]) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = '@mates_app_onboarding_completed';

// ============================================================================
// ONBOARDING STEP COMPONENT
// ============================================================================

interface OnboardingStepComponentProps {
  step: OnboardingStep;
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  currentIndex: number;
  totalSteps: number;
}

const OnboardingStepComponent: React.FC<OnboardingStepComponentProps> = ({
  step,
  isActive,
  onNext,
  onPrevious,
  onSkip,
  currentIndex,
  totalSteps,
}) => {
  const colors = useColors();
  const tokens = useTokens();
  const opacity = useSharedValue(isActive ? 1 : 0);
  const translateY = useSharedValue(isActive ? 0 : 50);
  const scale = useSharedValue(isActive ? 1 : 0.9);

  useEffect(() => {
    if (isActive) {
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      scale.value = withSpring(1, { damping: 20, stiffness: 150 });
      
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Announce step to screen reader
      focusManager.announcePageChange(`Onboarding step ${currentIndex + 1} of ${totalSteps}: ${step.title}`);
      
      // Auto advance if specified
      if (step.autoAdvance) {
        setTimeout(() => {
          onNext();
        }, step.autoAdvance);
      }
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(50, { duration: 300 });
      scale.value = withTiming(0.9, { duration: 300 });
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  if (!isActive) return null;

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: tokens.Spacing['2xl'],
        },
        animatedStyle,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={generateAccessibilityLabel.status('onboarding', `Step ${currentIndex + 1}: ${step.title}. ${step.description}`)}
    >
      {/* Illustration */}
      {step.illustration && (
        <View
          style={{
            marginBottom: tokens.Spacing['3xl'],
            alignItems: 'center',
          }}
          accessibilityElementsHidden={true}
        >
          {step.illustration}
        </View>
      )}

      {/* Title */}
      <Text
        variant="headlineLarge"
        color="primary"
        weight="bold"
        align="center"
        style={{
          marginBottom: tokens.Spacing.lg,
          maxWidth: 300,
        }}
        accessibilityRole="header"
      >
        {step.title}
      </Text>

      {/* Description */}
      <Text
        variant="bodyLarge"
        color="secondary"
        align="center"
        style={{
          marginBottom: tokens.Spacing['3xl'],
          maxWidth: 280,
          lineHeight: tokens.Typography.body.large.lineHeight * 1.3,
        }}
      >
        {step.description}
      </Text>

      {/* Progress Indicator */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: tokens.Spacing['2xl'],
          gap: tokens.Spacing.sm,
        }}
        accessibilityRole="progressbar"
        accessibilityLabel={`Step ${currentIndex + 1} of ${totalSteps}`}
        accessibilityValue={{ now: currentIndex + 1, min: 1, max: totalSteps }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={{
              width: index === currentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index <= currentIndex 
                ? colors.interactive.primary 
                : colors.border.light,
            }}
          />
        ))}
      </View>

      {/* Actions */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.Spacing.md,
          width: '100%',
          maxWidth: 300,
        }}
        accessibilityRole="none"
        accessibilityLabel="Onboarding navigation"
      >
        {/* Previous Button */}
        {currentIndex > 0 && (
          <Button
            variant="secondary"
            size="large"
            onPress={onPrevious}
            leftIcon={<Icon name="ArrowLeft" size="sm" />}
            style={{ flex: 1 }}
            accessibilityHint="Go to previous step"
          >
            Previous
          </Button>
        )}

        {/* Skip Button */}
        {step.skippable !== false && currentIndex < totalSteps - 1 && (
          <Button
            variant="tertiary"
            size="large"
            onPress={onSkip}
            style={{ flex: currentIndex === 0 ? 1 : 0.5 }}
            accessibilityHint="Skip onboarding tutorial"
          >
            Skip
          </Button>
        )}

        {/* Next/Complete Button */}
        <Button
          variant="primary"
          size="large"
          onPress={step.actions?.primary?.onPress || onNext}
          rightIcon={
            currentIndex === totalSteps - 1 
              ? <Icon name="Check" size="sm" color="inverse" />
              : <Icon name="ArrowRight" size="sm" color="inverse" />
          }
          style={{ flex: 1 }}
          gradient
          accessibilityHint={
            currentIndex === totalSteps - 1 
              ? "Complete onboarding" 
              : "Go to next step"
          }
        >
          {step.actions?.primary?.label || 
           (currentIndex === totalSteps - 1 ? "Get Started" : "Next")}
        </Button>
      </View>
    </Animated.View>
  );
};

// ============================================================================
// SWIPEABLE ONBOARDING CONTAINER
// ============================================================================

interface SwipeableOnboardingProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const SwipeableOnboarding: React.FC<SwipeableOnboardingProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const translateX = useSharedValue(0);
  const colors = useColors();
  const tokens = useTokens();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startX: number }) => {
      context.startX = translateX.value;
    },
    onActive: (event, context: { startX: number }) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const threshold = screenWidth * 0.2;
      
      if (event.translationX > threshold && currentStep > 0) {
        // Swipe right - go to previous step
        translateX.value = withSpring(0);
        runOnJS(setCurrentStep)(currentStep - 1);
      } else if (event.translationX < -threshold && currentStep < steps.length - 1) {
        // Swipe left - go to next step
        translateX.value = withSpring(0);
        runOnJS(setCurrentStep)(currentStep + 1);
      } else {
        // Snap back
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary]}
        style={{ flex: 1 }}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            {steps.map((step, index) => (
              <OnboardingStepComponent
                key={step.id}
                step={step}
                isActive={index === currentStep}
                onNext={nextStep}
                onPrevious={previousStep}
                onSkip={onSkip}
                currentIndex={index}
                totalSteps={steps.length}
              />
            ))}
          </Animated.View>
        </PanGestureHandler>
      </LinearGradient>
    </View>
  );
};

// ============================================================================
// ONBOARDING PROVIDER
// ============================================================================

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);

  const startOnboarding = (onboardingSteps: OnboardingStep[]) => {
    setSteps(onboardingSteps);
    setTotalSteps(onboardingSteps.length);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const skipOnboarding = async () => {
    setIsActive(false);
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'skipped');
    } catch (error) {
      console.warn('Failed to save onboarding state:', error);
    }
  };

  const completeOnboarding = async () => {
    setIsActive(false);
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'completed');
      focusManager.announceSuccess('Onboarding completed successfully');
    } catch (error) {
      console.warn('Failed to save onboarding state:', error);
    }
  };

  const contextValue: OnboardingContextType = {
    currentStep,
    totalSteps,
    isActive,
    nextStep,
    previousStep,
    goToStep,
    skipOnboarding,
    completeOnboarding,
    startOnboarding,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      {isActive && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
          }}
        >
          <SwipeableOnboarding
            steps={steps}
            onComplete={completeOnboarding}
            onSkip={skipOnboarding}
          />
        </View>
      )}
    </OnboardingContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const useOnboardingCheck = () => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
        setShouldShowOnboarding(!status); // Show if no status (first time)
      } catch (error) {
        console.warn('Failed to check onboarding status:', error);
        setShouldShowOnboarding(true); // Default to showing onboarding
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  return { shouldShowOnboarding, isLoading };
};

// ============================================================================
// PRESET ONBOARDING FLOWS
// ============================================================================

export const createExpenseOnboarding = (): OnboardingStep[] => [
  {
    id: 'welcome',
    title: 'Welcome to Mates!',
    description: 'Manage shared expenses with your roommates easily and fairly.',
    illustration: (
      <Icon name="House" size="2xl" color="brand" />
    ),
    skippable: true,
  },
  {
    id: 'add_expense',
    title: 'Track Expenses',
    description: 'Add expenses and split them automatically among roommates.',
    illustration: (
      <Icon name="DollarSign" size="2xl" color="success" />
    ),
  },
  {
    id: 'settle_up',
    title: 'Settle Up',
    description: 'Keep track of who owes what and settle up when ready.',
    illustration: (
      <Icon name="Check" size="2xl" color="success" />
    ),
  },
  {
    id: 'get_started',
    title: 'Ready to Start!',
    description: "You're all set to start managing expenses with your roommates.",
    illustration: (
      <Icon name="Users" size="2xl" color="brand" />
    ),
    actions: {
      primary: {
        label: 'Start Using Mates',
        onPress: () => console.log('Onboarding completed'),
      },
    },
  },
];

export default {
  OnboardingProvider,
  useOnboarding,
  useOnboardingCheck,
  createExpenseOnboarding,
};