import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import TextInput from './TextInput';
import { formatINR } from '@/utils/format';

interface Props extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: number;
  onChange: (n: number) => void;
  a11yLabel?: string;
}

export default function CurrencyInput({ value, onChange, a11yLabel, ...rest }: Props) {
  const [display, setDisplay] = useState(value ? String(value) : '');

  return (
    <TextInput
      keyboardType="numeric"
      value={display}
      onChangeText={(text) => {
        const num = Number(text.replace(/[^0-9.-]/g, ''));
        setDisplay(text);
        if (!isNaN(num)) onChange(num);
      }}
      onBlur={() => setDisplay(value ? formatINR(value) : '')}
      onFocus={() => setDisplay(value ? String(value) : '')}
      a11yLabel={a11yLabel}
      {...rest}
    />
  );
}
