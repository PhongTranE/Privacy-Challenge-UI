import { Outlet } from "react-router-dom";
import "@/styles/AuthLayout.scss";
// import { useAuthStore } from '@/stores/auth.store';

const AuthLayout = () => {
  //   const { isAuthenticated } = useAuthStore();
  //   if (isAuthenticated) {
  //     return <Navigate to="/" />;
  //   }
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <section className="authen-section">
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
