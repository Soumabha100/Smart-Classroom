import React, { useState } from "react";
import { LogOut, X, Smartphone, Monitor, ShieldAlert, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { revokeAllSessions } from "../api/apiService";

export default function LogoutModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // --- Logic 1: Standard Logout (Current Device Only) ---
  const handleLogout = async () => {
    try {
      await logout(); // Calls Context (clears local state + cookie)
      onClose();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // --- Logic 2: Secure Logout (Kill All Sessions) ---
  const handleLogoutAll = async () => {
    setLoading(true);
    try {
      // 1. Tell backend to revoke all other sessions
      await revokeAllSessions();
      // 2. Clear current session locally
      await logout(); 
      onClose();
    } catch (err) {
      console.error("Logout All failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Close Button (From Old Code) */}
        <button 
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <LogOut className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Confirm Logout
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choose how you want to sign out.
            </p>
          </div>
        </div>

        {/* Options Grid (Merged Logic) */}
        <div className="space-y-3 mb-6">
          {/* Option A: Current Device */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <div>
                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                  This Device Only
                </span>
                <span className="text-xs text-slate-500">
                  Standard logout. Keeps other devices active.
                </span>
              </div>
            </div>
          </button>

          {/* Option B: All Devices */}
          <button
            onClick={handleLogoutAll}
            disabled={loading}
            className="w-full group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-slate-400 group-hover:text-red-500 transition-colors" />
              <div>
                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-red-700 dark:group-hover:text-red-400">
                  Log Out Everywhere
                </span>
                <span className="text-xs text-slate-500">
                  Securely disconnect all phones, tablets & PCs.
                </span>
              </div>
            </div>
            {loading && <Loader2 className="h-5 w-5 animate-spin text-red-500" />}
          </button>
        </div>

        {/* Security Note (From Old Code) */}
        <div className="flex items-center gap-2 px-1 mb-6 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
          <ShieldAlert className="h-4 w-4 flex-shrink-0" />
          <span className="text-[11px] font-medium leading-tight">
            Logging out everywhere will require you to sign in again on all your devices.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}