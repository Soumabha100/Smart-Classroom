import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Check if the current page is a login or register page
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Style for active NavLink
  const activeLinkStyle = {
    color: "#3b82f6", // A bright blue for the active link
    fontWeight: "600",
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-white tracking-wider"
            >
              Smart Classroom
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-300"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className="text-gray-300 hover:text-white transition-colors duration-300"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              About
            </NavLink>

            {/* Conditionally render this block */}
            {!isAuthPage &&
              (token ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105"
                >
                  Login
                </NavLink>
              ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white">
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
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
