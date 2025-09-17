import React, { useState, useEffect, useMemo, useRef } from "react";
import { generateAIDashboard } from "../../api/apiService";
import WidgetRenderer from "./WidgetRenderer";
import DashboardSkeleton from "./DashboardSkeleton";
import { FiZap, FiBriefcase, FiCalendar } from "react-icons/fi";

const AIDrivenDashboard = () => {
  const [dashboardMode, setDashboardMode] = useState("learning");
  const [dashboardContent, setDashboardContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- THE DEFINITIVE FIX ---
  // This ref will act as a flag to prevent the double-fetch in development.
  const initialFetchDone = useRef(false);

  // This useEffect handles the VERY FIRST data load when the component mounts.
  useEffect(() => {
    // Check if the effect has already run. If it has, do nothing.
    if (initialFetchDone.current) {
      return;
    }

    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      setDashboardContent(null);
      try {
        const response = await generateAIDashboard(dashboardMode);
        setDashboardContent(response.data);
      } catch (err) {
        console.error("Failed to fetch initial dashboard", err);
        const errorMessage =
          err.response?.data?.message ||
          "Couldn't generate your dashboard. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();

    // Set the flag to true so this effect never runs again.
    initialFetchDone.current = true;
  }, []); // Empty dependency array ensures this effect runs only on mount.

  // This separate useEffect handles changes to the 'dashboardMode' AFTER the initial load.
  useEffect(() => {
    // We don't want this to run on the initial render, only when the user clicks a button.
    // The 'initialFetchDone' flag helps us know when it's safe to run.
    if (!initialFetchDone.current || isLoading) {
      return;
    }

    // Check if we are still on the initial mode. If so, do nothing.
    // This prevents a fetch when the component first loads.
    const isInitialMode = dashboardMode === "learning";
    if (isInitialMode && dashboardContent !== null) {
      // This is a guard against the very first render after the initial data has loaded.
      // A more robust way would be to track the previous state of dashboardMode.
      // For now, this is a simple check.
    }

    const fetchDashboardOnModeChange = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await generateAIDashboard(dashboardMode);
        setDashboardContent(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard on mode change", err);
        const errorMessage =
          err.response?.data?.message ||
          "Couldn't generate your dashboard. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    // We only want to fetch if the mode is not the initial one,
    // or if the dashboard content has already been populated at least once.
    if (dashboardContent) {
      fetchDashboardOnModeChange();
    }
  }, [dashboardMode]); // This effect now ONLY runs when the user changes the mode.

  const memoizedWidgets = useMemo(() => {
    if (!dashboardContent?.widgets) return null;
    const sortedWidgets = [...dashboardContent.widgets].sort((a, b) =>
      a.id.localeCompare(b.id)
    );
    return sortedWidgets.map((widget) => (
      <WidgetRenderer key={widget.id} widget={widget} />
    ));
  }, [dashboardContent]);

  const modeButtons = [
    { mode: "learning", label: "Learning Focus", icon: <FiZap /> },
    { mode: "planning", label: "Daily Planner", icon: <FiCalendar /> },
    { mode: "career", label: "Career Prep", icon: <FiBriefcase /> },
  ];

  return (
    <div className="p-4 sm:p-0">
      <div className="mb-6 flex items-center justify-center flex-wrap gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
        {modeButtons.map((btn) => (
          <button
            key={btn.mode}
            onClick={() => setDashboardMode(btn.mode)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoizedWidgets}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDrivenDashboard;
