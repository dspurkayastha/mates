const mockToast = { success: jest.fn() };

jest.mock('@/components/ui/Notifications', () => ({
  useToast: () => mockToast,
}));

jest.mock('@/components/ui', () => {
  const actual = jest.requireActual('@/components/ui');
  const React = require('react');
  const { View, Text: RNText, Pressable } = require('react-native');
  return {
    __esModule: true,
    ...actual,
    ScreenBackground: ({ children }: any) => React.createElement(View, null, children),
    Text: (props: any) => React.createElement(RNText, props, props.children),
    ListItem: ({ title, onPress, accessory }: any) => {
      const children = [React.createElement(RNText, { key: 'title' }, title)];
      if (accessory?.node) children.push(React.cloneElement(accessory.node, { key: 'acc' }));
      return React.createElement(Pressable, { onPress }, children);
    },
    GlassToggle: ({ value, onValueChange, accessibilityLabel }: any) =>
      React.createElement(Pressable, {
        onPress: () => onValueChange(!value),
        accessibilityRole: 'switch',
        accessibilityLabel,
        accessibilityState: { checked: value },
      }),
    Button: ({ children, onPress, accessibilityLabel }: any) =>
      React.createElement(
        Pressable,
        { onPress, accessibilityLabel },
        React.createElement(RNText, null, children),
      ),
    Card: ({ children }: any) => React.createElement(View, null, children),
  };
});

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, fireEvent, waitFor, createQueryClient } from '../test-utils';
import { STORAGE_KEYS } from '@/utils/storage';
import SettingsScreen from '@/app/(tabs)/settings';

describe('settings reset cache', () => {
  it('clears storage and query cache', async () => {
    const queryClient = createQueryClient();
    queryClient.setQueryData(['test'], 'data');
    await AsyncStorage.setItem(STORAGE_KEYS.haptics, 'true');
    await AsyncStorage.setItem(STORAGE_KEYS.biometrics, 'true');

    const { getByText } = render(<SettingsScreen />, { queryClient });

    fireEvent.press(getByText('Reset Cache'));

    await waitFor(() => expect(queryClient.getQueryData(['test'])).toBeUndefined());
    await waitFor(async () => {
      expect(await AsyncStorage.getItem(STORAGE_KEYS.haptics)).toBeNull();
      expect(await AsyncStorage.getItem(STORAGE_KEYS.biometrics)).toBeNull();
    });
    expect(mockToast.success).toHaveBeenCalled();
  });
});
