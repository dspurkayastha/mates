import * as React from 'react';
import { Text } from 'react-native';
import { render, screen } from './test-utils';

it('renders a basic component', () => {
  render(<Text accessibilityLabel="greeting">Hello</Text>);
  expect(screen.getByLabelText('greeting')).toHaveTextContent('Hello');
});
