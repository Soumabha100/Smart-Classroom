import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
// Import the new modal [New Change]
import LogoutModal from "./LogoutModal.jsx";
import {
  LayoutDashboard,
  BookUser,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Presentation,
  UserPlus,
  FileArchive,
  GraduationCap,
  Mail,
  CalendarCheck,
  Sparkles,
  MessageSquare,
} from "lucide-react";

const SidebarLink = ({ to, icon, children, currentPath, collapsed }) => {
  const isActive = currentPath.startsWith(to);
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all whitespace-nowrap text-sm font-medium
          ${
            isActive
              ? "bg-blue-600 text-white dark:bg-blue-600"
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
        title={collapsed ? children : undefined}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && <span>{children}</span>}
      </Link>
    </li>
  );
};

export default function Sidebar({
  isOpen,
  toggleSidebar,
  collapsed,
  toggleCollapsed,
}) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Modal States [New Change]
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);

  const handleLogoutConfirm = () => {
    // Pass 'logoutAllDevices' to your backend service here later
    console.log("Logging out. All devices:", logoutAllDevices);
    logout();
    setIsLogoutModalOpen(false);
  };

  const getLinks = (role) => {
    const commonLinks = [
      {
        to: "/forum",
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Doubt Forum",
      },
      {
        to: "/profile",
        icon: <BookUser className="h-5 w-5" />,
        label: "Profile",
      },
      {
        to: "/settings",
        icon: <Settings className="h-5 w-5" />,
        label: "Settings",
      },
    ];

    switch (role) {
      case "admin":
        return [
          {
            to: "/admin-dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: "Dashboard",
          },
          {
            to: "/manage-classes",
            icon: <Presentation className="h-5 w-5" />,
            label: "Classes",
          },
          {
            to: "/manage-parents",
            icon: <UserPlus className="h-5 w-5" />,
            label: "Parents",
          },
          {
            to: "/manage-invites",
            icon: <Mail className="h-5 w-5" />,
            label: "Invitations",
          },
          ...commonLinks,
        ];
      case "teacher":
        return [
          {
            to: "/teacher-dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: "Dashboard",
          },
          {
            to: "/teacher/manage-classes",
            icon: <Presentation className="h-5 w-5" />,
            label: "Manage Classes",
          },
          ...commonLinks,
        ];
      case "student":
      default:
        return [
          {
            to: "/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: "Dashboard",
          },
          {
            to: "/ai-dashboard",
            icon: <Sparkles className="h-5 w-5" />,
            label: "AI Hub",
          },
          {
            to: "/student/attendance",
            icon: <CalendarCheck className="h-5 w-5" />,
            label: "Attendance",
          },
          {
            to: "/learning-path",
            icon: <GraduationCap className="h-5 w-5" />,
            label: "Learning Path",
          },
          {
            to: "/drive",
            icon: <FileArchive className="h-5 w-5" />,
            label: "My Drive",
          },
          {
            to: "/student/classes",
            icon: <Presentation className="h-5 w-5" />,
            label: "My Classes",
          },
          ...commonLinks,
        ];
    }
  };

  const navLinks = user ? getLinks(user.role) : [];

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black/60 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-30 flex flex-col h-full transition-all duration-300 ease-in-out border-r
          bg-white dark:bg-slate-900 dark:border-slate-800
          lg:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
          ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Header content... */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-4 dark:border-slate-800">
          {!collapsed && (
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white min-w-0"
            >
              <img
                src="/logos/icon.png"
                alt="IntelliClass Logo"
                className="h-8 w-8 rounded-md flex-shrink-0"
              />
              <span className="truncate">IntelliClass</span>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCollapsed}
              className="hidden lg:flex rounded-lg p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={toggleSidebar}
              className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
          <ul className="grid gap-2 font-medium">
            {navLinks.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                currentPath={location.pathname}
                collapsed={collapsed}
              >
                {link.label}
              </SidebarLink>
            ))}
          </ul>
        </nav>

        {/* Updated Logout Button [New Change] */}
        <div className="border-t p-3 dark:border-slate-800">
          <button
            onClick={() => setIsLogoutModalOpen(true)} // Opens Modal
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 w-full text-slate-600 transition-all whitespace-nowrap text-sm font-medium
              hover:bg-red-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/50 dark:hover:text-red-400`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Render the Modal [New Change] */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        logoutAllDevices={logoutAllDevices}
        setLogoutAllDevices={setLogoutAllDevices}
      />
    </>
  );
}
