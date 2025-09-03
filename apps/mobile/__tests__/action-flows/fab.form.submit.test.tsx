import React from 'react';
import { render, fireEvent, waitFor, createQueryClient } from '../test-utils';
import HomeScreen from '@/app/(tabs)/index';
jest.mock('expo-linear-gradient', () => ({ LinearGradient: require('react-native').View }));
jest.mock('@/features/polls/hooks', () => ({ useLatestPoll: () => ({ data: null }) }));
jest.mock('@/features/expenses/hooks', () => ({
  useCreateExpense: () => {
    const { useQueryClient } = require('@tanstack/react-query');
    const qc = useQueryClient();
    return {
      mutate: (_d: any, opts?: any) => {
        qc.invalidateQueries({
          queryKey: ['expenses', { groupId: process.env.EXPO_PUBLIC_PROJECT_GROUP_ID }],
        });
        opts?.onSuccess?.();
      },
    };
  },
}));
jest.mock('@/features/groceries/hooks', () => ({ useCreateItem: () => ({ mutate: jest.fn() }) }));
jest.mock('@/features/chores/hooks', () => ({ useCreateChore: () => ({ mutate: jest.fn() }) }));

describe('fab form submit', () => {
  it('submits expense form and invalidates queries', async () => {
    const queryClient = createQueryClient();
    const spy = jest.spyOn(queryClient, 'invalidateQueries');
    const { getByLabelText, getByText, queryByText, findByLabelText } = render(<HomeScreen />, {
      queryClient,
    });
    fireEvent.press(getByLabelText('Open actions'));
    fireEvent.press(getByLabelText('Add Expense'));
    await findByLabelText('Expense Title');
    fireEvent.changeText(getByLabelText('Expense Title'), 'Dinner');
    fireEvent.changeText(getByLabelText('Amount'), '20');
    fireEvent.press(getByLabelText('Category'));
    fireEvent.press(getByText('General'));
    fireEvent.press(getByLabelText('Save Expense'));
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        queryKey: ['expenses', { groupId: process.env.EXPO_PUBLIC_PROJECT_GROUP_ID }],
      });
    });
    expect(queryByText('Title')).toBeNull();
  });
});
