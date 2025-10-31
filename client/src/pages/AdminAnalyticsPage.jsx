// client/src/pages/AdminAnalyticsPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import AnalyticsReports from "../components/analyticsreports";

const AdminAnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/admin-dashboard"
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Platform Analytics & Reports
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            A detailed breakdown of key metrics across the application.
          </p>
        </motion.header>

        <AnalyticsReports />
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;
