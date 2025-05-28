import { create } from "zustand";


interface GroupManageStoreState {
  search: string;
  setSearch: (value: string) => void;
}

export const useGroupManageStore = create<GroupManageStoreState>((set) => ({
  search: "",
  setSearch: (value: string) => set({ search: value }),
}));

interface DeleteGroupModalState {
  modalOpen: boolean;
  groupToDelete: { id: number; name: string } | null;
  openModal: (group: { id: number; name: string }) => void;
  closeModal: () => void;
}

export const useDeleteGroupModalStore = create<DeleteGroupModalState>((set) => ({
  modalOpen: false,
  groupToDelete: null,
  openModal: (group) => set({ modalOpen: true, groupToDelete: group }),
  closeModal: () => set({ modalOpen: false, groupToDelete: null }),
}));

interface DetailGroupModalState {
  modalOpen: boolean;
  groupToDetail: { id: number; name: string } | null;
  openModal: (group: { id: number; name: string }) => void;
  closeModal: () => void;
  updateGroupName: (newName: string) => void;
}

export const useDetailGroupModalStore = create<DetailGroupModalState>((set) => ({
  modalOpen: false,
  groupToDetail: null,
  openModal: (group) => set({ modalOpen: true, groupToDetail: group }),
  closeModal: () => set({ modalOpen: false, groupToDetail: null }),
  updateGroupName: (newName) =>
    set((state) =>
      state.groupToDetail
        ? { groupToDetail: { ...state.groupToDetail, name: newName } }
        : {}
    ),
}));

interface ChangeGroupNameModalState {
  modalOpen: boolean;
  groupToEdit: { id: number; name: string } | null;
  openModal: (group: { id: number; name: string }) => void;
  closeModal: () => void;
}

export const useChangeGroupNameModalStore = create<ChangeGroupNameModalState>((set) => ({
  modalOpen: false,
  groupToEdit: null,
  openModal: (group) => set({ modalOpen: true, groupToEdit: group }),
  closeModal: () => set({ modalOpen: false, groupToEdit: null }),
}));

interface ToggleBanGroupModalState {
  modalOpen: boolean;
  groupToToggle: { id: number; name: string; isBanned: boolean } | null;
  openModal: (group: { id: number; name: string; isBanned: boolean }) => void;
  closeModal: () => void;
}

export const useToggleBanGroupModalStore = create<ToggleBanGroupModalState>((set) => ({
  modalOpen: false,
  groupToToggle: null,
  openModal: (group) => set({ modalOpen: true, groupToToggle: group }),
  closeModal: () => set({ modalOpen: false, groupToToggle: null }),
}));

interface RemoveGroupMemberModalState {
  modalOpen: boolean;
  memberToRemove: { id: number; username: string } | null;
  openModal: (member: { id: number; username: string }) => void;
  closeModal: () => void;
}

export const useRemoveGroupMemberModalStore = create<RemoveGroupMemberModalState>((set) => ({
  modalOpen: false,
  memberToRemove: null,
  openModal: (member) => set({ modalOpen: true, memberToRemove: member }),
  closeModal: () => set({ modalOpen: false, memberToRemove: null }),
}));

type FileType = 'anonymous' | 'attack' | 'all';

interface GroupFilesStoreState {
  groupId: number | null;
  fileType: FileType;
  limit: number;
  setGroupId: (id: number | null) => void;
  setFileType: (type: FileType) => void;
  setLimit: (limit: number) => void;
  reset: () => void;
}

export const useGroupFilesStore = create<GroupFilesStoreState>((set) => ({
  groupId: null,
  fileType: 'all',
  limit: 20,

  setGroupId: (id) => set({ groupId: id }),
  setFileType: (type) => set({ fileType: type }),
  setLimit: (limit) => set({ limit }),
  reset: () => set({ groupId: null, fileType: 'all', limit: 20 }),
}));

