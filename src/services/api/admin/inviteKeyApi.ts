import axiosInstance from "@/services/axiosInstance";
import { APIResponse } from "@/types/api/responses/responseTypes";
import {
  InviteKey,
  InviteKeyListResponseData,
} from "@/types/api/responses/admin/inviteKeyResponses";

// Fetch invite keys with pagination
export const fetchInviteKeys = async (
  page: number = 1,
  perPage: number = 5
): Promise<InviteKeyListResponseData> => {
  try {
    const res = await axiosInstance.get("/admin/invite", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch invite keys");
  }
};

export const createInviteKey = async (): Promise<APIResponse<InviteKey>> => {
  try {
    const res = await axiosInstance.post("/admin/invite");
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create invite key");
  }
};

export const deleteInviteKey = async (
  key: string
): Promise<APIResponse<null>> => {
  try {
    const res = await axiosInstance.delete(`/admin/invite/${key}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete invite key");
  }
};
