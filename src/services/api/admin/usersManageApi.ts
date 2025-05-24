import axiosInstance from "@/services/axiosInstance";
import { AdminChangeUserPasswordRequest } from "@/types/api/requests/adminRequests";
import { UsersInfoResponseData } from "@/types/api/responses/admin/usersInfoResponses";
import { APIResponse } from "@/types/api/responses/responseTypes";

export const fetchUsersList = async (
  page: number = 1,
  perPage: number = 5,
  search: string = ""
): Promise<UsersInfoResponseData> => {
  const res = await axiosInstance.get("/admin/user", {
    params: { page, per_page: perPage, search },
  });
  return res.data;
};

export const deleteUser = async (userId: number): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/admin/user/${userId}`);
  return res.data;
};

export const changeUserPassword = async (
  userId: number,
  body: AdminChangeUserPasswordRequest
): Promise<APIResponse<null>> => {
  console.log("FE API PAYLOAD:", body);
  const res = await axiosInstance.put<APIResponse<null>>(
    `/admin/user/${userId}/password`,
    body
  );
  return res.data;
};

