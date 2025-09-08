import React, { useState } from "react";
import { Moon, Sun, Bell, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  // CORRECT: Get theme state and the toggle function directly from the custom hook.
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  // This state is fine as it's local to this component.
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <DashboardLayout>
      {/* Page Content */}
      <div className="max-w-4xl mx-auto">
        {/* Header with a Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-gray-800 dark:text-white" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Settings
          </h1>
        </div>

        {/* Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            General
          </h2>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {isDarkMode ? (
                <Moon className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
              ) : (
                <Sun className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
              )}
              <span className="text-gray-800 dark:text-gray-200">Theme</span>
            </div>
            {/* This button now correctly uses the toggleTheme function from the context */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none"
            >
              <span
                className={`${
                  isDarkMode ? "bg-blue-600" : "bg-gray-300"
                } absolute w-full h-full rounded-full`}
              />
              <span
                className={`${
                  isDarkMode ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Bell className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-800 dark:text-gray-200">
                Enable Notifications
              </span>
            </div>
            <button
              onClick={toggleNotifications}
              className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none"
            >
              <span
                className={`${
                  notificationsEnabled ? "bg-blue-600" : "bg-gray-300"
                } absolute w-full h-full rounded-full`}
              />
              <span
                className={`${
                  notificationsEnabled ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`}
              />
            </button>
          </div>

          {/* Security Section */}
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Security
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-gray-200">
                  Change Password
                </span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
