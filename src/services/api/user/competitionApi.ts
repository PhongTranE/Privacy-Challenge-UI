import axiosInstance from "@/services/axiosInstance";
import { AxiosResponse } from "axios";
import { CompetitionStatusUserResponse } from "@/types/api/responses/user/competitionResponses";

export const getCompetitionStatusUser = async (): Promise<AxiosResponse<CompetitionStatusUserResponse>> => {
  const response = await axiosInstance.get("/auth/competition/status");
  return response.data;
}; 