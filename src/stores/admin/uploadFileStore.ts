import { create } from "zustand";
import { uploadFile } from "@/services/api/admin/fileApi";
import { UploadFileResponseData } from "@/types/api/responses/admin/uploadFileResponses";

interface FileUploadState {
  isUploading: boolean;
  uploadedFile: UploadFileResponseData | null;

  uploadFile: (file: File) => Promise<UploadFileResponseData | null>;
  resetState: () => void;
}

export const useFileUploadStore = create<FileUploadState>((set) => ({
  isUploading: false,
  uploadedFile: null,

  uploadFile: async (file: File) => {
    set({ isUploading: true });
    const res = await uploadFile(file);

    // Thành công nếu có file_path, extracted_file_path, hoặc message chứa 'success'
    const isSuccess =
      !!res.file_path ||
      !!res.extracted_file_path ||
      (typeof res.message === "string" &&
        res.message.toLowerCase().includes("success"));

    if (!isSuccess) {
      set({ isUploading: false });
      throw new Error(
        typeof res.message === "string" ? res.message : "Upload failed"
      );
    }

    set({
      uploadedFile: res,
      isUploading: false,
    });
    return res;
  },

  resetState: () => {
    set({
      isUploading: false,
      uploadedFile: null,
    });
  },
}));
