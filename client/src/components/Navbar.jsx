import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const getDashboardPath = (role) => {
    const paths = {
      admin: "/admin-dashboard",
      teacher: "/teacher-dashboard",
      parent: "/parent-dashboard",
      student: "/dashboard",
    };
    return paths[role] || "/dashboard";
  };

  const dashboardPath = user ? getDashboardPath(user.role) : "/dashboard";
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  // Styles
  const activeLinkStyle = { color: "#3b82f6", fontWeight: "600" };
  const navLinkClass =
    "text-gray-300 hover:text-white transition-colors duration-200";
  const mobileLinkClass =
    "text-gray-300 hover:text-white py-2 block transition-colors duration-200";

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink
            to={user ? dashboardPath : "/"}
            className="flex items-center"
          >
            <img src="/logos/logotext.png" alt="IntelliClass" className="h-8" />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={navLinkClass}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={navLinkClass}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              About
            </NavLink>

            {!isAuthPage &&
              (user ? (
                <>
                  <NavLink
                    to={dashboardPath}
                    className={navLinkClass}
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-red-500/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-blue-500/20"
                >
                  Login
                </NavLink>
              ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-4 absolute w-full">
          <nav className="flex flex-col space-y-4 text-center">
            <NavLink
              to="/"
              className={mobileLinkClass}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={mobileLinkClass}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>

            {!isAuthPage &&
              (user ? (
                <>
                  <NavLink
                    to={dashboardPath}
                    className={mobileLinkClass}
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl w-full block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}
