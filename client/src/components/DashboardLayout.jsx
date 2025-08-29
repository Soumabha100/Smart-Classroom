import React, { useState } from "react";
import Sidebar from "./Sidebar";

// This component will manage the state for the sidebar and provide the overall structure
export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Pass state and the toggle function to the Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <main className="flex h-screen bg-slate-100">
        {/* Hamburger Menu Button - visible only on mobile */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 mb-4 rounded-md bg-gray-200 hover:bg-gray-300"
          aria-label="Open sidebar"
        >
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
        {children}
      </main>
    </div>
  );
}
