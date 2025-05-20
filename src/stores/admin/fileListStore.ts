import { create } from "zustand";
import { getFileList, deleteFile, activateFile } from "@/services/api/admin/fileApi";
import { FileResponse } from "@/types/api/responses/admin/fileResponses";
import { useNotify } from "@/hooks/useNotify";

interface FileListState {
  files: FileResponse[];
  isLoading: boolean;
  error: string | null;
  activatingFileId: number | null;
  deletingFileId: number | null;
  
  fetchFiles: () => Promise<void>;
  deleteFile: (fileId: number) => Promise<void>;
  activateFile: (fileId: number) => Promise<void>;
  resetState: () => void;
}

export const useFileListStore = create<FileListState>((set) => ({
  files: [],
  isLoading: false,
  error: null,
  activatingFileId: null,
  deletingFileId: null,

  fetchFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getFileList();
      if (res.status === "success") {
        set({ files: res.data || [], isLoading: false });
      } else {
        set({ error: typeof res.message === "string" ? res.message : "Error", isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch files", isLoading: false });
    }
  },

  deleteFile: async (fileId: number) => {
    set({ deletingFileId: fileId, error: null });
    const { success, error: notifyError } = useNotify();
    try {
      const res = await deleteFile(fileId);
      if (res.status === "success") {
        success("Success", typeof res.message === "string" ? res.message : "Deleted");
        await useFileListStore.getState().fetchFiles();
      } else {
        notifyError(typeof res.message === "string" ? res.message : "Error");
      }
    } catch (error: any) {
      notifyError(error.message || "Failed to delete file");
      set({ error: error.message || "Failed to delete file" });
    } finally {
      set({ deletingFileId: null });
    }
  },

  activateFile: async (fileId: number) => {
    set({ activatingFileId: fileId, error: null });
    const { success, error: notifyError } = useNotify();
    try {
      const res = await activateFile(fileId);
      if (res.status === "success") {
        success("Success", typeof res.message === "string" ? res.message : "Activated");
        await useFileListStore.getState().fetchFiles();
      } else {
        notifyError(typeof res.message === "string" ? res.message : "Error");
        set({ error: typeof res.message === "string" ? res.message : "Error" });
      }
    } catch (error: any) {
      notifyError(error.message || "Failed to activate file");
    } finally {
      set({ activatingFileId: null });
    }
  },

  resetState: () => {
    set({
      files: [],
      isLoading: false,
      error: null,
      activatingFileId: null,
      deletingFileId: null,
    });
  },
})); 