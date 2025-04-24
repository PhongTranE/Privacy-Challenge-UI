import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "@/styles/Components/Header.scss";
const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollThreshold = 40;
    const scrolled = window.scrollY > scrollThreshold;
    setIsScrolled(scrolled);
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
          <Link to="/">PCP</Link>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/rules">Rules</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
          </ul>
        </nav>
        <ul className="authen">
          <li>
            <NavLink to="/auth/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/auth/register">Register</NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
