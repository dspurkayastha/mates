import React, { ReactElement } from 'react';
import {
  render as rtlRender,
  RenderOptions,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/design-system/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

export const createQueryClient = () => new QueryClient();

function Providers({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export function render(
  ui: ReactElement,
  {
    queryClient = createQueryClient(),
    ...options
  }: RenderOptions & {
    queryClient?: QueryClient;
  } = {},
) {
  return rtlRender(ui, {
    wrapper: ({ children }) => <Providers queryClient={queryClient}>{children}</Providers>,
    ...options,
  });
}

export { fireEvent, waitFor, screen };
