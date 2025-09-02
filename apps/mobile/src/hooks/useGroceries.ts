import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAuthStore } from '../features/auth/store';

const client = supabase as SupabaseClient;

export interface Grocery {
  id: string;
  name: string;
  status: string;
  addedBy?: string;
  notes?: string;
}

export function useGroceries() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s: any) => s.auth);
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;

  const query = useQuery<Grocery[]>({
    queryKey: ['groceries', groupId, user?.id],
    queryFn: async () => {
      let q = client.from('groceries').select('*').order('created_at', { ascending: false });
      if (groupId) q = q.eq('group_id', groupId);
      if (user?.id) q = q.eq('addedBy', user.id);
      const { data, error } = await q;
      if (error) throw error;
      return data as Grocery[];
    },
    enabled: SUPABASE_ENABLED && !!groupId && !!user?.id,
  });

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;
    const channel = client
      .channel('public:groceries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groceries' }, () =>
        queryClient.invalidateQueries({ queryKey: ['groceries', groupId, user?.id] }),
      )
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useUpdateGrocery() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s: any) => s.auth);
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;
  return useMutation({
    mutationFn: async (grocery: Partial<Grocery> & { id: string }) => {
      const { data, error } = await client
        .from('groceries')
        .update(grocery)
        .eq('id', grocery.id)
        .eq('group_id', groupId)
        .select()
        .single();
      if (error) throw error;
      return data as Grocery;
    },
    onMutate: async (grocery) => {
      await queryClient.cancelQueries({ queryKey: ['groceries', groupId, user?.id] });
      const previous = queryClient.getQueryData<Grocery[]>(['groceries', groupId, user?.id]);
      queryClient.setQueryData<Grocery[]>(['groceries', groupId, user?.id], (old = []) =>
        old.map((item) => (item.id === grocery.id ? { ...item, ...grocery } : item)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['groceries', groupId, user?.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['groceries', groupId, user?.id] });
    },
  });
}
