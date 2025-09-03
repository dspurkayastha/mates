import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '@/features/auth/useAuth';

const client = supabase as SupabaseClient;

export interface Expense {
  id: string;
  group_id: string;
  title: string;
  amount: number;
  paid_by: string;
  shared_with: string[];
  status: 'PENDING' | 'SETTLED';
  created_at: string;
}

export interface Split {
  id: string;
  expense_id: string;
  user_id: string;
  amount: number;
}

export interface Settlement {
  id: string;
  expense_id: string;
  settled_by: string;
  created_at: string;
}

export interface Budget {
  id: string;
  group_id: string;
  month_key: string;
  limit: number;
}

export interface HouseholdBalance {
  user_id: string;
  balance: number;
}

export function useExpenses({
  groupId,
  filter,
}: {
  groupId: string;
  filter?: 'all' | 'settled' | 'unsettled';
}) {
  return useQuery<Expense[]>({
    queryKey: ['expenses', { groupId, filter }],
    queryFn: async () => {
      let q = client
        .from('expenses')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
      if (filter === 'settled') q = q.eq('status', 'SETTLED');
      if (filter === 'unsettled') q = q.neq('status', 'SETTLED');
      const { data, error } = await q;
      if (error) throw error;
      return data as Expense[];
    },
    enabled: SUPABASE_ENABLED && !!groupId,
  });
}

export function useCreateExpense(groupId: string) {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      expense: Omit<
        Expense,
        'id' | 'created_at' | 'status' | 'group_id' | 'paid_by' | 'shared_with'
      > & {
        category?: string;
        notes?: string;
        created_at?: string;
        shared_with?: string[];
      },
    ) => {
      const { data, error } = await client
        .from('expenses')
        .insert({
          ...expense,
          group_id: groupId,
          status: 'PENDING',
          created_at: expense.created_at ?? new Date().toISOString(),
          paid_by: auth?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', { groupId }] });
    },
  });
}

export function useSettleExpense(groupId: string) {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await client
        .from('expenses')
        .update({ status: 'SETTLED' })
        .eq('id', expenseId);
      if (error) throw error;
      const { error: settleError } = await client
        .from('settlements')
        .insert({ expense_id: expenseId, settled_by: auth?.id });
      if (settleError) throw settleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', { groupId }] });
      queryClient.invalidateQueries({ queryKey: ['householdBalances', { groupId }] });
    },
  });
}

export function useBudget(groupId: string, monthKey: string) {
  return useQuery<Budget | null>({
    queryKey: ['budget', { groupId, monthKey }],
    queryFn: async () => {
      const { data, error } = await client
        .from('budgets')
        .select('*')
        .eq('group_id', groupId)
        .eq('month_key', monthKey)
        .maybeSingle();
      if (error) throw error;
      return (data as Budget) || null;
    },
    enabled: SUPABASE_ENABLED && !!groupId && !!monthKey,
  });
}

export function useUpsertBudget(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ monthKey, limit }: { monthKey: string; limit: number }) => {
      const { data, error } = await client
        .from('budgets')
        .upsert({ group_id: groupId, month_key: monthKey, limit })
        .select()
        .single();
      if (error) throw error;
      return data as Budget;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['budget', { groupId, monthKey: variables.monthKey }],
      });
    },
  });
}

export function useHouseholdBalances(groupId: string) {
  return useQuery<HouseholdBalance[]>({
    queryKey: ['householdBalances', { groupId }],
    queryFn: async () => {
      const { data, error } = await client
        .from('household_balances')
        .select('*')
        .eq('group_id', groupId);
      if (error) throw error;
      return data as HouseholdBalance[];
    },
    enabled: SUPABASE_ENABLED && !!groupId,
  });
}
