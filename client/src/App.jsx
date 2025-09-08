import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Pages
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClassManagement from "./pages/ClassManagement.jsx";
import ClassDetailsPage from "./pages/ClassDetailsPage.jsx";
import ParentManagementPage from "./pages/ParentManagementPage";
import ParentDashboard from "./pages/ParentDashboard";
import InvitationManagement from "./pages/InvitationManagement";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import DrivePage from "./pages/DrivePage.jsx";
import LearningPath from "./pages/LearningPath.jsx";

// Import Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  // This component now only defines the routes.
  // The Router and AuthProvider are correctly placed in index.jsx.
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute role="student">
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drive"
        element={
          <ProtectedRoute role="student">
            <DrivePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learning-path"
        element={
          <ProtectedRoute role="student">
            <LearningPath />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-classes"
        element={
          <ProtectedRoute role="admin">
            <ClassManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/class/:classId"
        element={
          <ProtectedRoute role="admin">
            <ClassDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-parents"
        element={
          <ProtectedRoute role="admin">
            <ParentManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-invites"
        element={
          <ProtectedRoute role="admin">
            <InvitationManagement />
          </ProtectedRoute>
        }
      />

      {/* Parent Routes */}
      <Route
        path="/parent-dashboard"
        element={
          <ProtectedRoute role="parent">
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
