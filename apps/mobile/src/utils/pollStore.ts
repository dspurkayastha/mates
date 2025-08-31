import { create } from 'zustand';

interface Poll {
  question: string;
}

interface PollState {
  activePoll: Poll | null;
  createPoll: (poll: Poll) => void;
}

export const usePollStore = create<PollState>((set) => ({
  activePoll: null,
  createPoll: (poll) => set({ activePoll: poll }),
}));
