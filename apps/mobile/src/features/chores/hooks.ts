import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '@/features/auth/useAuth';

const client = supabase as SupabaseClient;

export interface Chore {
  id: string;
  group_id: string;
  title: string;
  due_at: string;
  assignee?: string | null;
  completed_at?: string | null;
}

export interface LeaderboardEntry {
  user_id: string;
  completed: number;
}

export function useChores({ groupId, range }: { groupId: string; range?: 'today' | 'week' }) {
  return useQuery<Chore[]>({
    queryKey: ['chores', { groupId, range }],
    queryFn: async () => {
      let q = client
        .from('chores')
        .select('*')
        .eq('group_id', groupId)
        .order('due_at', { ascending: true });
      const today = new Date();
      if (range === 'today') {
        q = q
          .gte('due_at', today.toISOString().split('T')[0])
          .lt('due_at', new Date(today.getTime() + 86400000).toISOString().split('T')[0]);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data as Chore[];
    },
    enabled: SUPABASE_ENABLED && !!groupId,
  });
}

export function useCreateChore(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chore: { title: string; due_at: string; assignee?: string }) => {
      const { data, error } = await client
        .from('chores')
        .insert({
          group_id: groupId,
          title: chore.title,
          due_at: chore.due_at,
          assignee: chore.assignee,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Chore;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
    },
  });
}

export function useAssignChore(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assignee }: { id: string; assignee: string }) => {
      const { data, error } = await client
        .from('chores')
        .update({ assignee })
        .eq('id', id)
        .eq('group_id', groupId)
        .select()
        .single();
      if (error) throw error;
      return data as Chore;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
    },
  });
}

export function useCompleteChore(groupId: string) {
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  return useMutation({
    mutationFn: async ({ id, complete }: { id: string; complete: boolean }) => {
      const { data, error } = await client
        .from('chores')
        .update({
          completed_at: complete ? new Date().toISOString() : null,
          assignee: complete ? auth?.id : null,
        })
        .eq('id', id)
        .eq('group_id', groupId)
        .select()
        .single();
      if (error) throw error;
      return data as Chore;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard', { groupId }] });
    },
  });
}

export function useLeaderboard({ groupId }: { groupId: string }) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', { groupId }],
    queryFn: async () => {
      const { data, error } = await client
        .from('chores')
        .select('assignee, completed_at')
        .eq('group_id', groupId);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data as Chore[]).forEach((c) => {
        if (c.completed_at && c.assignee) {
          counts[c.assignee] = (counts[c.assignee] || 0) + 1;
        }
      });
      return Object.entries(counts).map(([user_id, completed]) => ({ user_id, completed }));
    },
    enabled: SUPABASE_ENABLED && !!groupId,
  });
}
