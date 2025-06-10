import axiosInstance from "@/services/axiosInstance";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { GetGroupSubmissionResponseData, AttackListResponseData, AttackedFilesResponseData } from "@/types/api/responses/rankingResponses";

export const fetchPublicRanking = async (): Promise<APIResponse<any>> => {
  const res = await axiosInstance.get("/public/ranking");
  return res.data;
};

export const fetchGroupSubmissionFiles = async (groupId: number): Promise<APIResponse<GetGroupSubmissionResponseData>> => {
  const res = await axiosInstance.get<APIResponse<GetGroupSubmissionResponseData>>(`/anonym/list/${groupId}`);
  return res.data;
};

export const getAttackListByGroup = async (groupId: number): Promise<APIResponse<AttackListResponseData>> => {
  const res = await axiosInstance.get<APIResponse<AttackListResponseData>>(`/attack/list/${groupId}`);
  return res.data;
};

export const getAttackedFiles = async (groupIdAttack: number, groupIdDefense: number): Promise<APIResponse<AttackedFilesResponseData>> => {
  const res = await axiosInstance.get<APIResponse<AttackedFilesResponseData>>(`/attack/files/${groupIdAttack}/${groupIdDefense}`);
  return res.data;
};


