import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase, { SUPABASE_ENABLED } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

const client = supabase as SupabaseClient;
import { useAuth } from '@/utils/auth/useAuth';

export interface Poll {
  id: string;
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

export function useLatestPoll() {
  return useQuery<Poll | null>({
    queryKey: ['polls', 'latest'],
    queryFn: async () => {
      const { data, error } = await client
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data && data[0]) || null;
    },
    enabled: SUPABASE_ENABLED,
  });
}

export function usePoll(id: string) {
  const { auth } = useAuth();
  return useQuery({
    queryKey: ['poll', id],
    queryFn: async () => {
      const { data: poll, error } = await client
        .from('polls')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      const { data: votes, error: votesError } = await client
        .from('poll_votes')
        .select('*')
        .eq('poll_id', id);
      if (votesError) throw votesError;
      const yes = votes.filter((v: PollVote) => v.vote).length;
      const no = votes.filter((v: PollVote) => !v.vote).length;
      const myVoteEntry = votes.find((v: PollVote) => v.user_id === auth?.id);
      return { poll: poll as Poll, votes: { yes, no }, myVote: myVoteEntry?.vote ?? null };
    },
    enabled: SUPABASE_ENABLED && !!id,
  });
}

export function useCreatePoll() {
  return useMutation({
    mutationFn: async (question: string) => {
      const { data, error } = await client
        .from('polls')
        .insert({ question })
        .select()
        .single();
      if (error) throw error;
      return data as Poll;
    },
  });
}

export function useVotePoll() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pollId, vote }: { pollId: string; vote: boolean }) => {
      if (!auth?.id) throw new Error('No user');
      const { error } = await client
        .from('poll_votes')
        .upsert({ poll_id: pollId, user_id: auth.id, vote }, { onConflict: 'poll_id,user_id' });
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['poll', variables.pollId] });
      queryClient.invalidateQueries({ queryKey: ['polls', 'latest'] });
    },
  });
}

