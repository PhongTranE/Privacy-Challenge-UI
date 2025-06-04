import axiosInstance from '@/services/axiosInstance';
import { APIResponse } from '@/types/api/responses/responseTypes';
import {
  PublishedFile,
  AttackHistory,
  AttackTeam,
} from '@/types/api/responses/user/attackResponses';

// Lấy danh sách các team có file publish (trừ team mình)
export const fetchTeamsWithPublished = async (): Promise<APIResponse<AttackTeam[]>> => {
  const res = await axiosInstance.get<APIResponse<AttackTeam[]>>(
    '/attack/teams-with-published'
  );
  return res.data;
};

// Lấy danh sách file đã publish của 1 team
export const fetchPublishedFiles = async (groupId: number): Promise<APIResponse<PublishedFile[]>> => {
  const res = await axiosInstance.get<APIResponse<PublishedFile[]>>(
    `/attack/${groupId}/published-files`
  );
  return res.data;
};

// Lấy điểm attack của team mình lên 1 file
export const fetchMyAttackScore = async (anonymId: number): Promise<APIResponse<number>> => {
  const res = await axiosInstance.get<APIResponse<number>>(
    `/attack/${anonymId}/my-score`
  );
  return res.data;
};

// Lấy lịch sử các lần attack của team mình lên 1 file
export const fetchMyAttackHistory = async (anonymId: number): Promise<APIResponse<AttackHistory[]>> => {
  const res = await axiosInstance.get<APIResponse<AttackHistory[]>>(
    `/attack/${anonymId}/my-attacks`
  );
  return res.data;
}; 