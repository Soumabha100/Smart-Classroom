import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

// Reusing the same illustration component
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
      Join the Next Generation
    </h2>
    <p className="mt-4 text-lg text-slate-400">
      Create your account and start your journey in a smarter classroom today.
    </p>
  </div>
);

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { name, email, password };
      if (invitationCode) {
        payload.invitationCode = invitationCode;
      }
      await axios.post("/api/auth/register", payload);
      alert("Registration successful! Please proceed to the login page.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white font-sans">
      <Navbar />
      <div className="flex w-full min-h-screen pt-20">
        {/* Left Side: Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-12 bg-slate-800/50">
          <div className="animate-float">
            <AuthIllustration />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-md animate-slide-in-fade">
            <div className="p-8 space-y-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <h1 className="text-3xl font-bold text-center">
                Create Your Account
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields with icons */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-12 bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                <div>
                  <input
                    type="text"
                    placeholder="Invitation Code (optional)"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    className="w-full h-12 bg-slate-700/50 text-white placeholder-slate-400 border border-slate-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-2 text-xs text-center text-slate-400">
                    Leave blank for student registration.
                  </p>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center pt-2">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:bg-blue-400 transform hover:scale-105"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
                <p className="text-center text-slate-400 text-sm pt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Login
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
