import React from 'react';
import { render, screen } from '../test-utils';
import ListItem from '@/components/ui/ListItem';

test('ListItem pressable is accessible with role button', () => {
  render(<ListItem title="Item" onPress={() => {}} />);
  expect(screen.getByRole('button', { name: 'Item' })).toBeTruthy();
});
