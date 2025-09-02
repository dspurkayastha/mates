import * as React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

it('renders a basic component', () => {
  render(<Text accessibilityLabel="greeting">Hello</Text>);
  expect(screen.getByLabelText('greeting')).toHaveTextContent('Hello');
});
