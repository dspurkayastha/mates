import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    createAnimatedComponent: (Component: any) => Component,
    addWhitelistedUIProps: () => {},
    View: require('react-native').View,
  },
  createAnimatedComponent: (Component: any) => Component,
  addWhitelistedUIProps: () => {},
  View: require('react-native').View,
  useSharedValue: () => ({ value: 1 }),
  withTiming: (value: any) => value,
  withSequence: (...args: any[]) => args[args.length - 1],
  useAnimatedStyle: (fn: any) => fn(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interpolate: (value: any, _input: any, output: any) => output[output.length - 1],
  Easing: {
    linear: (t: any) => t,
    out: (fn: any) => fn,
    inOut: (fn: any) => fn,
    bezier: () => (t: any) => t,
  },
}));
(global as any).ReanimatedDataMock = { now: () => Date.now() };

const mockAccessibilityInfo = {
  isScreenReaderEnabled: jest.fn().mockResolvedValue(false),
  isReduceMotionEnabled: jest.fn().mockResolvedValue(false),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
};
jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => mockAccessibilityInfo,
);
// Ensure React Native exports use the same mock
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('react-native').AccessibilityInfo = mockAccessibilityInfo;
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('expo-linear-gradient', () => require('react-native').View);
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('expo-blur', () => ({ BlurView: require('react-native').View }));
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock @react-navigation/native to avoid parsing its ESM build in Jest
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    useFocusEffect: (effect: any) => {
      React.useEffect(() => {
        const cleanup = typeof effect === 'function' ? effect() : undefined;
        return typeof cleanup === 'function' ? cleanup : undefined;
      }, []);
    },
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    }),
    NavigationContainer: View,
  };
});

// Mock SceneBackground hooks/context used by screens
jest.mock('@/components/ui/background/useSceneBackground', () => {
  const React = require('react');
  return {
    __esModule: true,
    SceneBackgroundProvider: ({ children }: any) =>
      React.createElement(React.Fragment, null, children),
    useSceneBackground: () => ({ value: 0 }),
    useSceneBackgroundContext: () => ({
      theme: null,
      version: 0,
      register: jest.fn(),
      sceneTransition: { value: 0 },
    }),
    useWatercolorDefaults: () => ({
      swirl: {
        overshoot: 0.04,
        staggerMs: 40,
        durationInMs: 220,
        durationOutMs: 240,
      },
      opacity: 0.08,
    }),
  };
});
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Svg = (props: any) => React.createElement(View, props);
  const component = () => (props: any) => React.createElement(View, props);
  return {
    __esModule: true,
    default: Svg,
    Svg,
    Path: component(),
    Rect: component(),
    Defs: component(),
    LinearGradient: component(),
    RadialGradient: component(),
    Stop: component(),
    Circle: component(),
    Pattern: component(),
    G: component(),
    ClipPath: component(),
  };
});
try {
  jest.mock('expo-router', () => ({
    useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
    Link: require('react-native').View,
    Stack: { Screen: require('react-native').View },
  }));
} catch {}

// Mock safe area context with zero insets
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: any) => React.createElement(View, null, children),
    SafeAreaView: ({ children }: any) => React.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    SafeAreaConsumer: ({ children }: any) => children({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// Mock lucide-react-native icons
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  const proxy = new Proxy(
    {},
    {
      get: () => View,
    },
  );
  return new Proxy(
    { __esModule: true, icons: proxy },
    {
      get: (target, prop) => (prop in target ? (target as any)[prop] : View),
    },
  );
});

// Mock expo-haptics to no-ops
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock background orchestrator to a plain View
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('@/components/ui/background/BackgroundOrchestrator', () => require('react-native').View);

// Silence not wrapped in act warnings
const originalError = console.error;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
    return;
  }
  originalError(...args);
};
