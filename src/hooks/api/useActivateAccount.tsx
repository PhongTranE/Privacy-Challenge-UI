import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { activateEmail } from '@/services/api/authApi';
import { useNotify } from '../useNotify';
import { APIResponse } from '@/types/api/responses/responseTypes';
import { useEmailPendingStore } from '@/stores/emailStore';

type ActivateAccountInput = string;

export const useActivateAccount = (
  options?: UseMutationOptions<APIResponse<null>, unknown, ActivateAccountInput>
) => {
  const { success, error } = useNotify();
  const { setPendingEmail } = useEmailPendingStore();

  return useMutation<APIResponse<null>, unknown, ActivateAccountInput>({
    mutationFn: activateEmail,

    onSuccess: (res, variables, context) => {
      if (res.status !== 'success') {
        error(res);
        options?.onError?.(res as any, variables, context);
        return;
      }

      setPendingEmail(null);

      const message = res.message as string;
      success(message, 'Your account has been activated!');
      options?.onSuccess?.(res, variables, context);
    },

    onError: (err, variables, context) => {
      console.error('Activation failed:', err);
      error(err);
      options?.onError?.(err, variables, context);
    },

    ...options,
  });
};