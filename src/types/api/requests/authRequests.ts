// Type for authentication related requests

export interface RegisterRequestBody {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  group_name: string;
  invite_key: string;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface ForgotPasswordRequestBody {
  email: string;
}

export interface ResetPasswordRequestBody {
  new_password: string;
}

export interface ResendActivationEmailRequestBody {
  email: string;
}

export interface ChangePasswordRequestBody {
  old_password: string;
  new_password: string;
  confirm_password: string;
}