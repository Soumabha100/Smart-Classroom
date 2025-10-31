// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import { Moon, Sun, Bell, Lock, ArrowLeft, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../context/ThemeContext.jsx";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const { theme, themeSource, toggleTheme, setSystemTheme, setTheme } =
    useTheme();
  const isDarkMode = theme === "dark";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(
      `Notifications ${notificationsEnabled ? "disabled" : "enabled"}`
    );
  };

  const handleThemeChange = (newSource) => {
    if (newSource === "system") {
      setSystemTheme();
      toast.success("Using system theme preferences");
    } else {
      setTheme(newSource);
      toast.success(
        `${newSource === "dark" ? "Dark" : "Light"} mode activated`
      );
    }
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
            <ArrowLeft className="h-6 w-6 dark:text-white text-gray-800" />
          </button>
          <h1 className="text-3xl font-bold dark:text-white text-gray-900">
            Settings
          </h1>
        </div>

        {/* Settings Card */}
        <div className="rounded-2xl shadow-lg p-8 transition-all duration-300 dark:bg-gray-800 bg-white dark:text-white text-gray-900">
          {/* General Section */}
          <h2 className="text-xl font-semibold mb-6">General</h2>

          {/* Theme Settings */}
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-lg font-medium mb-4">Appearance</h3>
              <div className="grid grid-cols-3 gap-4">
                {/* System Theme Option */}
                <button
                  onClick={() => handleThemeChange("system")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    themeSource === "system"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700"
                  }`}
                >
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-gray-300" />
                  <p className="text-sm font-medium">System</p>
                </button>

                {/* Light Theme Option */}
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "light" && themeSource !== "system"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700"
                  }`}
                >
                  <Sun className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-gray-300" />
                  <p className="text-sm font-medium">Light</p>
                </button>

                {/* Dark Theme Option */}
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "dark" && themeSource !== "system"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700"
                  }`}
                >
                  <Moon className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-gray-300" />
                  <p className="text-sm font-medium">Dark</p>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {themeSource === "system"
                  ? "Using system preferences"
                  : `Currently using ${theme} mode`}
              </p>
            </div>

            {/* Quick Theme Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                {isDarkMode ? (
                  <Moon className="h-6 w-6 mr-3 text-gray-400" />
                ) : (
                  <Sun className="h-6 w-6 mr-3 text-gray-500" />
                )}
                <div>
                  <span className="font-medium">Quick Theme Toggle</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Quickly switch between light and dark mode
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex items-center h-6 w-11 rounded-full focus:outline-none"
                aria-label="Toggle theme"
              >
                <span
                  className={`${
                    isDarkMode ? "bg-blue-600" : "bg-gray-300"
                  } absolute w-full h-full rounded-full transition-colors duration-300`}
                />
                <span
                  className={`${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-lg`}
                />
              </button>
            </div>
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
