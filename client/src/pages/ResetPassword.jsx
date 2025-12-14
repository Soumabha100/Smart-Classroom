import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/apiService";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // New States for "Smart" Checking
  const [verifying, setVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const { resetToken } = useParams();
  const navigate = useNavigate();

  // 1. Verify Token Immediately on Page Load
  useEffect(() => {
    const checkToken = async () => {
      try {
        await api.get(`/auth/verify-token/${resetToken}`);
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };
    checkToken();
  }, [resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${resetToken}`, { password });
      toast.success("Password updated! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired link");
      setIsTokenValid(false); // Immediately hide form if submission fails
    } finally {
      setLoading(false);
    }
  };

  // --- Render 1: Loading State ---
  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // --- Render 2: Invalid/Expired Link State ---
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl border border-red-500/30 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Link Expired</h2>
          <p className="text-slate-400 mb-6">
            This password reset link is invalid or has already been used.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block w-full bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  // --- Render 3: Valid Form State ---
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          New Password
        </h2>
        <p className="text-slate-400 text-center mb-6 text-sm">
          Please create a strong password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-12 bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
