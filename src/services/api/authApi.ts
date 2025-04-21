import { RegisterRequestBody, LoginRequestBody, ResendActivationEmailRequestBody } from "@/types/api/requests/authRequests"
import { APIResponse } from "@/types/api/responses/responseTypes"
import { RegisterResponseData, LoginResponseData, MeResponseData } from "@/types/api/responses/authResponses"
import axios from "@/services/axiosInstance"
import { clearAccessToken } from "@/utils/token"

export const register = async (registerData: RegisterRequestBody): Promise<APIResponse<RegisterResponseData>> => {
    const res = await axios.post<APIResponse<RegisterResponseData>>('auth/register', registerData);
    return res.data;
}

export const login = async(loginData: LoginRequestBody): Promise<APIResponse<LoginResponseData>> => {
    const res = await axios.post<APIResponse<LoginResponseData>>('auth/login', loginData);
    return res.data;
}

export const logout = async(): Promise<APIResponse<null>> => {
    const res = await axios.post<APIResponse<null>>("auth/logout");
    clearAccessToken();
    return res.data;
}

export const checkAuth = async (): Promise<
    APIResponse<MeResponseData>
> => {
  const response =
    await axios.post<APIResponse<MeResponseData>>('/auth/me');
  return response.data;
};

export const resendActivationEmail = async(email: ResendActivationEmailRequestBody): Promise<APIResponse<null>> => {
  const response = await axios.post<APIResponse<null>>("auth/resend_activation", email);
  return response.data;
}

export const activateEmail = async(token: string): Promise<APIResponse<null>> => {
  const response = await axios.get<APIResponse<null>>(`auth/activation/${token}`);
  return response.data;
}