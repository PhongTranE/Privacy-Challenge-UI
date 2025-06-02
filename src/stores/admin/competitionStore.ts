import { create } from "zustand";
import { CompetitionStatusResponse } from "@/types/api/responses/admin/competitionResponses";

interface CompetitionStoreState {
  status: CompetitionStatusResponse | null;
  loading: boolean;
  error: string | null;
  isPaused: boolean;
  setStatus: (status: CompetitionStatusResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsPaused: (isPaused: boolean) => void;
  reset: () => void;
}

export const useCompetitionStore = create<CompetitionStoreState>((set) => ({
  status: null,
  loading: false,
  error: null,
  isPaused: false,
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setIsPaused: (isPaused) => set({ isPaused }),
  reset: () => set({ status: null, loading: false, error: null, isPaused: false }),
}));