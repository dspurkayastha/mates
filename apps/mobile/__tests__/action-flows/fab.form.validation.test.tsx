import React from 'react';
import { render, fireEvent, createQueryClient } from '../test-utils';
import HomeScreen from '@/app/(tabs)/index';
jest.mock('expo-linear-gradient', () => ({ LinearGradient: require('react-native').View }));
jest.mock('@/features/polls/hooks', () => ({ useLatestPoll: () => ({ data: null }) }));
jest.mock('@/features/expenses/hooks', () => ({ useCreateExpense: () => ({ mutate: jest.fn() }) }));
jest.mock('@/features/groceries/hooks', () => ({ useCreateItem: () => ({ mutate: jest.fn() }) }));
jest.mock('@/features/chores/hooks', () => ({ useCreateChore: () => ({ mutate: jest.fn() }) }));

describe('fab form validation', () => {
  it('shows errors when submitting empty expense form', async () => {
    const queryClient = createQueryClient();
    const { getByLabelText, getAllByText, getByText, findByLabelText } = render(<HomeScreen />, {
      queryClient,
    });
    fireEvent.press(getByLabelText('Open actions'));
    fireEvent.press(getByLabelText('Add Expense'));
    await findByLabelText('Expense Title');
    fireEvent.press(getByLabelText('Save Expense'));
    expect(getAllByText('Required').length).toBeGreaterThan(0);
    fireEvent.press(getByText('Close'));
  });
});
