import React, { useState, useEffect } from "react"; // ✨ NEW: Import useEffect
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // ✨ NEW: Add this effect to control body scrolling
  useEffect(() => {
    // When the sidebar is open, prevent the body from scrolling
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      // When the sidebar is closed, restore body scrolling
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling if the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]); // This effect runs whenever `isSidebarOpen` changes

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="transition-all duration-300 ease-in-out lg:ml-64">
        {/* Mobile Header with Hamburger Menu */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg shadow-sm lg:hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="text-xl font-bold text-slate-800">
                Smart Classroom
              </Link>
              <button
                onClick={toggleSidebar}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Open sidebar"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
