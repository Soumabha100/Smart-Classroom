import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/apiService";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function CompleteProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { googleData, idToken } = location.state || {};

  const [name, setName] = useState(googleData?.name || "");
  const [role, setRole] = useState("student"); // Default role
  const [loading, setLoading] = useState(false);

  // Redirect if no data (user tried to access directly)
  if (!googleData || !idToken) {
    return (
      <div className="min-h-screen w-full bg-slate-900 text-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-slate-400 mb-6">
              Please use Google Sign-In to access this page.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the NEW backend endpoint
      const res = await api.post("/auth/google-complete", {
        idToken, // We verify the token again for security
        name, // The edited name
        role,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      toast.success(`Welcome, ${user.name}!`);

      // Redirect to Dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      toast.error("Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img
              src={googleData.picture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-slate-700 shadow-lg mx-auto mb-4"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-800"></div>
          </div>
          <h1 className="text-2xl font-bold text-white">Almost There!</h1>
          <p className="text-slate-400 mt-2">
            Confirm your details to finish setup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`p-3 rounded-lg border text-center transition-all ${
                  role === "student"
                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                    : "bg-slate-700/30 border-slate-600 text-slate-400 hover:bg-slate-700/50"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`p-3 rounded-lg border text-center transition-all ${
                  role === "teacher"
                    ? "bg-purple-600/20 border-purple-500 text-purple-400"
                    : "bg-slate-700/30 border-slate-600 text-slate-400 hover:bg-slate-700/50"
                }`}
              >
                Teacher
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Complete Signup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
