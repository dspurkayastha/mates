import React from 'react';
import { render, fireEvent } from '../test-utils';
import HomeScreen from '@/app/(tabs)/index';
jest.mock('expo-linear-gradient', () => ({ LinearGradient: require('react-native').View }));
jest.mock('@/features/polls/hooks', () => ({ useLatestPoll: () => ({ data: null }) }));
jest.mock('@/features/expenses/hooks', () => ({ useCreateExpense: () => ({ mutate: jest.fn() }) }));
jest.mock('@/features/groceries/hooks', () => ({ useCreateItem: () => ({ mutate: jest.fn() }) }));
jest.mock('@/features/chores/hooks', () => ({ useCreateChore: () => ({ mutate: jest.fn() }) }));

describe('fab opens modals', () => {
  it('opens each create form', async () => {
    const { getByLabelText, getByText, findByLabelText } = render(<HomeScreen />);
    fireEvent.press(getByLabelText('Open actions'));
    fireEvent.press(getByLabelText('Add Expense'));
    await findByLabelText('Expense Title');
    fireEvent.press(getByText('Close'));
    fireEvent.press(getByLabelText('Open actions'));
    fireEvent.press(getByLabelText('Add Grocery'));
    await findByLabelText('Item name');
    fireEvent.press(getByText('Close'));
    fireEvent.press(getByLabelText('Open actions'));
    fireEvent.press(getByLabelText('Add Chore'));
    await findByLabelText('Chore title');
  });
});
