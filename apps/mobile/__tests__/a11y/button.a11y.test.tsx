import React from 'react';
import { render, screen } from '../test-utils';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';

test('icon-only buttons expose accessibilityLabel', () => {
  // @ts-expect-error - children are intentionally omitted for icon-only button
  render(<Button accessibilityLabel="Settings" leftIcon={<Text>icon</Text>} />);
  expect(screen.getByRole('button', { name: 'Settings' })).toBeTruthy();
});
