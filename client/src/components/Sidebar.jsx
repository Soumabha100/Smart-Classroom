import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  LayoutDashboard,
  BookUser,
  Settings,
  LogOut,
  ChevronLeft,
  Presentation,
  UserPlus,
  FileArchive,
  GraduationCap,
  Mail,
  CalendarCheck,
  Sparkles,
  MessageSquare, // 1. Imported the MessageSquare icon
} from "lucide-react";

const SidebarLink = ({ to, icon, children, currentPath }) => {
  const isActive = currentPath.startsWith(to);
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-base
          ${
            isActive
              ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
              : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          }`}
      >
        {icon}
        {children}
      </Link>
    </li>
  );
};

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getLinks = (role) => {
    const commonLinks = [
      // 2. Added the new "Doubt Forum" link here
      {
        to: "/forum",
        icon: <MessageSquare className="h-4 w-4" />,
        label: "Doubt Forum",
      },
      {
        to: "/profile",
        icon: <BookUser className="h-4 w-4" />,
        label: "Profile",
      },
      {
        to: "/settings",
        icon: <Settings className="h-4 w-4" />,
        label: "Settings",
      },
    ];

    switch (role) {
      case "admin":
        return [
          {
            to: "/admin-dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
            label: "Dashboard",
          },
          {
            to: "/manage-classes",
            icon: <Presentation className="h-4 w-4" />,
            label: "Classes",
          },
          {
            to: "/manage-parents",
            icon: <UserPlus className="h-4 w-4" />,
            label: "Parents",
          },
          {
            to: "/manage-invites",
            icon: <Mail className="h-4 w-4" />,
            label: "Invitations",
          },
          ...commonLinks,
        ];
      case "teacher":
        return [
          {
            to: "/teacher-dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
            label: "Dashboard",
          },
          {
            to: "/manage-classes",
            icon: <Presentation className="h-4 w-4" />,
            label: "Manage Classes",
          },
          ...commonLinks,
        ];
      case "student":
      default:
        return [
          {
            to: "/dashboard",
            icon: <LayoutDashboard className="h-4 w-4" />,
            label: "Dashboard",
          },
          {
            to: "/ai-dashboard",
            icon: <Sparkles className="h-4 w-4" />,
            label: "AI Hub",
          },
          {
            to: "/attendance",
            icon: <CalendarCheck className="h-4 w-4" />,
            label: "Attendance",
          },
          {
            to: "/learning-path",
            icon: <GraduationCap className="h-4 w-4" />,
            label: "Learning Path",
          },
          {
            to: "/drive",
            icon: <FileArchive className="h-4 w-4" />,
            label: "My Drive",
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
        className={`fixed inset-y-0 left-0 z-30 flex h-full w-64 flex-col border-r transition-transform duration-300 ease-in-out 
          lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white text-slate-800 dark:bg-slate-900 dark:border-r-slate-800 dark:text-white`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-6 dark:border-b-slate-800">
          {/* This is the updated brand name and logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white"
          >
            <img
              src="/logos/icon.png"
              alt="IntelliClass Logo"
              className="h-8 w-8 rounded-md"
            />
            <span>IntelliClass</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="grid gap-1 font-medium">
            {navLinks.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                currentPath={location.pathname}
              >
                {link.label}
              </SidebarLink>
            ))}
          </ul>
        </nav>
        <div className="border-t p-4 dark:border-t-slate-800">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:bg-red-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/50 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
