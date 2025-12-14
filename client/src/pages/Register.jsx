import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

// Reusing same optimized illustration component
const AuthIllustration = () => (
  <div className="text-center relative z-10">
    <div className="w-48 h-48 mx-auto bg-gradient-to-tr from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm animate-pulse-slow">
      <svg
        className="w-24 h-24 text-teal-400 drop-shadow-lg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
        />
      </svg>
    </div>
    <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">
      Join the{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
        Future
      </span>
    </h2>
    <p className="text-lg text-slate-300 max-w-sm mx-auto leading-relaxed">
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
      if (invitationCode) payload.invitationCode = invitationCode;

      await axios.post("/api/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white font-sans flex relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-teal-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[40%] bg-green-600/10 rounded-full blur-[100px]"></div>
      </div>

      <Navbar />

      <div className="flex w-full min-h-screen pt-16 relative z-10">
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-12 relative">
          <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-sm"></div>
          <AuthIllustration />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8 animate-slide-in-fade">
              <h1 className="text-3xl font-bold text-center mb-8">
                Create Account
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full h-12 bg-slate-900/50 text-white placeholder-slate-500 border border-slate-600 rounded-xl py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    />
                    <svg
                      className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 group-focus-within:text-teal-400 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>

                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-12 bg-slate-900/50 text-white placeholder-slate-500 border border-slate-600 rounded-xl py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    />
                    <svg
                      className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 group-focus-within:text-teal-400 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>

                  <div className="relative group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-12 bg-slate-900/50 text-white placeholder-slate-500 border border-slate-600 rounded-xl py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    />
                    <svg
                      className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 group-focus-within:text-teal-400 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Invitation Code (optional)"
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      className="w-full h-12 bg-slate-900/50 text-white placeholder-slate-500 border border-slate-600 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Leave blank for student registration.
                    </p>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-center text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-teal-400 hover:text-teal-300 font-semibold hover:underline"
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
