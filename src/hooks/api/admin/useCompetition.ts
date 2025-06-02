import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { controlPhase, getCompetitionStatus, restartCompetition } from "@/services/api/admin/competitionApi";
import { useNotify } from "@/hooks/useNotify";

export const useCompetitionStatus = () => {
  return useQuery({
    queryKey: ["admin", "competition-status"],
    queryFn: getCompetitionStatus,
  });
};

export const usePhaseControl = () => {
  const {success, error} = useNotify();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: controlPhase,
    onSuccess: () => {
      success("Success","Phase updated!");
      queryClient.invalidateQueries({ queryKey: ["admin", "competition-status"] });
    },
    onError: (err: any) => {
      if (err?.response?.data?.message) {
        error(err.response.data.message);  // Show detailed error message from backend
      } else {
        error("An unexpected error occurred.");
      }
    },
  });
};

export const useRestartCompetition = () => {
  const {success, error} = useNotify();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restartCompetition,
    onSuccess: () => {
      success("Success","Competition restarted!");
      queryClient.invalidateQueries({ queryKey: ["admin", "competition-status"] });
    },
    onError: (err: any) => {
      error("Error",err?.response?.data?.message || "Restart failed");
    },
  });
};