import { APIResponse } from "@/types/api/responses/responseTypes";

export interface SubmissionFile {
  id: number;
  name: string;
  status: string;
  utility: number;
  naiveAttack: number;
  isPublished: boolean;
  createdAt: string;
}

export type SubmissionListResponse = APIResponse<SubmissionFile[]>;
export type UploadSubmissionResponse = APIResponse<{ anonymId: number }>;
export type TogglePublishResponse = APIResponse<{ isPublished: boolean }>;
export type SubmissionDetailResponse = APIResponse<SubmissionFile>;