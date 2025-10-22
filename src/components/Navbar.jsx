import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "var(--card)",
        boxShadow: "var(--shadow)",
        borderBottom: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
      }}
    >
      {/* Logo / Brand */}
      <Link className="font-bold text-xl" to="/" style={{ color: "var(--text)" }}>
        Internship Portal
      </Link>

      {/* Nav Links */}
      <ul className="hidden md:flex gap-6 items-center">
        <li>
          <Link
            to="/"
            className="hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/internships"
            className="hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Internships
          </Link>
        </li>
        <li>
          <Link
            to="/skill-tests"
            className="hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Skill Tests
          </Link>
        </li>

        {isLoggedIn ? (
          <>
            <li>
              <Link to="/dashboard" className="hover:underline" style={{ color: "var(--muted)" }}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/analytics" className="hover:underline" style={{ color: "var(--muted)" }}>
                Analytics
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:underline" style={{ color: "var(--muted)" }}>
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="hover:underline" style={{ color: "var(--muted)" }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="hover:underline" style={{ color: "var(--muted)" }}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="hover:underline" style={{ color: "var(--muted)" }}>
                Signup
              </Link>
            </li>
          </>
        )}

        {/* Dark/Light Mode Toggle */}
        <li className="ml-2">
          <ThemeToggle />
        </li>
      </ul>

      {/* Mobile menu (horizontal scroller) */}
      <div className="flex md:hidden items-center gap-4 overflow-x-auto">
        <Link to="/" style={{ color: "var(--muted)" }}>Home</Link>
        <Link to="/internships" style={{ color: "var(--muted)" }}>Internships</Link>
        <Link to="/skill-tests" style={{ color: "var(--muted)" }}>Skill Tests</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={{ color: "var(--muted)" }}>Dashboard</Link>
            <Link to="/analytics" style={{ color: "var(--muted)" }}>Analytics</Link>
            <Link to="/profile" style={{ color: "var(--muted)" }}>Profile</Link>
            <button onClick={handleLogout} style={{ color: "var(--muted)" }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "var(--muted)" }}>Login</Link>
            <Link to="/signup" style={{ color: "var(--muted)" }}>Signup</Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
