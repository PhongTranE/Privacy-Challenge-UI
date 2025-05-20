import axiosInstance from "@/services/axiosInstance";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { FileListResponseData, UploadFileResponseData, DuplicateFileResponseData } from "@/types/api/responses/admin/fileResponses";

export const uploadFile = async (
  file: File,
  options?: { overwrite?: boolean; auto_rename?: boolean }
): Promise<APIResponse<UploadFileResponseData> | APIResponse<DuplicateFileResponseData>> => {
  const formData = new FormData();
  formData.append("file", file);
  if (options?.overwrite) formData.append("overwrite", "true");
  if (options?.auto_rename) formData.append("auto_rename", "true");
  const res = await axiosInstance.post("/admin/upload", formData, {
    headers: { "Content-Type": undefined },
    validateStatus: () => true,
  });
  return res.data;
};

export const getFileList = async (): Promise<APIResponse<FileListResponseData>> => {
  const res = await axiosInstance.get("/admin/files");
  return res.data;
};

export const deleteFile = async (fileId: number): Promise<APIResponse<null>> => {
  const res = await axiosInstance.delete(`/admin/files/${fileId}`);
  return res.data;
};

export const activateFile = async (fileId: number): Promise<APIResponse<{ id: number; is_active: boolean }>> => {
  const res = await axiosInstance.patch(`/admin/files/${fileId}/activate`);
  return res.data;
};
