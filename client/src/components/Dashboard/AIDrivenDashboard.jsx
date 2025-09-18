// client/src/components/Dashboard/AIDrivenDashboard.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { generateAIDashboard } from "../../api/apiService";
import WidgetRenderer from "./WidgetRenderer";
import DashboardSkeleton from "./DashboardSkeleton";
import Masonry from "react-masonry-css"; // <-- Import the new library
import { FiZap, FiBriefcase, FiCalendar } from "react-icons/fi";

const AIDrivenDashboard = () => {
  const [dashboardMode, setDashboardMode] = useState("learning");
  const [dashboardContent, setDashboardContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (initialFetchDone.current) {
      return;
    }
    initialFetchDone.current = true;

    const fetchInitialDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await generateAIDashboard("learning");
        setDashboardContent(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Couldn't generate your dashboard. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialDashboard();
  }, []);

  const handleModeChange = async (newMode) => {
    if (newMode === dashboardMode) return;

    setDashboardMode(newMode);
    setIsLoading(true);
    setError(null);
    setDashboardContent(null);

    try {
      const response = await generateAIDashboard(newMode);
      setDashboardContent(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Couldn't generate your dashboard. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const memoizedWidgets = useMemo(() => {
    if (!dashboardContent?.widgets) return null;
    return dashboardContent.widgets.map((widget) => (
      <div key={widget.id}>
        <WidgetRenderer widget={widget} />
      </div>
    ));
  }, [dashboardContent]);

  // Define breakpoints for the masonry layout
  const breakpointColumnsObj = {
    default: 3, // 3 columns by default
    1280: 2, // 2 columns on screens < 1280px
    768: 1, // 1 column on screens < 768px
  };

  const modeButtons = [
    { mode: "learning", label: "Learning Focus", icon: <FiZap /> },
    { mode: "planning", label: "Daily Planner", icon: <FiCalendar /> },
    { mode: "career", label: "Career Prep", icon: <FiBriefcase /> },
  ];

  return (
    <div className="p-1 sm:p-0">
      <div className="mb-6 flex items-center justify-center flex-wrap gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
        {modeButtons.map((btn) => (
          <button
            key={btn.mode}
            onClick={() => handleModeChange(btn.mode)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform
                        ${
                          dashboardMode === btn.mode
                            ? "bg-indigo-600 text-white shadow-md scale-105"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      <div>
        {isLoading && <DashboardSkeleton />}
        {error && (
          <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
        {!isLoading && !error && dashboardContent && (
          // --- THE MASONRY LAYOUT IMPLEMENTATION ---
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {memoizedWidgets}
          </Masonry>
        )}
      </div>
    </div>
  );
};

export default AIDrivenDashboard;
