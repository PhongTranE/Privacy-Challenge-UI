import { useFileUploadStore } from "@/stores/admin/uploadFileStore";
import { useNotify } from "@/hooks/useNotify";
import { useMutation } from "@tanstack/react-query";
import { UploadFileResponseData } from "@/types/api/responses/admin/uploadFileResponses";
import { validateUploadFile } from "@/utils/validations/fileValidation";

export const useUploadFile = () => {
  const { uploadFile } = useFileUploadStore();
  const { success, error: notifyError } = useNotify();

  const mutation = useMutation<UploadFileResponseData, Error, File>({
    mutationFn: async (file) => {
      validateUploadFile(file);
      const result = await uploadFile(file);
      if (!result) throw new Error("No data returned from server");
      return result;
    },
    onSuccess: (res) => {
      success("Success", res.message);
    },
    onError: (error) => {
      notifyError(error);
    },
  });

  return {
    handleUpload: mutation.mutateAsync,
    isUploading: mutation.isPending,
  };
};
