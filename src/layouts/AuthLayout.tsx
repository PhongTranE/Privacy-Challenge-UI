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
        {/* <div className="authen-icon text-white bg-[#222]/80 mb-2 mt-10 flex items-center space-x-2 rounded-lg p-3">
          <User size={36} />
        </div> */}
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
