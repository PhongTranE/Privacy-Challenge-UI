import { useMutation, useQuery } from "@tanstack/react-query";
import { downloadRawFile, checkActiveRawFile } from "@/services/api/user/downloadRawFileApi";
import { useNotify } from "@/hooks/useNotify";

export const useDownloadRawFile = () => {
  const { success, error } = useNotify();

  const { data: hasActiveRawFile, isLoading: isChecking } = useQuery({
    queryKey: ["checkActiveRawFile"],
    queryFn: async () => {
      try {
        await checkActiveRawFile();
        return true;
      } catch (e) {
        return false;
      }
    },
    retry: false,
  });

  const downloadMutation = useMutation({
    mutationFn: downloadRawFile,
    onSuccess: () => {
      success("File downloaded successfully!");
    },
    onError: (err: Error) => {
      error(err.message || "Failed to download file");
    },
  });

  return {
    mutate: downloadMutation.mutate,
    isPending: downloadMutation.isPending || isChecking,
    hasActiveRawFile: hasActiveRawFile ?? false,
  };
}; 