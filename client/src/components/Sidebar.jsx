import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  let dashboardPath = "/dashboard"; // Default for student
  if (userRole === "teacher") {
    dashboardPath = "/teacher-dashboard";
  } else if (userRole === "admin") {
    dashboardPath = "/admin-dashboard";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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
        className={`w-64 h-dvh bg-slate-900 text-white flex flex-col fixed z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="text-2xl font-bold p-6 border-b border-slate-700">
          <Link to="/">Smart Classroom</Link>
        </div>

        <nav className="flex-grow p-4 overflow-y-auto">
          <ul>
            {/* Dashboard */}
            <li className="mb-2">
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
            <li className="mb-2">
              <Link
                to="/profile"
                className="flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <User className="h-6 w-6 mr-3" />
                Profile
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/settings"
                className="flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Settings className="h-6 w-6 mr-3" />
                Settings
              </Link>
            </li>

            {/* Student-only extra links */}
            {userRole === "student" && (
              <>
                <li className="mb-2">
                  <Link
                    to="/drive"
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
                        d="M3 7h18M3 12h18M3 17h18"
                      />
                    </svg>
                    Drive
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/learning-path"
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
                        d="M12 6v6l4 2m6 4H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2z"
                      />
                    </svg>
                    Learning Path
                  </Link>
                </li>
              </>
            )}

            {/* Admin-only links */}
            {userRole === "admin" && (
              <>
                <li className="mb-2">
                  <Link
                    to="/manage-classes"
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Manage Classes
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/manage-parents"
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Manage Parents
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/manage-invites"
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
                        d="M8 10h.01M12 14h.01M16 10h.01M21 16H3M21 12H3M21 8H3"
                      />
                    </svg>
                    Manage Invitations
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Logout button container */}
        <div className="p-4 mt-auto border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg hover:bg-red-600/90 transition-colors"
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
