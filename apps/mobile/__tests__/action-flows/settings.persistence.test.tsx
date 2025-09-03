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

describe('settings persistence', () => {
  it('dark mode, haptics and biometrics persist and rehydrate', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.theme, 'light');
    const queryClient = createQueryClient();
    const { getByLabelText, unmount } = render(<SettingsScreen />, { queryClient });

    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());
    (AsyncStorage.setItem as jest.Mock).mockClear();

    const darkModeToggle = getByLabelText('Dark mode');
    if (darkModeToggle.props.accessibilityState.checked) {
      fireEvent.press(darkModeToggle);
    }
    fireEvent.press(darkModeToggle);
    fireEvent.press(getByLabelText('Haptics'));
    fireEvent.press(getByLabelText('Biometric authentication'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.theme, 'dark');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.haptics, 'false');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEYS.biometrics, 'true');
    });

    unmount();
    const { getByLabelText: getAgain } = render(<SettingsScreen />, {
      queryClient: createQueryClient(),
    });

    await waitFor(() => {
      expect(getAgain('Dark mode').props.accessibilityState.checked).toBe(true);
      expect(getAgain('Haptics').props.accessibilityState.checked).toBe(false);
      expect(getAgain('Biometric authentication').props.accessibilityState.checked).toBe(true);
    });
  });
});
