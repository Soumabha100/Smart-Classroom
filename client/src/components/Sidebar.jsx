import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // Get the user's role directly from localStorage
  const userRole = localStorage.getItem("role");

  // Determine the correct dashboard path based on the role
  let dashboardPath = "/dashboard"; // Default for student
  if (userRole === "teacher") {
    dashboardPath = "/teacher-dashboard";
  } else if (userRole === "admin") {
    dashboardPath = "/admin-dashboard";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Ensure role is cleared on logout
    navigate("/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        className={`w-64 h-screen bg-slate-900 text-white flex flex-col fixed z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="text-2xl font-bold p-6 border-b border-slate-700">
          <Link to="/">Smart Classroom</Link>
        </div>

        <nav className="flex-grow p-4 overflow-y-auto">
          <ul>
            <li className="mb-2">
              {/* This link now correctly points to the user's specific dashboard */}
              <Link
                to={dashboardPath}
                className="flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Dashboard
              </Link>
            </li>

            {/* ... other links */}
            {userRole === "admin" && (
              <li className="mb-2">
                <Link
                  to="/manage-classes"
                  className="flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {/* You can find a suitable SVG icon for classes */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v11.494m-9-5.747h18"
                    />
                  </svg>
                  Manage Classes
                </Link>
                <Link
                  to="/manage-parents"
                  className="flex items-center p-3 rounded-lg hover:bg-slate-700"
                >
                  {/* Add an icon here */}
                  Manage Parents
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Logout button container - always at the bottom */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
