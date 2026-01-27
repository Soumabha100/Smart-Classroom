import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getInviteCodes, generateInviteCode } from "../api/apiService"; // Using centralized API service
import DashboardLayout from "../components/DashboardLayout";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2,
  AlertTriangle,
  MailPlus,
  Copy,
  Check,
  Ticket,
  ArrowLeft,
} from "lucide-react";

// A custom, non-disruptive Toast notification to replace alerts
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const styles = {
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  };

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-xl animate-fade-in-up ${styles[type]}`}
    >
      {message}
    </div>
  );
};

// A beautifully designed card for each invitation code
const InvitationCard = ({ invite, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(invite.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const isExpired = new Date(invite.expiresAt) < new Date();
  const expiryText = isExpired
    ? "Expired"
    : `Expires in ${formatDistanceToNow(new Date(invite.expiresAt))}`;

  return (
    <div
      className={`relative bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        isExpired ? "opacity-50" : "hover:shadow-lg hover:scale-[1.02]"
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Invitation Code
            </p>
            <p className="text-2xl font-mono font-bold tracking-wider text-slate-900 dark:text-white my-2">
              {invite.code}
            </p>
            <p
              className={`text-sm font-medium ${
                isExpired
                  ? "text-red-500"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {expiryText}
            </p>
          </div>
          <Ticket className="w-10 h-10 text-indigo-200 dark:text-indigo-800/50" />
        </div>
        <button
          onClick={handleCopy}
          disabled={copied || isExpired}
          className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-colors disabled:opacity-70 ${
            copied
              ? "bg-green-500 text-white"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
          }`}
        >
          {copied ? (
            <>
              <Check size={16} /> Copied!
            </>
          ) : (
            <>
              <Copy size={16} /> Copy Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// The main page component
const InvitationManagement = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const fetchCodes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getInviteCodes();
      setCodes(res.data);
    } catch (err) {
      setToast({ message: "Failed to fetch invitation codes.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      await generateInviteCode();
      setToast({ message: "New invitation code generated!", type: "success" });
      fetchCodes(); // Refresh the list
    } catch (err) {
      setToast({ message: "Failed to generate code.", type: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setToast({
      message: `Code "${code}" copied to clipboard!`,
      type: "success",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-full">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full transition-colors text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Invitation Management
                </h1>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Generate and view invitation codes for new teachers.
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 font-bold text-white transition-transform transform bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-400"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                <>
                  <MailPlus size={20} /> Generate New Code
                </>
              )}
            </button>
          </div>

          {/* Invitation Codes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skeleton Loader */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md animate-pulse"
                >
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : codes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {codes.map((invite) => (
                <InvitationCard
                  key={invite._id}
                  invite={invite}
                  onCopy={copyToClipboard}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed dark:border-slate-700 rounded-xl">
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                No active invitation codes.
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Click "Generate New Code" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </DashboardLayout>
  );
};

// ✨ THIS LINE WAS MISSING. Add it to the end of the file.
export default InvitationManagement;
