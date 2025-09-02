import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '@/design-system/ThemeProvider';
import { ReactElement } from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

export function render(ui: ReactElement, options?: RenderOptions) {
  return rtlRender(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react-native';
