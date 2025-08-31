import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/images/tree.jpg";

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
      // All logins now go to the single, unified endpoint
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Centralized redirection logic
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
        default: // "student"
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
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Navbar />
      <main className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-black/20 p-8 shadow-2xl backdrop-blur-lg border border-white/20">
          <h1 className="text-3xl font-bold text-center text-white mb-6">
            Smart Classroom Portal
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400/80"
              />
            </div>
            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400/80"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center pt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-blue-500/50 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center text-gray-300 text-sm pt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-300 hover:text-white font-semibold"
              >
                Register as a Student
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
