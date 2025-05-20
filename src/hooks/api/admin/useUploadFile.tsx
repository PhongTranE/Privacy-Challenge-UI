import { useFileUploadStore } from "@/stores/admin/uploadFileStore";
import { useMutation } from "@tanstack/react-query";
import {
  UploadFileResponseData,
  DuplicateFileResponseData,
} from "@/types/api/responses/admin/fileResponses";
import { useNotify } from "@/hooks/useNotify";
import { APIResponse } from "@/types/api/responses/responseTypes";

export const useUploadFile = () => {
  const { uploadFile } = useFileUploadStore();
  const { success, error } = useNotify();

  const mutation = useMutation<
    | APIResponse<UploadFileResponseData>
    | APIResponse<DuplicateFileResponseData>,
    Error,
    { file: File; options?: { overwrite?: boolean; auto_rename?: boolean } }
  >({
    mutationFn: async ({ file, options }) => {
      const store = useFileUploadStore.getState();
      store.resetState();
      const res = await uploadFile(file, options);
      if (res.status === "success") {
        success("Success", "Upload file successfully");
        return res;
      }
      // Nếu là lỗi file trùng tên (409) thì throw để UI show modal xác nhận
      if (
        res.status === "error" &&
        typeof res.data === "object" &&
        res.data &&
        "filename" in res.data
      ) {
        throw Object.assign(new Error("File name already exists"), {
          duplicate: true,
          filename: res.data.filename,
        });
      }
      // Lỗi khác
      error(
        typeof res.message === "string" ? res.message : "Upload file failed"
      );
      throw new Error(
        typeof res.message === "string" ? res.message : "Upload file failed"
      );
    },
  });

  return {
    handleUpload: (
      file: File,
      options?: { overwrite?: boolean; auto_rename?: boolean }
    ) => mutation.mutateAsync({ file, options }),
    isUploading: mutation.isPending,
  };
};
