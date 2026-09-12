import { NavLink } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">

      <div className="logo">
        AI Mine
      </div>

      <div className="nav-links">

        <NavLink to="/">
          Dashboard
        </NavLink>

        <NavLink to="/live">
          Live
        </NavLink>

        <NavLink to="/alerts">
          Alerts
        </NavLink>

        <NavLink to="/history">
          History
        </NavLink>

      </div>

      <button
        className="dark-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

    </nav>
  );
}

export default Navbar;