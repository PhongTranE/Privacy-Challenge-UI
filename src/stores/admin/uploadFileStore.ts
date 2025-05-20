import { create } from "zustand";
import { uploadFile } from "@/services/api/admin/fileApi";
import { UploadFileResponseData } from "@/types/api/responses/admin/fileResponses";
import { MAX_FILE_SIZE } from "@/utils/validations/fileValidation";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { DuplicateFileResponseData } from "@/types/api/responses/admin/fileResponses";

interface FileUploadState {
  isUploading: boolean;
  uploadedFile: UploadFileResponseData | null;

  uploadFile: (file: File, options?: { overwrite?: boolean; auto_rename?: boolean }) => Promise<APIResponse<UploadFileResponseData> | APIResponse<DuplicateFileResponseData>>;
  resetState: () => void;
}

export const useFileUploadStore = create<FileUploadState>((set) => ({
  isUploading: false,
  uploadedFile: null,

  uploadFile: async (
    file: File,
    options?: { overwrite?: boolean; auto_rename?: boolean }
  ): Promise<APIResponse<UploadFileResponseData> | APIResponse<DuplicateFileResponseData>> => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 50MB limit");
    }
    set({ isUploading: true });
    try {
      const res = await uploadFile(file, options);
      set({
        isUploading: false,
        uploadedFile:
          res.status === "success" &&
          res.data &&
          "filePath" in res.data &&
          "extractedFilePath" in res.data &&
          "fileId" in res.data
            ? res.data
            : null,
      });
      return res;
    } catch (error: any) {
      set({ isUploading: false });
      throw error;
    }
  },

  resetState: () => {
    set({
      isUploading: false,
      uploadedFile: null,
    });
  },
}));
