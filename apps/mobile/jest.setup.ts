import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});
(global as any).ReanimatedDataMock = { now: () => Date.now() };
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('expo-linear-gradient', () => require('react-native').View);
// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('expo-blur', () => ({ BlurView: require('react-native').View }));
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
