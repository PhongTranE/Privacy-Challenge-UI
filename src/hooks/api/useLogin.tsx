import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/api/authApi';
import { useNotify } from '../useNotify';
import { APIResponse } from '@/types/api/responses/responseTypes';
import { useAuthStore } from '@/stores/authStore';
import { setAccessToken } from '@/utils/token';
import { LoginResponseData } from '@/types/api/responses/authResponses';
export const useLogin = () => {
  const { success, error } = useNotify();
  const { authenticate } = useAuthStore()
  return useMutation({
    mutationFn: login,

    onSuccess: (res: APIResponse<LoginResponseData>) => {

      if (res.status !== 'success' || !res.data) {
        error(res); // fallback to error toast
        return;
      }
      const { accessToken, user } = res.data;
      if (accessToken) {
        setAccessToken(accessToken);
      }
      if (user){
        authenticate(user)
      }
      console.log('Login successful!', accessToken, user);
      const message = res.message as string
      success(message, `Welcome back, ${user.username ?? 'user'}!`);
    },

    onError: (err: unknown) => {
      error(err);
    },
  });
};