import { create } from "zustand";
import { CompetitionStatusUserResponse } from "@/types/api/responses/user/competitionResponses";

interface CompetitionStatusState {
  status: CompetitionStatusUserResponse | null;
  setStatus: (status: CompetitionStatusUserResponse) => void;
}

export const useCompetitionStatusStore = create<CompetitionStatusState>((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
})); 