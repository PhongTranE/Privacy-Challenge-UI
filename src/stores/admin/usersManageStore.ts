import { create } from "zustand";

interface UsersManageState {
  search: string;
  setSearch: (value: string) => void;
}

interface DeleteUserModalState {
  modalOpen: boolean;
  userToDelete: { id: number; username: string } | null;
  openModal: (user: { id: number; username: string }) => void;
  closeModal: () => void;
}

interface ChangePasswordModalState {
  modalOpen: boolean;
  userId: number | null;
  openModal: (userId: number) => void;
  closeModal: () => void;
}

interface ChangeGroupModalStore {
  modalOpen: boolean;
  userId: number | null;
  username: string;
  currentGroup: string;
  openModal: (userId: number, username: string, currentGroup: string) => void;
  closeModal: () => void;
}

export const useUsersManageStore = create<UsersManageState>((set) => ({
  search: "",
  setSearch: (value: string) => set({ search: value }),
}));

export const useDeleteUserModalStore = create<DeleteUserModalState>((set) => ({
  modalOpen: false,
  userToDelete: null,
  openModal: (user) => set({ modalOpen: true, userToDelete: user }),
  closeModal: () => set({ modalOpen: false, userToDelete: null }),
}));

export const useChangePasswordModalStore = create<ChangePasswordModalState>((set) => ({
  modalOpen: false,
  userId: null,
  openModal: (userId) => set({ modalOpen: true, userId }),
  closeModal: () => set({ modalOpen: false, userId: null }),
}));

export const useChangeGroupModalStore = create<ChangeGroupModalStore>((set) => ({
  modalOpen: false,
  userId: null,
  username: "",
  currentGroup: "",
  openModal: (userId, username, currentGroup) =>
    set({ modalOpen: true, userId, username, currentGroup }),
  closeModal: () => set({ modalOpen: false, userId: null, username: "", currentGroup: "" }),
}));
