import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

// A simple, modern SVG for branding
const AuthIllustration = () => (
  <div className="text-center">
    <svg
      className="w-48 h-48 mx-auto text-blue-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9.75 3.104l7.5 4.388-7.5 4.388-7.5-4.388 7.5-4.388zM17.25 11.896l-7.5 4.388-7.5-4.388"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M17.25 7.51l-7.5 4.388-7.5-4.388"
      />
    </svg>
    <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
      Unlock Your Potential
    </h2>
    <p className="mt-4 text-lg text-slate-400">
      Welcome to the future of learning. Your smart classroom awaits.
    </p>
  </div>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      switch (res.data.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "parent":
          navigate("/parent-dashboard");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white font-sans">
      <Navbar />
      <div className="flex w-full min-h-screen pt-20">
        {/* Left Side: Illustration (hidden on small screens) */}
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-12 bg-slate-800/50">
          <div className="animate-float">
            <AuthIllustration />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-md animate-slide-in-fade">
            <div className="p-8 space-y-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields with icons */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* Email Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* Lock Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>
                {error && (
                  <p className="text-red-400 text-sm text-center pt-2">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:bg-blue-400 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                <p className="text-center text-slate-400 text-sm pt-4">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Register here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
