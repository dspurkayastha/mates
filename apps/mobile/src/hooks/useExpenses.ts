import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAuthStore } from '../features/auth/store';

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
  const user = useAuthStore((s) => s.auth);
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;

  const query = useQuery<Expense[]>({
    queryKey: ['expenses', groupId, user?.id],
    queryFn: async () => {
      let q = client.from('expenses').select('*').order('created_at', { ascending: false });
      if (groupId) q = q.eq('group_id', groupId);
      if (user?.id) q = q.eq('user_id', user.id);
      const { data, error } = await q;
      if (error) throw error;
      return data as Expense[];
    },
    enabled: SUPABASE_ENABLED && !!groupId && !!user?.id,
  });

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;
    const channel = client
      .channel('public:expenses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () =>
        queryClient.invalidateQueries({ queryKey: ['expenses', groupId, user?.id] }),
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
  const user = useAuthStore((s) => s.auth);
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;

  return useMutation({
    mutationFn: async (expense: Omit<Expense, 'id'>) => {
      const { data, error } = await client
        .from('expenses')
        .insert({ ...expense, group_id: groupId, user_id: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Expense;
    },
    onMutate: async (expense) => {
      await queryClient.cancelQueries({ queryKey: ['expenses', groupId, user?.id] });
      const previous = queryClient.getQueryData<Expense[]>(['expenses', groupId, user?.id]);
      queryClient.setQueryData<Expense[]>(['expenses', groupId, user?.id], (old = []) => [
        ...old,
        { ...(expense as any), id: Math.random().toString() },
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['expenses', groupId, user?.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId, user?.id] });
    },
  });
}
