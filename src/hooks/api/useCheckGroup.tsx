import { useMutation } from '@tanstack/react-query';
import { checkGroup } from '@/services/api/authApi';
import { useNotify } from '../useNotify';
import { APIResponse } from '@/types/api/responses/responseTypes';

export const useCheckGroup = () => {
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: (groupName: string) => checkGroup(groupName),

    onSuccess: (res: APIResponse<{ group: string }>) => {
      if (res.status !== 'success') {
        error(res);
        return;
      }

      const message = res.message as string;
      success(message, `Group "${res.data?.group}" is available.`);
    },

    onError: (err: unknown) => {
      error(err);
    },
  });
};