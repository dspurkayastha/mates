import { useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '../lib/supabase';

export interface Grocery {
  id: string;
  name: string;
  status: string;
  addedBy?: string;
  notes?: string;
}

export function useGroceries() {
  const queryClient = useQueryClient();

  const query = useQuery<Grocery[]>({
    queryKey: ['groceries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groceries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Grocery[];
    },
    enabled: SUPABASE_ENABLED,
  });

  useEffect(() => {
    if (!SUPABASE_ENABLED) return;
    const channel = supabase
      .channel('public:groceries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'groceries' },
        () => queryClient.invalidateQueries({ queryKey: ['groceries'] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useUpdateGrocery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (grocery: Partial<Grocery> & { id: string }) => {
      const { data, error } = await supabase
        .from('groceries')
        .update(grocery)
        .eq('id', grocery.id)
        .select()
        .single();
      if (error) throw error;
      return data as Grocery;
    },
    onMutate: async (grocery) => {
      await queryClient.cancelQueries({ queryKey: ['groceries'] });
      const previous = queryClient.getQueryData<Grocery[]>(['groceries']);
      queryClient.setQueryData<Grocery[]>(['groceries'], (old = []) =>
        old.map((item) => (item.id === grocery.id ? { ...item, ...grocery } : item)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['groceries'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['groceries'] });
    },
  });
}

export function useAddGrocery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (grocery: Omit<Grocery, 'id'>) => {
      const { data, error } = await supabase
        .from('groceries')
        .insert(grocery)
        .select()
        .single();
      if (error) throw error;
      return data as Grocery;
    },
    onMutate: async (grocery) => {
      await queryClient.cancelQueries({ queryKey: ['groceries'] });
      const previous = queryClient.getQueryData<Grocery[]>(['groceries']);
      queryClient.setQueryData<Grocery[]>(['groceries'], (old = []) => [
        { ...(grocery as any), id: Math.random().toString() },
        ...old,
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['groceries'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['groceries'] });
    },
  });
}
