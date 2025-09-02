import React from 'react';
import { render, screen } from './test-utils';
import AnalyticsScreen from '../src/app/(tabs)/analytics';

jest.mock('../src/components/ui', () => {
  const React = require('react');
  const { View, Text: RNText } = require('react-native');
  return {
    __esModule: true,
    ScreenBackground: ({ children }: any) => React.createElement(View, null, children),
    Text: (props: any) => React.createElement(RNText, props, props.children),
    LoadingSkeleton: () => React.createElement(View),
    ListItem: ({ title }: any) =>
      React.createElement(View, null, React.createElement(RNText, null, title)),
    Card: ({ children }: any) => React.createElement(View, null, children),
    EmptyState: ({ title }: any) => React.createElement(RNText, null, title),
    ErrorBanner: ({ message }: any) => React.createElement(RNText, null, message),
    useTokens: () => ({ Spacing: { lg: 16, md: 8, sm: 4, xl: 24 }, BorderRadius: { lg: 12 } }),
    useTheme: () => ({
      theme: {
        interactive: { primary: '#000' },
        background: { secondary: '#fff' },
        status: { errorBackground: '#fdd', error: '#f00' },
        text: { secondary: '#666' },
      },
    }),
  };
});

jest.mock('../src/features/expenses/hooks', () => ({
  useExpenses: () => ({ data: [], isLoading: false, error: null }),
}));

jest.mock('../src/features/groceries/hooks', () => ({
  useGroceries: () => ({ data: [], isLoading: false, error: null }),
}));

jest.mock('../src/features/chores/hooks', () => ({
  useChores: () => ({ data: [], isLoading: false, error: null }),
}));

const renderScreen = () => render(<AnalyticsScreen />);

describe('AnalyticsScreen', () => {
  it('shows KPI labels', () => {
    renderScreen();
    expect(screen.getByText('This Month Spend')).toBeTruthy();
    expect(screen.getByText('# Expenses')).toBeTruthy();
  });

  it('renders chart caption', () => {
    renderScreen();
    expect(screen.getByText(/Spending last/)).toBeTruthy();
  });
});
