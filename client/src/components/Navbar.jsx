import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  // ✅ Check for the token directly in localStorage
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">
        <Link to="/">Smart Classroom</Link>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-blue-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-400">
              About
            </Link>
          </li>
          {token ? ( // ✅ This condition now works correctly
            <>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-red-400">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-blue-400">
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
