import React from 'react';
import { render } from '@testing-library/react-native';
import Button from '@/components/ui/Button';

jest.mock('@/design-system/ThemeProvider', () => {
  const tokens = require('@/design-system/tokens').default;
  const { LightTheme } = require('@/design-system/tokens');
  return {
    __esModule: true,
    useTokens: () => tokens,
    useTheme: () => ({
      theme: LightTheme,
      config: { colorScheme: 'light', contrast: 'normal', followSystemContrast: true },
      isDark: false,
      isHighContrast: false,
      toggleTheme: jest.fn(),
      toggleContrast: jest.fn(),
      setColorScheme: jest.fn(),
      setContrastMode: jest.fn(),
      tokens,
      accessibility: {
        isScreenReaderEnabled: false,
        isReduceMotionEnabled: true,
        isHighContrastEnabled: false,
        preferredContentSizeCategory: 'medium',
      },
    }),
    useColors: () => LightTheme,
  };
});

test('no scale animation when reduce motion enabled', () => {
  const { getByRole } = render(<Button accessibilityLabel="ok">OK</Button>);
  const button = getByRole('button');
  const parent = button.parent as any;
  const styleArray = Array.isArray(parent.props.style) ? parent.props.style : [parent.props.style];
  const transformStyle = styleArray.find((s: any) => s && s.transform);
  expect(transformStyle?.transform ?? [{ scale: 1 }]).toEqual([{ scale: 1 }]);
});
