import React, { useState } from "react";
import { Moon, Sun, Bell, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
// ✨ Import the new useAuth hook
import { useAuth } from "../context/AuthContext.jsx";

const SettingsPage = () => {
  // ✨ Get theme and updater function from our new AuthContext
  const { theme, updateTheme } = useAuth();
  const isDarkMode = theme === "dark";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  // ✨ Create a new handler for the theme toggle
  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    updateTheme(newTheme);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft
              className={`h-6 w-6 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            />
          </button>
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Settings
          </h1>
        </div>

        {/* Settings Card */}
        <div
          className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          {/* General Section */}
          <h2 className="text-xl font-semibold mb-6">General</h2>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {isDarkMode ? (
                <Moon className="h-6 w-6 mr-3 text-gray-400" />
              ) : (
                <Sun className="h-6 w-6 mr-3 text-gray-500" />
              )}
              <span>Theme</span>
            </div>
            {/* ✨ Connect the toggle to our new handler */}
            <button
              onClick={handleThemeToggle}
              className="relative inline-flex items-center h-6 w-11 rounded-full focus:outline-none"
            >
              <span
                className={`${
                  isDarkMode ? "bg-blue-600" : "bg-gray-300"
                } absolute w-full h-full rounded-full transition-colors duration-300`}
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
              <span>Enable Notifications</span>
            </div>
            <button
              onClick={toggleNotifications}
              className="relative inline-flex items-center h-6 w-11 rounded-full focus:outline-none"
            >
              <span
                className={`${
                  notificationsEnabled ? "bg-blue-600" : "bg-gray-300"
                } absolute w-full h-full rounded-full transition-colors duration-300`}
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
            <h2 className="text-xl font-semibold mb-6">Security</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                <span>Change Password</span>
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
