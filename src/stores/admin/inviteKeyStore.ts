import { create } from "zustand";

interface InviteKeyState {
  currentPage: number;
  isDeletingKey: string | null;
  isDeletingExpired: boolean;

  setCurrentPage: (page: number) => void;
  setIsDeletingKey: (key: string | null) => void;
  setIsDeletingExpired: (v: boolean) => void;
}

export const useInviteKeyStore = create<InviteKeyState>((set) => ({
  currentPage: 1,
  isDeletingKey: null,
  isDeletingExpired: false,

  setCurrentPage: (page) => set({ currentPage: page }),
  setIsDeletingKey: (key) => set({ isDeletingKey: key }),
  setIsDeletingExpired: (v) => set({ isDeletingExpired: v }),
}));
