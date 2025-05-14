import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import "@/styles/AppLayout.scss"
const AppLayout: React.FC = () => {
  return (
    <div className="background-wrapper">
      <Header />
      <Outlet />
    </div>
  );
};

export default AppLayout;
