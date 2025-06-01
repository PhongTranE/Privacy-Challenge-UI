import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LINKS } from "@/constants/links";
import { Loader } from "@mantine/core";
import AuthLayout from "@/layouts/AuthLayout";
import EmailActionLayout from "@/layouts/EmailActionLayout";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoutes from "./ProtectedRoutes";

// const AppLayout = lazy(() => import('@/layouts/AppLayout'));
const HomePage = lazy(() => import("@/pages/public/HomePage"));
const DashboardPage = lazy(() => import("@/pages/protected/DashboardPage"));
const SubmissionPage = lazy(() => import("@/pages/protected/SubmissionPage"));
const StartingPage = lazy(() => import("@/pages/protected/StartingPage"));
const AttackPage = lazy(() => import("@/pages/protected/AttackPage"));
const ProfilePage = lazy(() => import("@/pages/protected/ProfilePage"));
const ChangePasswordPage = lazy(() => import("@/pages/auth/ChangePasswordPage"));

const RulesPage = lazy(() => import("@/pages/public/RulesPage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const RankingPage = lazy(() => import("@/pages/public/RankingPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ActivationPage = lazy(() => import("@/pages/auth/email/ActivationPage"));
const ResendActivationPage = lazy(
  () => import("@/pages/auth/email/ResendActivationPage")
);
const ForgotPasswordPage = lazy(
  () => import("@/pages/auth/ForgotPasswordPage")
);
const ResetPasswordEmailPage = lazy(
  () => import("@/pages/auth/email/ResetPasswordEmailPage")
);
const ResultActivationPage = lazy(
  () => import("@/pages/auth/email/ResultActivationPage")
);
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* AppLayout route */}
        <Route element={<AppLayout />}>
          {/* Public route  */}
          <Route path={LINKS.HOME} element={<HomePage />} />
          <Route path={LINKS.RANKING} element={<RankingPage />} />
          <Route path={LINKS.RULE} element={<RulesPage />} />
          <Route path={LINKS.ABOUT} element={<AboutPage />} />

          {/* AuthLayout route */}
          <Route path={LINKS.AUTH} element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* EmailActionLayout route */}
          <Route path={LINKS.EMAIL} element={<EmailActionLayout />}>
            <Route path="verify-account" element={<ActivationPage />} />
            <Route
              path="resend-activation"
              element={<ResendActivationPage />}
            />
            <Route path="activate" element={<ResultActivationPage />} />
            <Route path="reset-password" element={<ResetPasswordEmailPage />} />
          </Route>
        </Route>

        {/* Protected route  */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path={LINKS.START} element={<StartingPage />} />
            <Route path={LINKS.DASHBOARD} element={<DashboardPage />} />
            <Route path={LINKS.SUBMISSION} element={<SubmissionPage />} />
            <Route path={LINKS.ATTACK} element={<AttackPage />} />
            <Route path={LINKS.PROFILE} element={<ProfilePage />} />
            <Route path={LINKS.AUTH} element={<AuthLayout />}>
              <Route path={LINKS.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
            </Route>
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path={LINKS.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
