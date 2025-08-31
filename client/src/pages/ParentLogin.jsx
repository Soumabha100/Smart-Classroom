import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/images/tree.jpg";

export default function ParentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/parents/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); // Will be 'parent'
      navigate("/parent-dashboard");
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
      <main className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/20 p-8 shadow-2xl backdrop-blur-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Parent Portal Login
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email and Password inputs (can copy from Login.jsx) */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-lg border border-white/30 bg-transparent px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/80"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 w-full rounded-lg border border-white/30 bg-transparent px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/80"
            />
            {error && (
              <p className="pt-2 text-center text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="h-12 w-full rounded-lg bg-blue-600 font-bold text-white shadow-lg transition-colors duration-300 hover:bg-blue-700 hover:shadow-blue-500/50"
            >
              Sign In
            </button>
            <p className="pt-4 text-center text-sm text-gray-300">
              Are you a Student or Teacher?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-300 hover:text-white"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
