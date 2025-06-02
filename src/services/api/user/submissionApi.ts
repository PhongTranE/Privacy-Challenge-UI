import axiosInstance from '@/services/axiosInstance';
import {
  SubmissionListResponse,
  UploadSubmissionResponse,
  TogglePublishResponse,
  SubmissionDetailResponse,
} from '@/types/api/responses/user/submissionResponses';

// Lấy danh sách file đã nộp
export const getSubmissionList = async (): Promise<SubmissionListResponse> => {
  const res = await axiosInstance.get('/anonym/list');
  return res.data;
};

// Upload file ẩn danh
export const uploadSubmission = async (file: File): Promise<UploadSubmissionResponse> => {
  const formData = new FormData();
  if (file.size > 50 * 1024 * 1024) { // 50MB
    throw new Error("File size exceeds 50MB");
  }
  formData.append('file', file);
  const res = await axiosInstance.post('/anonym/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Publish/Unpublish file
export const togglePublish = async (anonymId: number): Promise<TogglePublishResponse> => {
  const res = await axiosInstance.patch(`/anonym/toggle-publish/${anonymId}`);
  return res.data;
};

// Lấy chi tiết file
export const getSubmissionDetail = async (anonymId: number): Promise<SubmissionDetailResponse> => {
  const res = await axiosInstance.get(`/anonym/result/${anonymId}`);
  return res.data;
};
