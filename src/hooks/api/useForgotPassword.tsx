import { useNotify } from "@/hooks/useNotify";
import { forgotPassword } from "@/services/api/authApi";
import { ForgotPasswordResponseData } from "@/types/api/responses/authResponses";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  const { success, error } = useNotify();

  return useMutation({
    
    mutationFn: forgotPassword,

    onSuccess: (res: APIResponse<ForgotPasswordResponseData>) => {

      if (res.status !== "success") {
        error(res);
        return;
      }

      const message = res.message as string;
      success(message, `Please check your email to reset password!`);
    },
    
    onError: (err: unknown) => {
      error(err);
    },
  });
};
