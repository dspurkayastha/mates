import React, { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme, useTokens } from '@/components/ui';

export type TextInputProps = RNTextInputProps & {
  a11yLabel?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIconName?: string;
  rightAccessory?: ReactNode;
};

export default function TextInput({ a11yLabel, style, ...rest }: TextInputProps) {
  const { theme } = useTheme();
  const tokens = useTokens();
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: focused ? theme.interactive.primary : theme.border.light,
        borderRadius: tokens.BorderRadius.md,
        backgroundColor: theme.background.secondary,
      }}
    >
      <RNTextInput
        {...rest}
        style={[
          {
            padding: tokens.Spacing.md,
            color: theme.text.primary,
          },
          style,
        ]}
        accessibilityLabel={a11yLabel}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus && rest.onFocus(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur && rest.onBlur(e);
        }}
        placeholderTextColor={theme.text.secondary}
      />
    </View>
  );
}
