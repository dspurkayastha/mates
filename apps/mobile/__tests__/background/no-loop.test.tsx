import React from 'react';
import { render } from '../test-utils';
jest.mock('@/components/ui/background/useSceneBackground', () =>
  jest.requireActual('@/components/ui/background/useSceneBackground'),
);

import {
  SceneBackgroundProvider,
  useSceneBackground,
  useSceneBackgroundContext,
  type SceneTheme,
} from '@/components/ui/background/useSceneBackground';
import { Text } from '@/components/ui';

const theme: SceneTheme = {
  key: 't',
  gradient: { type: 'linear', stops: ['#000', '#111'] },
  shapes: [],
  vignette: true,
};

function Screen() {
  useSceneBackground(theme);
  return <Text>demo</Text>;
}

function VersionProbe() {
  const { version } = useSceneBackgroundContext();
  return <Text testID="version">{version}</Text>;
}

function App() {
  return (
    <SceneBackgroundProvider>
      <VersionProbe />
      <Screen />
    </SceneBackgroundProvider>
  );
}

test('registers theme once for identical renders', () => {
  const { getByTestId, rerender } = render(<App />);
  expect(getByTestId('version').props.children).toBe(1);
  rerender(<App />);
  expect(getByTestId('version').props.children).toBe(1);
});
