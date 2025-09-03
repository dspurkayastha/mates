import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '@/features/auth/useAuth';

const client = supabase as SupabaseClient;
// TODO: if backend filtering by groupId isn’t implemented yet.

export interface Poll {
  id: string;
  group_id: string;
  question: string;
  created_at: string;
  created_by?: string | null;
}

export interface PollVote {
  id: string;
  poll_id: string;
  user_id: string;
  vote: boolean;
}

export function useLatestPoll(groupId?: string) {
  const { auth } = useAuth();
  const userId = auth?.id;
  return useQuery<Poll | null>({
    queryKey: ['polls', 'latest', { groupId: groupId ?? 'none', userId }],
    queryFn: async () => {
      if (!groupId) return null;
      const { data, error } = await client
        .from('polls')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      return data?.[0] ?? null;
    },
    enabled: SUPABASE_ENABLED && !!groupId,
    staleTime: 30_000,
    initialData: null,
  });
}

export function useActivePoll({ groupId }: { groupId: string }) {
  const { auth } = useAuth();
  const userId = auth?.id;
  return useQuery<Poll | null>({
    queryKey: ['polls', 'active', { groupId, userId }],
    queryFn: async () => {
      const { data, error } = await client
        .from('polls')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data && data[0]) || null;
    },
    enabled: SUPABASE_ENABLED && !!groupId,
  });
}

export function usePollResults({ pollId }: { pollId: string }) {
  const { auth } = useAuth();
  const userId = auth?.id;
  return useQuery({
    queryKey: ['polls', 'results', { pollId, userId }],
    queryFn: async () => {
      const { data: poll, error } = await client
        .from('polls')
        .select('*')
        .eq('id', pollId)
        .single();
      if (error) throw error;
      const { data: votes, error: votesError } = await client
        .from('poll_votes')
        .select('*')
        .eq('poll_id', pollId);
      if (votesError) throw votesError;
      const yes = votes.filter((v: PollVote) => v.vote).length;
      const no = votes.filter((v: PollVote) => !v.vote).length;
      const myVoteEntry = votes.find((v: PollVote) => v.user_id === auth?.id);
      return { poll: poll as Poll, votes: { yes, no }, myVote: myVoteEntry?.vote ?? null };
    },
    enabled: SUPABASE_ENABLED && !!pollId,
  });
}

export function useCreatePoll() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ question, groupId }: { question: string; groupId: string }) => {
      const { data, error } = await client
        .from('polls')
        .insert({ question, group_id: groupId, created_by: auth?.id })
        .select()
        .single();
      if (error) throw error;
      return data as Poll;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['polls', 'active', { groupId: variables.groupId }],
      });
    },
  });
}

export function useVote({ pollId }: { pollId: string }) {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vote: boolean) => {
      if (!auth?.id) throw new Error('No user');
      const { error } = await client
        .from('poll_votes')
        .upsert({ poll_id: pollId, user_id: auth.id, vote }, { onConflict: 'poll_id,user_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls', 'results', pollId] });
    },
  });
}
