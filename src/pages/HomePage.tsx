import "@/styles/HomePage.scss";
import { NavLink } from "react-router-dom";
import { LINKS } from "@/constants/links";
const HomePage: React.FC = () => {
  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center gap-y-4">
        <div className="hero-section">
          <div className="hero-content">
            <p className="subtitle">Unleash Your Potential</p>
            <h1>Privacy Challenge Platform</h1>
            <p className="description">
              Welcome to our competitive platform!
              <br /> Please{" "}
              <strong className="description__strong">
                <NavLink to={LINKS.RULE}>read the contest rules </NavLink>
              </strong>
              carefully before register!
            </p>
            <button className="btn">
              <NavLink to={LINKS.REGISTER}>Register</NavLink>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
