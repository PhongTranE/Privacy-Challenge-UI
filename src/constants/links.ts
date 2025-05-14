export const LINKS = {
  HOME: "/",
  RANKING: "/ranking",
  RULE: "/rules",
  ABOUT: "/about",

  START: "/start", //Replace the home section after successful login check

  AUTH: "/auth",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",

  EMAIL: "/email",
  VERIFY_ACCOUNT: "/email/verify-account",
  RESEND_ACTIVATE: "/email/resend-activation",
  RESET_PASSWORD: "/email/reset-password",

  //Ano and Attack
  SUBMISSION: "/anonymisation/submission",
  ATTACK: "/attack/submission",

  //Admin
  DASHBOARD: "/admin/dashboard",

  //Profile
  PROFILE: "/me/profile",
  CHANGE_PASSWORD: "/me/change-password",

  NOT_FOUND: "*",
} as const;
