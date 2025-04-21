import { create } from "zustand";

type EmailPendingState = {
    pendingEmail: string | null;
    setPendingEmail: (email: string | null) => void
}
export const useEmailPendingStore = create<EmailPendingState>((set) => ({
  pendingEmail: null,
  setPendingEmail: (email: string | null) => set({ pendingEmail: email }),
}));