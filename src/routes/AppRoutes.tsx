import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LINKS } from '@/constants/links';
import { Loader } from '@mantine/core';
import AuthLayout from '@/layouts/AuthLayout';
import EmailActionLayout from '@/layouts/EmailActionLayout';
// import ProtectedRoutes from "./ProtectedRoutes";
import AppLayout from '@/layouts/AppLayout';

// const AppLayout = lazy(() => import('@/layouts/AppLayout'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const RulesPage = lazy(() => import('@/pages/RulesPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ActivationPage = lazy(() => import('@/pages/auth/email/ActivationPage'));
const ForgotPasswordPage = lazy(
  () => import('@/pages/auth/ForgotPasswordPage')
);
const ResetPasswordEmailPage = lazy(
  () => import('@/pages/auth/email/ResetPasswordEmailPage')
);
const ResultActivationPage = lazy(
  () => import('@/pages/auth/email/ResultActivationPage')
);
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* AppLayout route */}
        <Route element={<AppLayout />}>
          <Route path={LINKS.HOME} element={<HomePage />} />
          <Route path={LINKS.RULE} element={<RulesPage />} />
          <Route path={LINKS.ABOUT} element={<AboutPage />} />

          {/* AuthLayout route */}
          <Route path={LINKS.AUTH} element={<AuthLayout />}>
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />
            <Route path='forgot-password' element={<ForgotPasswordPage />} />
          </Route>

          {/* EmailActionLayout route */}
          <Route path={LINKS.EMAIL} element={<EmailActionLayout />}>
            <Route path='verify-account' element={<ActivationPage />} />
            <Route path='activate' element={<ResultActivationPage />} />
            <Route path='reset-password' element={<ResetPasswordEmailPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path={LINKS.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
