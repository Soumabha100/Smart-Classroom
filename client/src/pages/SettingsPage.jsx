import React, { useState, useEffect } from "react";
import { Moon, Sun, Bell, Lock } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // You can implement logic here to get the saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Add logic here to update user preferences on the server
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            Settings
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              General
            </h2>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {isDarkMode ? (
                  <Moon className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Sun className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                )}
                <span className="text-gray-800 dark:text-gray-200">Theme</span>
              </div>
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
            <div className="flex items-center justify-between mb-6">
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
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
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
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
