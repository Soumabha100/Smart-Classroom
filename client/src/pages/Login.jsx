import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/images/tree.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
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
            Welcome Back
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form content remains the same... */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400/80"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
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
                className="w-full h-12 bg-transparent text-white placeholder-gray-300 border border-white/30 rounded-lg py-2 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400/80"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center pt-2">{error}</p>
            )}
            <button
              type="submit"
              className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              Sign In
            </button>
            <p className="text-center text-gray-300 text-sm pt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-300 hover:text-white font-semibold"
              >
                Register now
              </Link>
            </p>
          </form>
        </div>
      </main>
      <footer className="absolute bottom-0 left-0 w-full p-4 text-center">
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} Smart Classroom. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
