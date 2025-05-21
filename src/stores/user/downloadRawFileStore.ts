import { create } from "zustand";

interface DownloadRawFileState {
  isDownloading: boolean;
  error: string | null;
  setDownloading: (isDownloading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDownloadFileStore = create<DownloadRawFileState>((set) => ({
  isDownloading: false,
  error: null,
  setDownloading: (isDownloading) => set({ isDownloading }),
  setError: (error) => set({ error }),
}));
