import axiosInstance from "@/services/axiosInstance";
import { AxiosResponse } from "axios";
import {
  CompetitionStatusResponse,
  PhaseControlRequest,
  PhaseStatus,
  RestartCompetitionResponse,
} from "@/types/api/responses/admin/competitionResponses";

export const getCompetitionStatus = async (): Promise<AxiosResponse<CompetitionStatusResponse>> => {
  const response = await axiosInstance.get("/admin/competition/status");
  return response.data;
};

export const controlPhase = async (data: PhaseControlRequest): Promise<AxiosResponse<PhaseStatus>> => {
  const response = await axiosInstance.post("/admin/competition/phase", data);
  return response.data;
};

export const restartCompetition = async (): Promise<AxiosResponse<RestartCompetitionResponse>> => {
  const response = await axiosInstance.post("/admin/competition/restart");
  return response.data;
};