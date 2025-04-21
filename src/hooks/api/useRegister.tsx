import { useMutation } from '@tanstack/react-query';
import { register } from '@/services/api/authApi';
import { useNotify } from '../useNotify';
import { APIResponse } from '@/types/api/responses/responseTypes';
import { RegisterResponseData } from '@/types/api/responses/authResponses';
import { useNavigate } from 'react-router-dom';
import { LINKS } from '@/constants/links';
import { useEmailPendingStore } from '@/stores/emailStore';

export const useRegister = () => {
  const { success, error } = useNotify();
  const navigate = useNavigate();
  const { setPendingEmail } = useEmailPendingStore()

  return useMutation({
    mutationFn: register,

    onSuccess: (res: APIResponse<RegisterResponseData>) => {

      if (res.status !== 'success' || !res.data) {
        error(res); 
        return;
      }
      const { user } = res.data;

      console.log('Register successful!', user);
      const message = res.message as string;
      success(message, `Welcome, ${user.username ?? 'user'}. Please check your email to activate account!`);
      setPendingEmail(user.email);
      navigate(LINKS.VERIFY_ACCOUNT)
    },

    onError: (err: unknown) => {
        console.error(err)
      error(err);
    },
  });
};