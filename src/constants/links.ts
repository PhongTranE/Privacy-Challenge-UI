export const LINKS = {
  HOME: "/",
  RULE: "/rules",
  ABOUT: "/about",
  KEY: "/key",

  AUTH: "/auth",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",

  EMAIL: "/email",
  VERIFY_ACCOUNT: "/email/verify-account",
  RESET_PASSWORD: "/email/reset-password",
  
  PROFILE: "/me",
  CHANGE_PASSWORD: "/me/change-password",
  NOT_FOUND: "*",
} as const;
