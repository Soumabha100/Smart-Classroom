import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import api from "../api/apiService";
import { Loader2 } from "lucide-react";

// A simple, modern SVG for branding
const AuthIllustration = () => (
  <div className="relative flex items-center justify-center bg-cover bg-center min-h-[300px]">
    <div className="text-center relative z-10 ">
      <div className="w-48 h-48 mx-auto bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm animate-pulse-slow">
        <svg
          className="w-24 h-24 text-blue-400 drop-shadow-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>
      <h2 className="text-4xl font-extrabold tracking-tight text-white mb-4">
        Unlock Your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
          Potential
        </span>
      </h2>
      <b className="text-lg text-slate-300 max-w-sm mx-auto leading-relaxed">
        Welcome to the future of learning. Your smart classroom awaits.
      </b>
    </div>
  </div>
);

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 1. ✅ GET USER & LOADING FROM CONTEXT
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // 2. ✅ REDIRECT IF LOGGED IN (Stops the Loop)
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "teacher") navigate("/teacher-dashboard");
      else if (user.role === "parent") navigate("/parent-dashboard");
      else navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    setErrors({});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await api.post("/auth/google-login", { idToken });

      if (res.status === 202) {
        navigate("/complete-profile", {
          state: {
            googleData: res.data.googleData,
            idToken: idToken,
          },
        });
        return;
      }

      // 3. ✅ FORCE RELOAD FOR COOKIES
      // After Google login success, the cookie is set.
      // We force a full page load to ensure all sockets/contexts pick it up fresh.
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      toast.error("Google Sign-In failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      // login() from AuthContext handles state update
      await login(formData.email, formData.password);
      setErrors({});
      // Navigation is handled by the useEffect above
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // 4. ✅ PREVENT FLASH: If loading or user exists, show spinner
  if (loading || user) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white font-sans">
      <Navbar />
      <div className="flex w-full min-h-screen pt-20">
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 p-12 bg-slate-800/50">
          <div className="animate-float">
            <AuthIllustration />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-md animate-slide-in-fade">
            <div className="p-8 space-y-6 bg-slate-800/50 rounded-2xl border border-slate-700">
              <h1 className="text-3xl font-bold text-center">Welcome Back</h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                {errors.general && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full h-12 bg-slate-700/50 text-white placeholder-slate-400 border ${errors.email ? "border-red-500" : "border-slate-600"} rounded-xl py-2 px-4 pl-12 focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"} transition-all duration-200`}
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
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full h-12 bg-slate-700/50 text-white placeholder-slate-400 border ${errors.password ? "border-red-500" : "border-slate-600"} rounded-xl py-2 px-4 pl-12 pr-12 focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"} transition-all duration-200`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25 2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? "Signing In..." : "Sign In"}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-700"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider font-medium">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-slate-700"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={submitting}
                  className="w-full h-12 bg-white text-slate-900 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />{" "}
                  Sign in with Google
                </button>

                <p className="text-center text-slate-400 text-sm pt-2">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
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
