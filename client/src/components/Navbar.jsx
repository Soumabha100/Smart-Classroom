// client/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Determine the correct dashboard path
  let dashboardPath = "/dashboard"; // Default for students
  if (role === "admin") {
    dashboardPath = "/admin-dashboard";
  } else if (role === "teacher") {
    dashboardPath = "/teacher-dashboard";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const activeLinkStyle = { color: "#3b82f6", fontWeight: "600" };

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-white tracking-wider"
            >
              Smart Classroom
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className="text-gray-300 hover:text-white"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="text-gray-300 hover:text-white"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              About
            </NavLink>

            {!isAuthPage &&
              (token ? (
                <>
                  <NavLink
                    to={dashboardPath}
                    className="text-gray-300 hover:text-white"
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                >
                  Login
                </NavLink>
              ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              {/* Icon for menu open/close */}
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
        <div className="md:hidden bg-slate-800/90 backdrop-blur-sm p-4">
          <nav className="flex flex-col space-y-4 text-center">
            <NavLink
              to="/"
              className="text-gray-300 hover:text-white py-2"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="text-gray-300 hover:text-white py-2"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>

            {!isAuthPage &&
              (token ? (
                <>
                  {/* FIX: Use the dynamic dashboardPath here for the mobile menu */}
                  <NavLink
                    to={dashboardPath}
                    className="text-gray-300 hover:text-white py-2"
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
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
