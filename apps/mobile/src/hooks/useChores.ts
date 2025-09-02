import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAuthStore } from '../features/auth/store';

const client = supabase as SupabaseClient;

export interface Chore {
  id: string;
  name: string;
  assignedTo: string;
  dueTime: string;
  isCompleted: boolean;
  icon?: string;
}

export function useChores() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s: any) => s.auth);
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;

  const query = useQuery<Chore[]>({
    queryKey: ['chores', groupId, user?.id],
    queryFn: async () => {
      let q = client.from('chores').select('*').order('dueTime', { ascending: true });
      if (groupId) q = q.eq('group_id', groupId);
      if (user?.id) q = q.eq('assignedTo', user.id);
      const { data, error } = await q;
      if (error) throw error;
      return data as Chore[];
    },
    enabled: SUPABASE_ENABLED && !!groupId && !!user?.id,
  });

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;
    const channel = client
      .channel('public:chores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chores' }, () =>
        queryClient.invalidateQueries({ queryKey: ['chores', groupId, user?.id] }),
      )
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useToggleChore() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s: any) => s.auth);
  const groupId = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;
  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { data, error } = await client
        .from('chores')
        .update({ isCompleted })
        .eq('id', id)
        .eq('group_id', groupId)
        .select()
        .single();
      if (error) throw error;
      return data as Chore;
    },
    onMutate: async ({ id, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ['chores', groupId, user?.id] });
      const previous = queryClient.getQueryData<Chore[]>(['chores', groupId, user?.id]);
      queryClient.setQueryData<Chore[]>(['chores', groupId, user?.id], (old = []) =>
        old.map((chore) => (chore.id === id ? { ...chore, isCompleted } : chore)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['chores', groupId, user?.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chores', groupId, user?.id] });
    },
  });
}
