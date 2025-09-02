import React from 'react';
import { render, screen } from '../test-utils';
import SegmentedControl from '@/components/ui/SegmentedControl';

test('SegmentedControl renders tabs with selected state', () => {
  const segments = [
    { key: 'one', label: 'One' },
    { key: 'two', label: 'Two' },
  ];
  render(
    <SegmentedControl segments={segments} value="two" onChange={() => {}} />,
  );
  const selected = screen.getByRole('tab', { name: 'Two' });
  expect(selected).toHaveAccessibilityState({ selected: true });
});
