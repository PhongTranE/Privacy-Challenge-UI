import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Loader, Center } from '@mantine/core';
import { LINKS } from '@/constants/links';

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort(); // sau 10s tự cancel
      }, 10000);

      try {
        await checkAuth();
      } catch (err) {
        // Auth check failed — handled in store
      } finally {
        clearTimeout(timeoutId);
        setChecked(true);
      }
    };

    // Only check auth on initial load if not already authenticated
    if (!isAuthenticated) {
      verify();
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, checkAuth]);

  if (isCheckingAuth || !checked) {
    return (
      <Center h='100vh'>
        <Loader size='lg' />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={LINKS.LOGIN} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
