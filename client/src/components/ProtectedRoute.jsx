import React from 'react';
import { Navigate } from 'react-router-dom';

// The component now accepts an optional 'role' prop
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // If no token, always redirect to login
    return <Navigate to="/login" />;
  }

  // If a role is required and the user's role doesn't match, redirect
  if (role && userRole !== role) {
  // Send them to their own correct dashboard
  let homePath = '/dashboard'; // default student
  if (userRole === 'teacher') homePath = '/teacher-dashboard';
  if (userRole === 'admin') homePath = '/admin-dashboard';
  if (userRole === 'parent') homePath = '/parent-dashboard'; // ✨ ADD THIS
  return <Navigate to={homePath} />;
}

  // If authenticated and (no role required OR role matches), render the component
  return children;
};

export default ProtectedRoute;