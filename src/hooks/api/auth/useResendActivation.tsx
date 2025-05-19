import { useMutation } from '@tanstack/react-query';
import { resendActivationEmail } from '@/services/api/authApi';
import { useNotify } from '../useNotify';
import { APIResponse } from '@/types/api/responses/responseTypes';

export const useResendActivation = () => {
  const { success, error } = useNotify();
  return useMutation({
    mutationFn: resendActivationEmail,

    onSuccess: (res: APIResponse<null>) => {

      if (res.status !== 'success') {
        error(res); 
        return;
      }

      console.log('Resend activation email successful!');
      const message = res.message as string
      success(message, `Please check your email to activate account!`);
    },

    onError: (err: unknown) => {
        console.error(err)
      error(err);
    },
  });
};