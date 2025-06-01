import {
  RegisterRequestBody,
  LoginRequestBody,
  ResendActivationEmailRequestBody,
  ForgotPasswordRequestBody,
  ResetPasswordRequestBody,
  ChangePasswordRequestBody,
} from "@/types/api/requests/authRequests";
import { APIResponse } from "@/types/api/responses/responseTypes";
import {
  RegisterResponseData,
  LoginResponseData,
  MeResponseData,
} from "@/types/api/responses/authResponses";
import { clearAccessToken } from "@/utils/token";
import { useAuthStore } from "@/stores/authStore";
import axiosInstance from "../axiosInstance";

export const register = async (
  registerData: RegisterRequestBody
): Promise<APIResponse<RegisterResponseData>> => {
  const res = await axiosInstance.post<APIResponse<RegisterResponseData>>(
    "auth/register",
    registerData
  );
  return res.data;
};

export const login = async (
  loginData: LoginRequestBody
): Promise<APIResponse<LoginResponseData>> => {
  const res = await axiosInstance.post<APIResponse<LoginResponseData>>(
    "auth/login",
    loginData
  );
  return res.data;
};

export const logout = async (): Promise<APIResponse<null>> => {
  try {
    const response = await axiosInstance.post<APIResponse<null>>("auth/logout");
    
    // Sau khi call API thành công, cập nhật store và xóa token
    useAuthStore.getState().unauthenticate();
    clearAccessToken();
    
    return response.data;
  } catch (error) {
    console.error("Logout API error:", error);
    // Ngay cả khi call API thất bại, vẫn logout ở frontend
    useAuthStore.getState().unauthenticate();
    clearAccessToken();
    throw error;
  }
};

export const checkAuth = async (): Promise<APIResponse<MeResponseData>> => {
  const res = await axiosInstance.get<APIResponse<MeResponseData>>("auth/me");
  return res.data;
};

export const resendActivationEmail = async (
  email: ResendActivationEmailRequestBody
): Promise<APIResponse<null>> => {
  const res = await axiosInstance.post<APIResponse<null>>(
    "auth/resend-activation",
    email
  );
  return res.data;
};

export const activateEmail = async (
  token: string
): Promise<APIResponse<null>> => {
  const res = await axiosInstance.get<APIResponse<null>>(
    `auth/activation/${token}`
  );
  return res.data;
};

export const forgotPassword = async (
  forgotPasswordData: ForgotPasswordRequestBody
): Promise<APIResponse<null>> => {
  const res = await axiosInstance.post<APIResponse<null>>(
    "auth/forgot-password",
    forgotPasswordData
  );
  return res.data;
};

export const resetPassword = async (
  token: string,
  resetPasswordData: ResetPasswordRequestBody
): Promise<APIResponse<null>> => {
  const res = await axiosInstance.post<APIResponse<null>>(
    `auth/reset-password/${token}`,
    resetPasswordData
  );
  return res.data;
};

export const checkGroup = async (
  groupName: string
): Promise<APIResponse<{ group: string }>> => {
  const res = await axiosInstance.get<APIResponse<{ group: string }>>(
    "auth/check-group",
    {
      params: { name: groupName }, // adds ?name=groupName to URL
    }
  );
  return res.data;
};

export const changePassword = async (
  changePasswordData: ChangePasswordRequestBody
): Promise<APIResponse<null>> => {
  const res = await axiosInstance.post<APIResponse<null>>("auth/change-password", changePasswordData);
  return res.data;
};
