import React from 'react';
import TextInput, { TextInputProps } from './TextInput';

export type TextAreaProps = Omit<TextInputProps, 'multiline' | 'numberOfLines'> & {
  minRows?: number;
};

export default function TextArea({ minRows, style, ...rest }: TextAreaProps) {
  const numberOfLines = minRows ?? 4;
  return (
    <TextInput
      {...rest}
      multiline
      numberOfLines={numberOfLines}
      style={[{ minHeight: numberOfLines * 24, textAlignVertical: 'top' }, style]}
    />
  );
}
