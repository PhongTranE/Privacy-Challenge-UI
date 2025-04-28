import { useMutation } from "@tanstack/react-query";
import { useNotify } from "@/hooks/useNotify";
import { resetPassword } from "@/services/api/authApi";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { ResetPasswordResponseData } from "@/types/api/responses/authResponses";

export const useResetPassword = () => {
  const { success, error } = useNotify();

  return useMutation({
    mutationFn: ({
      token,
      body,
    }: {
      token: string;
      body: { new_password: string };
    }) => resetPassword(token, body),

    onSuccess: (res: APIResponse<ResetPasswordResponseData>) => {
      if (res.status !== "success") {
        error(res);
        return;
      }

      const message = res.message as string;
      success(message, `Welcome back!`);
    },
    onError: (err: unknown) => {
      error(err);
    },
  });
};
