import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api/authApi";
import { useNotify } from "@/hooks/useNotify";
import { APIResponse } from "@/types/api/responses/responseTypes";
import { useAuthStore } from "@/stores/authStore";
import { setAccessToken } from "@/utils/token";
import { LoginResponseData } from "@/types/api/responses/authResponses";
import { useEmailPendingStore } from "@/stores/emailStore";
import { useNavigate } from "react-router-dom";
import { LINKS } from "@/constants/links";
export const useLogin = () => {
  const { success, error } = useNotify();
  const { authenticate } = useAuthStore();
  const { setPendingEmail } = useEmailPendingStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,

    onSuccess: (res: APIResponse<LoginResponseData>) => {
      if (res.status !== "success" || !res.data) {
        error(res); // fallback to error toast
        return;
      }
      const { accessToken, user } = res.data;
      if (!user.isActive) {
        // Handle inactive account first - DON'T set any auth state
        console.log("User is not active, navigating to verify account");
        setPendingEmail(user.email); // lưu lại email từ login
        success(
          "Account verification required", 
          "Please check your email and click the activation link, or resend the activation email."
        );
        
        // Navigate immediately without setting any auth state
        navigate(LINKS.VERIFY_ACCOUNT);
        return;
      }

      // Handle successful login for active account
      if (accessToken) {
        setAccessToken(accessToken);
      }
      if (user) {
        authenticate(user); // Only authenticate active users
      }
      console.log("Login successful!", accessToken, user);
      const message = res.message as string;
      success(message, `Welcome back, ${user.username ?? "user"}!`);
    },

    onError: (err: unknown) => {
      // Check if error is due to inactive account
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        const errorMessage = axiosError?.response?.data?.message;
        const statusCode = axiosError?.response?.status;
        
        console.log("Error details:", { errorMessage, statusCode });
        
        if (statusCode === 401 && errorMessage === "Account is not activated.") {
          // Navigate to resend-activation page where user can enter email manually
          success(
            "Account verification required",
            "Please enter your email to resend the activation link."
          );
          navigate(LINKS.RESEND_ACTIVATE);
          return;
        }
      }
      // Handle other errors normally
      error(err);
    },
  });
};