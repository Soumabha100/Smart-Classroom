import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth
import { LoaderCircle } from "lucide-react";

// A simple loading component for the transition
const RouteLoader = () => (
  <div className="flex justify-center items-center h-screen w-full bg-slate-50 dark:bg-slate-900">
    <LoaderCircle className="w-8 h-8 animate-spin text-indigo-500" />
  </div>
);

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // 2. Get user and loading state from context

  // 3. While the context is loading, show a loader to prevent premature redirects
  if (loading) {
    return <RouteLoader />;
  }

  // 4. After loading, if there is no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 5. If a role is required and it doesn't match, redirect to the user's correct dashboard
  if (role && user.role !== role) {
    let homePath = "/dashboard"; // default student
    if (user.role === "teacher") homePath = "/teacher-dashboard";
    if (user.role === "admin") homePath = "/admin-dashboard";
    if (user.role === "parent") homePath = "/parent-dashboard";
    return <Navigate to={homePath} />;
  }

  // 6. If everything is fine, render the requested component
  return children;
};

export default ProtectedRoute;
