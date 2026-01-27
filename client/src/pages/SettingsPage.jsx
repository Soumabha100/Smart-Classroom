import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Monitor,
  Sun,
  Moon,
  Bell,
  Lock,
  Laptop,
  Smartphone,
  ShieldAlert,
  Trash2,
  LogOut,
  Loader2,
  X,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  changePassword,
  getSessions,
  revokeSession,
  revokeAllSessions,
} from "../api/apiService";

// --- Utility Helpers ---
const parseUserAgent = (ua) => {
  if (!ua) return "Unknown Device";
  const lower = ua.toLowerCase();
  if (lower.includes("windows")) return "Windows PC";
  if (lower.includes("macintosh") || lower.includes("mac os")) return "Mac OS";
  if (lower.includes("iphone")) return "iPhone";
  if (lower.includes("ipad")) return "iPad";
  if (lower.includes("android")) return "Android Device";
  if (lower.includes("linux")) return "Linux Machine";
  return "Unknown Device";
};

const formatLastActive = (dateString) => {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { updateTheme } = useAuth();
  const { theme, themeSource, setSystemTheme, setTheme } = useTheme();

  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // --- Theme Handler ---
  const handleThemeChange = (newSource) => {
    if (newSource === "system") {
      setSystemTheme();
      toast.success("Using system theme");
    } else {
      setTheme(newSource);
      if (updateTheme) updateTheme(newSource);
      toast.success(
        `${newSource === "dark" ? "Dark" : "Light"} mode activated`,
      );
    }
  };

  // --- Session Management ---
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await getSessions();
        setSessions(data);
      } catch (error) {
        console.error("Failed to load sessions", error);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId) => {
    try {
      await revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      toast.success("Device logged out");
    } catch {
      toast.error("Failed to remove device");
    }
  };

  const handleRevokeAll = async () => {
    if (!window.confirm("Are you sure? This will log out everyone except you."))
      return;
    try {
      await revokeAllSessions();
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      toast.success("All other devices logged out");
    } catch {
      toast.error("Failed to log out devices");
    }
  };

  const getDeviceIcon = (deviceName) => {
    const lower = deviceName.toLowerCase();
    if (lower.includes("phone") || lower.includes("android"))
      return <Smartphone className="w-5 h-5 text-teal-500" />;
    if (
      lower.includes("mac") ||
      lower.includes("windows") ||
      lower.includes("linux")
    )
      return <Laptop className="w-5 h-5 text-indigo-500" />;
    return <Globe className="w-5 h-5 text-slate-500" />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-200" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage preferences and security
            </p>
          </div>
        </div>

        {/* --- APPEARANCE --- */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Appearance
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "system", icon: Monitor, label: "System" },
                { id: "light", icon: Sun, label: "Light" },
                { id: "dark", icon: Moon, label: "Dark" },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => handleThemeChange(id)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                    (
                      id === "system"
                        ? themeSource === "system"
                        : theme === id && themeSource !== "system"
                    )
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-200"
                  }`}
                >
                  <Icon className="w-6 h-6 mb-2 text-slate-600 dark:text-slate-300" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Notifications
                  </p>
                  <p className="text-xs text-slate-500">Manage push alerts</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setNotificationsEnabled(!notificationsEnabled);
                  toast.success(
                    `Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`,
                  );
                }}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${
                  notificationsEnabled
                    ? "bg-indigo-600"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* --- SECURITY --- */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white px-2">
            Security
          </h2>

          {/* Password Change */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Password
                </h3>
                <p className="text-sm text-slate-500">
                  Update your login credentials
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Change
            </button>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 dark:text-white">
                  Active Sessions
                </h3>
              </div>
              {sessions.length > 1 && (
                <button
                  onClick={handleRevokeAll}
                  className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 font-medium px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-3 h-3" /> Log out all others
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loadingSessions ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No session data found.
                </div>
              ) : (
                sessions.map((s) => {
                  const cleanDeviceName = parseUserAgent(s.device);
                  return (
                    <div
                      key={s._id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                          {getDeviceIcon(cleanDeviceName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                              {cleanDeviceName}
                            </span>
                            {s.isCurrent && (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                                THIS DEVICE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 font-mono">
                            {s.ip} • {formatLastActive(s.lastActive)}
                          </p>
                        </div>
                      </div>
                      {!s.isCurrent && (
                        <button
                          onClick={() => handleRevoke(s._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Log out device"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
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
}

// --- Change Password Modal ---
const ChangePasswordModal = ({ onClose }) => {
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword)
      return toast.error("Passwords do not match");
    if (data.newPassword.length < 6) return toast.error("Password too short");

    setLoading(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Change Password
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {["current", "new", "confirm"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">
                {field === "confirm" ? "Confirm Password" : `${field} Password`}
              </label>
              <div className="relative">
                <input
                  type={show[field] ? "text" : "password"}
                  value={data[`${field}Password`]}
                  onChange={(e) =>
                    setData({ ...data, [`${field}Password`]: e.target.value })
                  }
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggle(field)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {show[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
