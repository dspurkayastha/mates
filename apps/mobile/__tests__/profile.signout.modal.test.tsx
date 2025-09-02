import React from 'react';
import { render, fireEvent, screen } from './test-utils';
import ProfileScreen from '@/app/(tabs)/profile';

jest.mock('@/components/ui', () => {
  const React = require('react');
  const { View, Text: RNText, Pressable } = require('react-native');
  return {
    __esModule: true,
    ScreenBackground: ({ children }: any) => React.createElement(View, null, children),
    Text: (props: any) => React.createElement(RNText, props, props.children),
    ListItem: ({ title, onPress }: any) =>
      React.createElement(Pressable, { onPress }, React.createElement(RNText, null, title)),
    Icon: () => React.createElement(View),
    Button: ({ children, onPress, accessibilityLabel }: any) =>
      React.createElement(Pressable, { onPress, accessibilityLabel }, children),
    Card: ({ children }: any) => React.createElement(View, null, children),
    useTokens: () => ({
      Spacing: { lg: 16, md: 8, sm: 4, xs: 2, '2xl': 32 },
      BorderRadius: { md: 8 },
    }),
    useTheme: () => ({
      theme: {
        interactive: { primary: '#000' },
        border: { light: '#ccc' },
        background: { secondary: '#fff' },
        text: { primary: '#000', secondary: '#666' },
        status: { error: '#f00' },
      },
    }),
  };
});

jest.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ signOut: jest.fn() }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Profile sign out modal', () => {
  it('shows modal with actions', () => {
    render(<ProfileScreen />);
    fireEvent.press(screen.getByText('Sign Out'));
    expect(screen.getByLabelText('Confirm Sign Out')).toBeTruthy();
    expect(screen.getByLabelText('Cancel Sign Out')).toBeTruthy();
  });
});
