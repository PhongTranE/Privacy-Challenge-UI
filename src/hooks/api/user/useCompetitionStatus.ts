import { useQuery } from "@tanstack/react-query";
import { getCompetitionStatusUser } from "@/services/api/user/competitionApi";

export const useCompetitionStatusUser = () => {
  return useQuery({
    queryKey: ["user", "competition-status"],
    queryFn: getCompetitionStatusUser,
  });
}; 