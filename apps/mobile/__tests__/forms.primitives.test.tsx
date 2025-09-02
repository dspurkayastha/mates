import React from 'react';
import { fireEvent, render, screen } from './test-utils';
import {
  FormField,
  TextInput,
  CurrencyInput,
  Select,
  DateTimeField,
  TextArea,
  FormScreen,
} from '@/components/form';

jest.mock('@/components/ui', () => {
  const React = require('react');
  const { View, Text: RNText, Pressable } = require('react-native');
  return {
    __esModule: true,
    Text: (props: any) => React.createElement(RNText, props, props.children),
    Card: ({ children }: any) => React.createElement(View, null, children),
    ListItem: ({ title, onPress }: any) =>
      React.createElement(Pressable, { onPress }, React.createElement(RNText, null, title)),
    Button: ({ children, onPress, accessibilityLabel }: any) =>
      React.createElement(Pressable, { onPress, accessibilityLabel }, children),
    useTokens: () => ({
      Spacing: { lg: 16, md: 8, sm: 4, xs: 2 },
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

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
];

describe('form primitives', () => {
  it('renders label in FormField', () => {
    render(
      <FormField label="Name">
        <TextInput value="" onChangeText={() => {}} />
      </FormField>,
    );
    expect(screen.getByText('Name')).toBeTruthy();
  });

  it('formats CurrencyInput on blur', () => {
    const Wrapper = () => {
      const [val, setVal] = React.useState(0);
      return <CurrencyInput value={val} onChange={setVal} a11yLabel="amount" />;
    };
    render(<Wrapper />);
    const input = screen.getByLabelText('amount');
    fireEvent.changeText(input, '1000');
    fireEvent(input, 'blur');
    expect(input.props.value).toContain('₹');
  });

  it('renders Select options', () => {
    render(<Select options={options} onChange={() => {}} />);
    fireEvent.press(screen.getByRole('button'));
    expect(screen.getByText('One')).toBeTruthy();
  });

  it('renders DateTimeField', () => {
    render(<DateTimeField onChange={() => {}} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('renders TextArea', () => {
    render(<TextArea value="" onChangeText={() => {}} a11yLabel="bio" />);
    expect(screen.getByLabelText('bio')).toBeTruthy();
  });

  it('wraps content in FormScreen', () => {
    render(
      <FormScreen>
        <FormField label="Email">
          <TextInput value="" onChangeText={() => {}} />
        </FormField>
      </FormScreen>,
    );
    expect(screen.getByText('Email')).toBeTruthy();
  });
});
