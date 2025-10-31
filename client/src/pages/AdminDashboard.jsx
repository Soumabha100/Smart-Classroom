// client/src/pages/AdminDashboard.jsx

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  TrendingUp,
  Bell,
  Activity,
  ShieldCheck,
  Calendar,
  Settings,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

// --- COMPONENT IMPORTS ---
import DashboardLayout from "../components/DashboardLayout";
import UserCard from "../components/UserCard";
import TeacherList from "../components/TeacherList";
import ClassList from "../components/ClassList";
import UpcomingEvents from "../components/upcomingevent";
import RecentActivity from "../components/recentactivity";
import AccessControl from "../components/accesscontrol";
import AuditLogs from "../components/AuditLogs";
import AnnouncementsList from "../components/AnnouncementsList";

// --- Reusable Section Wrapper ---
const Section = ({ title, icon, actionButton, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg text-indigo-600 dark:text-indigo-300">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          {title}
        </h2>
      </div>
      {actionButton}
    </div>
    <div className="h-full">{children}</div>
  </motion.div>
);

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-slate-900">
        {/* --- Header --- */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Admin Overview
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Manage users, classes, and system-wide settings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/manage-classes"
              className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <PlusCircle size={16} />
              <span>Create Class</span>
            </Link>
            <Link
              to="/settings"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </motion.header>

        {/* --- Stat Cards Section --- */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate="visible"
        >
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          <UserCard type="parent" />
        </motion.div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT (MAIN) COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <Section
              title="Platform Analytics"
              icon={<TrendingUp size={20} />}
              actionButton={
                <Link
                  to="/admin/analytics"
                  className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-sm font-semibold rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  <span>Full Report</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              }
            >
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                A summary of key metrics. Click the button above for a detailed
                breakdown of user distribution, class enrollments, and more.
              </p>
            </Section>

            <Section title="Classes Overview" icon={<BookOpen size={20} />}>
              <ClassList />
            </Section>

            <Section title="System Security" icon={<ShieldCheck size={20} />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AccessControl />
                <AuditLogs />
              </div>
            </Section>
          </div>

          {/* RIGHT (SIDEBAR) COLUMN */}
          <div className="lg:col-span-1 space-y-8">
            <Section title="Active Teachers" icon={<Users size={20} />}>
              <TeacherList />
            </Section>
            <Section title="System Activity" icon={<Activity size={20} />}>
              <RecentActivity />
            </Section>
            <Section title="Upcoming Events" icon={<Calendar size={20} />}>
              <UpcomingEvents />
            </Section>
            <Section title="Announcements" icon={<Bell size={20} />}>
              <AnnouncementsList audience="admin" limit={3} />
            </Section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
