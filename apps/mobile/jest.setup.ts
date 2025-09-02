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
  useAnimatedStyle: (fn: any) => fn(),
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
jest.mock('@/components/ui/SafeBlur', () => ({
  __esModule: true,
  BlurView: require('react-native').View,
  default: require('react-native').View,
}));
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
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
    Stop: component(),
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
