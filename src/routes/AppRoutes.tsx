import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LINKS } from '@/constants/links';
import { Loader } from '@mantine/core';
import AuthLayout from '@/layouts/AuthLayout';
import EmailActionLayout from '@/layouts/EmailActionLayout';

// const AppLayout = lazy(() => import('@/layouts/AppLayout'));
// const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ActivationPage = lazy(() => import('@/pages/auth/email/ActivationPage'));
const ResultActivationPage = lazy(() => import('@/pages/auth/email/ResultActivationPage'));
// const ResetPasswordEmailPage = lazy(() => import('@/pages/email/ResetPasswordEmailPage'));

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Auth routes */}
                <Route path={LINKS.AUTH} element={<AuthLayout />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>
                <Route path={LINKS.EMAIL} element={<EmailActionLayout />}>
                    <Route path="verify-account" element={<ActivationPage />} />
                    <Route path="activate" element={<ResultActivationPage />} />
                    {/* <Route path="reset-password" element={<ResetPasswordEmailPage />} /> */}
                </Route>
            </Routes>
        </Suspense>
    )
}


export default  AppRoutes;
