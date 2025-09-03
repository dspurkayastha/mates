const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  __esModule: true,
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
}));

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
      React.createElement(
        Pressable,
        { onPress, accessibilityLabel },
        React.createElement(RNText, null, children),
      ),
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

import React from 'react';
import { render, fireEvent, waitFor, createQueryClient } from '../test-utils';
import ProfileScreen from '@/app/(tabs)/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/features/auth/store';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('auth signout flow', () => {
  it('clears caches and navigates to onboarding', async () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(['test'], 'data');

    useAuthStore.setState({ isReady: true, auth: { id: 'user-1' } });

    const { getByText, findByText } = render(<ProfileScreen />, { queryClient });

    fireEvent.press(getByText('Sign Out'));
    const confirmButton = await findByText('Confirm');
    fireEvent.press(confirmButton);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(onboarding)/welcome');
    });
    expect(queryClient.getQueryData(['test'])).toBeUndefined();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('REACT_QUERY_OFFLINE_CACHE');
  });
});
