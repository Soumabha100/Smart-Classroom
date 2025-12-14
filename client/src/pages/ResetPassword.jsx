import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiService";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetToken } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${resetToken}`, { password });
      toast.success("Password updated! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Set New Password
        </h2>
        <p className="text-slate-400 text-center mb-6">
          Create a strong password for your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-12 bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
