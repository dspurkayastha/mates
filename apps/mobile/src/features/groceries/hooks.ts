import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '@/features/auth/useAuth';

const client = supabase as SupabaseClient;

export interface GroceryItem {
  id: string;
  group_id: string;
  name: string;
  note?: string | null;
  quantity?: string | null;
  status: 'OUT' | 'LOW' | 'NEEDED' | 'BOUGHT';
  added_by: string;
  created_at: string;
  bought_at?: string | null;
}

export function useGroceries({
  groupId,
  status,
}: {
  groupId: string;
  status?: GroceryItem['status'];
}) {
  return useQuery<GroceryItem[]>({
    queryKey: ['groceries', { groupId, status }],
    queryFn: async () => {
      let q = client
        .from('groceries')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
      if (status) q = q.eq('status', status);
      const { data, error } = await q;
      if (error) throw error;
      return data as GroceryItem[];
    },
    enabled: SUPABASE_ENABLED && !!groupId,
  });
}

export function useCreateItem(groupId: string) {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: { name: string; note?: string; quantity?: string }) => {
      const { data, error } = await client
        .from('groceries')
        .insert({
          group_id: groupId,
          name: item.name,
          note: item.note,
          quantity: item.quantity,
          status: 'NEEDED',
          added_by: auth?.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data as GroceryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceries'] });
    },
  });
}

export function useUpdateItemStatus(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: GroceryItem['status'] }) => {
      const updates: Partial<GroceryItem> = { status };
      if (status === 'BOUGHT') updates.bought_at = new Date().toISOString();
      const { data, error } = await client
        .from('groceries')
        .update(updates)
        .eq('id', id)
        .eq('group_id', groupId)
        .select()
        .single();
      if (error) throw error;
      return data as GroceryItem;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['groceries'] });
      const previous = queryClient.getQueryData<GroceryItem[]>(['groceries', { groupId }]);
      queryClient.setQueryData<GroceryItem[]>(['groceries', { groupId }], (old = []) =>
        old.map((i) => (i.id === id ? { ...i, status } : i)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['groceries', { groupId }], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['groceries'] });
    },
  });
}

export function useDeleteItem(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await client
        .from('groceries')
        .delete()
        .eq('id', id)
        .eq('group_id', groupId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groceries'] });
    },
  });
}
