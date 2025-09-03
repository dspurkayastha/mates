import React from 'react';
import { render, fireEvent, waitFor, createQueryClient } from '../test-utils';
import ExpensesScreen from '@/app/(tabs)/expenses';
import GroceriesScreen from '@/app/(tabs)/groceries';
import ChoresScreen from '@/app/(tabs)/chores';
jest.mock('expo-linear-gradient', () => ({ LinearGradient: require('react-native').View }));

jest.mock('@/features/expenses/hooks', () => ({
  useExpenses: () => ({ data: [], isLoading: false }),
  useHouseholdBalances: () => ({ data: [] }),
  useBudget: () => ({ data: null }),
  useUpsertBudget: () => ({ mutate: jest.fn() }),
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

jest.mock('@/features/groceries/hooks', () => ({
  useGroceries: () => ({ data: [], isLoading: false }),
  useUpdateItemStatus: () => ({ mutate: jest.fn() }),
  useCreateItem: () => {
    const { useQueryClient } = require('@tanstack/react-query');
    const qc = useQueryClient();
    return {
      mutate: (_d: any, opts?: any) => {
        qc.invalidateQueries({
          queryKey: ['groceries', { groupId: process.env.EXPO_PUBLIC_PROJECT_GROUP_ID }],
        });
        opts?.onSuccess?.();
      },
    };
  },
}));

jest.mock('@/features/chores/hooks', () => ({
  useChores: () => ({ data: [], isLoading: false }),
  useCompleteChore: () => ({ mutate: jest.fn() }),
  useCreateChore: () => {
    const { useQueryClient } = require('@tanstack/react-query');
    const qc = useQueryClient();
    return {
      mutate: (_d: any, opts?: any) => {
        qc.invalidateQueries({
          queryKey: ['chores', { groupId: process.env.EXPO_PUBLIC_PROJECT_GROUP_ID }],
        });
        opts?.onSuccess?.();
      },
    };
  },
}));

describe('feature screen add buttons', () => {
  it('expenses add button submits form', async () => {
    const qc = createQueryClient();
    const spy = jest.spyOn(qc, 'invalidateQueries');
    const { getByText, getByLabelText } = render(<ExpensesScreen />, {
      queryClient: qc,
    });
    fireEvent.press(getByText('Add Expense'));
    fireEvent.changeText(getByLabelText('Expense Title'), 'Taxi');
    fireEvent.changeText(getByLabelText('Amount'), '30');
    fireEvent.press(getByLabelText('Category'));
    fireEvent.press(getByText('General'));
    fireEvent.press(getByLabelText('Save Expense'));
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        queryKey: ['expenses', { groupId: process.env.EXPO_PUBLIC_PROJECT_GROUP_ID }],
      });
    });
  });

  it('groceries add button submits form', async () => {
    const qc = createQueryClient();
    const spy = jest.spyOn(qc, 'invalidateQueries');
    const { getByText, getByLabelText } = render(<GroceriesScreen />, {
      queryClient: qc,
    });
    fireEvent.press(getByText('Add Item'));
    fireEvent.changeText(getByLabelText('Item name'), 'Eggs');
    fireEvent.press(getByLabelText('Save Grocery'));
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        queryKey: ['groceries', { groupId: process.env.EXPO_PUBLIC_PROJECT_GROUP_ID }],
      });
    });
  });

  it('chores add button submits form', async () => {
    const qc = createQueryClient();
    const spy = jest.spyOn(qc, 'invalidateQueries');
    const { getByText, getByLabelText } = render(<ChoresScreen />, {
      queryClient: qc,
    });
    fireEvent.press(getByText('Add Chore'));
    fireEvent.changeText(getByLabelText('Chore title'), 'Dishes');
    fireEvent.press(getByLabelText('Save Chore'));
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        queryKey: ['chores', { groupId: process.env.EXPO_PUBLIC_PROJECT_GROUP_ID }],
      });
    });
  });
});
