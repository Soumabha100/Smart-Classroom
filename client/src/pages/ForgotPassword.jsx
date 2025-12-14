import React, { useState } from "react";
import api from "../api/apiService";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Email sent! Check your inbox.");
      setEmail("");
    } catch (error) {
    
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Reset Password
        </h2>
        <p className="text-slate-400 text-center mb-6">
          Enter your email to receive a reset link
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-slate-400 hover:text-blue-400 hover:underline transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
