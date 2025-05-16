import { create } from "zustand";
import { InviteKey } from "@/types/api/responses/admin/inviteKeyResponses";

type InviteKeyStore = {
  inviteKeys: InviteKey[];
  currentPage: number;
  totalItems: number;
  isLoading: boolean;

  setInviteKeys: (keys: InviteKey[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalItems: (count: number) => void;
  setLoading: (loading: boolean) => void;
};

export const useInviteKeyStore = create<InviteKeyStore>((set) => ({
  inviteKeys: [],
  currentPage: 1,
  totalItems: 0,
  isLoading: false,

  setInviteKeys: (keys) => set({ inviteKeys: keys }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalItems: (count) => set({ totalItems: count }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
