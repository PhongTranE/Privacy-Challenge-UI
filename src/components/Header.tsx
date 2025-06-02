import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "@/styles/Components/Header.scss";
import { useAuthStore } from "@/stores/authStore";
import { Menu } from "@mantine/core";
import { IconMenu2, IconUserCircle } from "@tabler/icons-react";
import { LINKS } from "@/constants/links";
import { logout } from "@/services/api/authApi";
const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 40);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // [] đảm bảo effect chỉ chạy một lần khi mount và cleanup khi unmount

  return (
    // Sử dụng className có điều kiện: nếu isScrolled true thì thêm class 'scrolled'
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <Link
            to={`${
              user?.roles[0].name === "Administrator"
                ? "/admin/dashboard"
                : `${user?.roles[0].name === "User" ? "/start" : "/"}`
            }`}
          >
            PCP
          </Link>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <IconMenu2 stroke={2} />
        </button>

        <nav className={`nav ${isMobileMenuOpen ? "open" : ""}`}>
          <ul>
            {!isAuthenticated ? (
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
            ) : (
              <>
                {user?.roles[0].name === "Administrator" && (
                  <>
                    <li>
                      <NavLink to={LINKS.DASHBOARD}>Dashboard</NavLink>
                    </li>
                    <li>
                      <NavLink to={LINKS.STATUS}>Status</NavLink>
                    </li>
                  </>
                )}
              </>
            )}
            <li>
              <NavLink to="/ranking">Ranking</NavLink>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <NavLink to={LINKS.START}>Let's start!</NavLink>
                </li>
                <li>
                  <NavLink to={LINKS.SUBMISSION}>Submission</NavLink>
                </li>
                <li>
                  <NavLink to={LINKS.ATTACK}>Attack</NavLink>
                </li>
              </>
            )}
            <li className="ml-auto">
              <NavLink to="/rules">Rules</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
          </ul>
        </nav>
        {/* Authen */}
        {!isAuthenticated ? (
          <ul className="authen">
            <li>
              <NavLink to="/auth/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/auth/register">Register</NavLink>
            </li>
          </ul>
        ) : (
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <IconUserCircle size={28} />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} to={LINKS.PROFILE}>
                Profile
              </Menu.Item>
              <Menu.Item component={Link} to={LINKS.CHANGE_PASSWORD}>
                Change Password
              </Menu.Item>
              <Menu.Item color="red" onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </header>
  );
};

export default Header;
