// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  ArrowLeft,
  Monitor,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx"; // ✅ IMPORT ADDED
import { toast } from "react-hot-toast";
import { changePassword } from "../api/apiService"; 

const SettingsPage = () => {
  // ✅ GET updateTheme from AuthContext
  const { updateTheme } = useAuth(); 
  const { theme, themeSource, toggleTheme, setSystemTheme, setTheme } = useTheme();
  
  const isDarkMode = theme === "dark";
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(
      `Notifications ${notificationsEnabled ? "disabled" : "enabled"}`
    );
  };

  // ✅ FIXED: Handle explicit theme selection (Light/Dark cards)
  const handleThemeChange = (newSource) => {
    if (newSource === "system") {
      setSystemTheme();
      toast.success("Using system theme preferences");
      // Note: We don't save 'system' to DB as schema only supports 'light'/'dark'
    } else {
      setTheme(newSource); // Update Local
      
      // Update Database
      if (updateTheme) {
        console.log(`⚙️ Settings: Saving ${newSource} mode to DB...`);
        updateTheme(newSource);
      }
      
      toast.success(
        `${newSource === "dark" ? "Dark" : "Light"} mode activated`
      );
    }
  };

  // ✅ FIXED: Handle the Toggle Switch
  const handleQuickToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    toggleTheme(); // Update Local via Context
    
    // Update Database
    if (updateTheme) {
      console.log(`⚙️ Settings: Toggling to ${newTheme} mode in DB...`);
      updateTheme(newTheme);
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
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                    themeSource === "system"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700"
                  }`}
                >
                  <Monitor className="h-8 w-8 mb-2 text-gray-600 dark:text-gray-300" />
                  <p className="text-sm font-medium">System</p>
                </button>

                {/* Light Theme Option */}
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                    theme === "light" && themeSource !== "system"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700"
                  }`}
                >
                  <Sun className="h-8 w-8 mb-2 text-gray-600 dark:text-gray-300" />
                  <p className="text-sm font-medium">Light</p>
                </button>

                {/* Dark Theme Option */}
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                    theme === "dark" && themeSource !== "system"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700"
                  }`}
                >
                  <Moon className="h-8 w-8 mb-2 text-gray-600 dark:text-gray-300" />
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
                    Switch between light and dark mode
                  </p>
                </div>
              </div>
              <button
                onClick={handleQuickToggle} // ✅ CHANGED from toggleTheme to handleQuickToggle
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

          {/* Security Section - Change Password */}
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6">Security</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    Change Password
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your password securely
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </DashboardLayout>
  );
};

// --- Sub-Component: Change Password Modal ---
const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const toggleShow = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password cannot be the same as current.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Password changed successfully!");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Change password error:", error);
      // Backend error message usually in error.response.data.message
      const msg = error.response?.data?.message || "Failed to update password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Change Password
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => toggleShow("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => toggleShow("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => toggleShow("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;