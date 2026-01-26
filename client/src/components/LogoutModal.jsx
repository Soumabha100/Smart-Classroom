import React from 'react';
import { LogOut, X, Monitor, ShieldAlert } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm, logoutAllDevices, setLogoutAllDevices }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
              Are you sure you want to sign out?
            </p>
          </div>
        </div>

        {/* Logout All Devices Option */}
        <div className="mb-8 space-y-3">
          <button
            onClick={() => setLogoutAllDevices(!logoutAllDevices)}
            className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
              logoutAllDevices 
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500" 
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <Monitor className={`h-5 w-5 ${logoutAllDevices ? "text-blue-600" : "text-slate-400"}`} />
              <div className="text-left">
                <span className={`block text-sm font-semibold ${logoutAllDevices ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                  Logout from all devices
                </span>
                <span className="text-xs text-slate-500">Secure your account everywhere</span>
              </div>
            </div>
            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              logoutAllDevices ? "border-blue-600 bg-blue-600" : "border-slate-300 dark:border-slate-600"
            }`}>
              {logoutAllDevices && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
          </button>
          
          {logoutAllDevices && (
            <div className="flex items-center gap-2 px-1 text-amber-600 dark:text-amber-500">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-[11px] font-medium">This will require a new login on all your browsers and apps.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 shadow-md shadow-red-600/20 transition-all active:scale-95"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;