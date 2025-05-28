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
