// Type for authentication related requests

export interface RegisterRequestBody {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
}

export interface LoginRequestBody {
    username: string;
    password: string;
}

export interface ForgotPasswordRequestBody {
    email: string;
}

export interface ResetPasswordRequestBody {
    newpassword: string;
}

export interface ResendActivationEmailRequestBody {
    email: string
}