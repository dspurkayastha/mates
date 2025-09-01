import { useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

const client = supabase as SupabaseClient;

export interface Expense {
  id: string;
  title: string;
  amount: number;
  status?: string;
  created_at?: string;
}

export function useExpenses() {
  const queryClient = useQueryClient();

  const query = useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await client
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Expense[];
    },
    enabled: SUPABASE_ENABLED,
  });

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;
    const channel = client
      .channel('public:expenses')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
      )
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: Omit<Expense, 'id'>) => {
      const { data, error } = await client
        .from('expenses')
        .insert(expense)
        .select()
        .single();
      if (error) throw error;
      return data as Expense;
    },
    onMutate: async (expense) => {
      await queryClient.cancelQueries({ queryKey: ['expenses'] });
      const previous = queryClient.getQueryData<Expense[]>(['expenses']);
      queryClient.setQueryData<Expense[]>(['expenses'], (old = []) => [
        ...old,
        { ...(expense as any), id: Math.random().toString() },
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['expenses'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
