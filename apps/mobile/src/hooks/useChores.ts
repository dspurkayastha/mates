import { useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '../lib/supabase';

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

  const query = useQuery<Chore[]>({
    queryKey: ['chores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chores')
        .select('*')
        .order('dueTime', { ascending: true });
      if (error) throw error;
      return data as Chore[];
    },
    enabled: SUPABASE_ENABLED,
  });

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;
    const channel = supabase
      .channel('public:chores')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chores' },
        () => queryClient.invalidateQueries({ queryKey: ['chores'] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useToggleChore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { data, error } = await supabase
        .from('chores')
        .update({ isCompleted })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Chore;
    },
    onMutate: async ({ id, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ['chores'] });
      const previous = queryClient.getQueryData<Chore[]>(['chores']);
      queryClient.setQueryData<Chore[]>(['chores'], (old = []) =>
        old.map((chore) =>
          chore.id === id ? { ...chore, isCompleted } : chore,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['chores'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
    },
  });
}
