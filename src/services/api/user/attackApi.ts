import axiosInstance from '@/services/axiosInstance';
import { APIResponse } from '@/types/api/responses/responseTypes';
import {
  PublishedFile,
  AttackHistory,
  AttackTeam,
  MyAttackScore,
  AttackUploadResult,
} from '@/types/api/responses/user/attackResponses';

// Get list of teams with published files (excluding my team)
export const fetchTeamsWithPublished = async (): Promise<APIResponse<AttackTeam[]>> => {
  const res = await axiosInstance.get<APIResponse<AttackTeam[]>>(
    '/attack/teams-with-published'
  );
  return res.data;
};

// Get list of published files of a team
export const fetchPublishedFiles = async (groupId: number): Promise<APIResponse<PublishedFile[]>> => {
  const res = await axiosInstance.get<APIResponse<PublishedFile[]>>(
    `/attack/${groupId}/published-files`
  );
  return res.data;
};

// Get attack score of my team on a file
export const fetchMyAttackScore = async (anonymId: number): Promise<APIResponse<MyAttackScore>> => {
  const res = await axiosInstance.get<APIResponse<MyAttackScore>>(
    `/attack/${anonymId}/my-score`
  );
  return res.data;
};

// Get attack history of my team on a file
export const fetchMyAttackHistory = async (anonymId: number): Promise<APIResponse<AttackHistory[]>> => {
  const res = await axiosInstance.get<APIResponse<AttackHistory[]>>(
    `/attack/${anonymId}/my-attacks`
  );
  return res.data;
};

// Get all attack history for a file (all teams)
export const fetchAttackHistory = async (anonymId: number): Promise<APIResponse<any[]>> => {
  const res = await axiosInstance.get<APIResponse<any[]>>(`/attack/${anonymId}/history`);
  return res.data;
};

// Upload attack file
export const uploadAttackFile = async (
  anonymId: number,
  file: File
): Promise<APIResponse<AttackUploadResult>> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axiosInstance.post<APIResponse<AttackUploadResult>>(
    `/attack/${anonymId}/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};

// Download file publish
export const downloadPublishedFile = async (anonymId: number): Promise<Blob> => {
  const res = await axiosInstance.get(
    `/attack/${anonymId}/download`,
    { responseType: 'blob' }
  );  
  return res.data;
};
