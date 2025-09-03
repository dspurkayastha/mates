import React from 'react';
import { render } from '../test-utils';
import * as Reanimated from 'react-native-reanimated';

const BackgroundOrchestrator = jest.requireActual(
  '@/components/ui/background/BackgroundOrchestrator',
).default;

jest.mock('@/components/ui/background/useSceneBackground', () => {
  const actual = jest.requireActual('@/components/ui/background/useSceneBackground');
  return {
    ...actual,
    useSceneBackgroundContext: () => ({
      theme: {
        key: 't',
        gradient: { type: 'linear', stops: ['#000', '#111'] },
        shapes: [],
        vignette: true,
        swirl: actual.useWatercolorDefaults('light').swirl,
      },
      version: 1,
      register: jest.fn(),
      sceneTransition: { value: 0 },
    }),
  };
});

jest.mock('@/components/ui', () => {
  const actual = jest.requireActual('@/components/ui');
  return {
    ...actual,
    useTheme: () => ({
      theme: {
        background: { primary: '#fff', secondary: '#fff', overlay: '#fff' },
        interactive: { primary: '#000' },
        text: { brand: '#000' },
      },
      accessibility: { isReduceMotionEnabled: true },
      isHighContrast: false,
      isDark: false,
    }),
  };
});

test.skip('renders instantly with reduced motion', () => {
  const timing = jest.spyOn(Reanimated, 'withTiming');
  const sequence = jest.spyOn(Reanimated, 'withSequence');
  render(<BackgroundOrchestrator />);
  expect(timing).not.toHaveBeenCalled();
  expect(sequence).not.toHaveBeenCalled();
});
