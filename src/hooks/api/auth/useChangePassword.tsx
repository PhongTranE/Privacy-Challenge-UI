import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/api/authApi";
import { ChangePasswordInput } from "@/utils/validations/authValidations";
import { useNotify } from "@/hooks/useNotify";
import { APIResponse } from "@/types/api/responses/responseTypes";

export const useChangePassword = () => {
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: (changePasswordData: ChangePasswordInput) => changePassword(changePasswordData),
    onSuccess: (res: APIResponse<null>) => {
      if (res.status !== "success") {
        error(res);
        return;
      }
      success(res.status, res.message as string);
    },
    onError: (err: unknown) => {
        error(err);
    },
  });
};
