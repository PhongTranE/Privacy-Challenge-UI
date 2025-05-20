import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFileList, deleteFile } from "@/services/api/admin/fileApi";
import { useNotify } from "@/hooks/useNotify";

export const useFileList = () => {
  const { success, error } = useNotify();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["files"],
    queryFn: getFileList,
  });

  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      success("File deleted successfully");
    },
    onError: (err) => {
      error(err);
    },
  });

  return {
    files: data?.data ?? [],
    isLoading,
    deleteFile: deleteFileMutation.mutate,
  };
}; 