import React from "react";
import { Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";

// --- Page Imports ---
// Public Pages
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentClassesPage from "./pages/StudentClassesPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import LearningPath from "./pages/LearningPath.jsx";
import AiDashboardPage from "./pages/AiDashboardPage.jsx";

// Teacher Pages
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import ManageClassesPage from "./pages/ManageClassesPage.jsx";
import TeacherAttendancePage from "./pages/TeacherAttendancePage.jsx";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminClassManagement from "./pages/AdminClassManagement.jsx";
import ParentManagementPage from "./pages/ParentManagementPage";
import InvitationManagement from "./pages/InvitationManagement";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage.jsx";

// Parent Pages
import ParentDashboard from "./pages/ParentDashboard";

// Shared Authenticated Pages
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import DrivePage from "./pages/DrivePage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import ClassDetailsPage from "./pages/ClassDetailsPage.jsx";
import ChatHistoryPage from "./pages/ChatHistoryPage";

// --- Component Imports ---
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className:
            "!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-white",
          style: {
            border:
              theme === "dark"
                ? "1px solid rgb(51, 65, 85)"
                : "1px solid rgb(226, 232, 240)",
            padding: "16px",
            color: theme === "dark" ? "#f8fafc" : "#0f172a",
          },
          success: {
            iconTheme: {
              primary: theme === "dark" ? "#22c55e" : "#16a34a",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: theme === "dark" ? "#ef4444" : "#dc2626",
              secondary: "white",
            },
          },
        }}
      />
      <Routes>
        {/* ================================================================== */}
        {/* PUBLIC ROUTES                              */}
        {/* ================================================================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* ================================================================== */}
        {/* STUDENT ROUTES                             */}
        {/* ================================================================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/classes"
          element={
            <ProtectedRoute role="student">
              <StudentClassesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute role="student">
              <AttendancePage />
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
          path="/ai-dashboard"
          element={
            <ProtectedRoute role="student">
              <AiDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ================================================================== */}
        {/* TEACHER ROUTES                             */}
        {/* ================================================================== */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/manage-classes"
          element={
            <ProtectedRoute role="teacher">
              <ManageClassesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute role="teacher">
              <TeacherAttendancePage />
            </ProtectedRoute>
          }
        />

        {/* ================================================================== */}
        {/* ADMIN ROUTES                              */}
        {/* ================================================================== */}
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
              <AdminClassManagement />
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
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute role="admin">
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* ================================================================== */}
        {/* PARENT ROUTES                             */}
        {/* ================================================================== */}
        <Route
          path="/parent-dashboard"
          element={
            <ProtectedRoute role="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================================================================== */}
        {/* SHARED ROUTES (All Authenticated Users)                */}
        {/* ================================================================== */}
        <Route
          path="/class/:classId"
          element={
            <ProtectedRoute>
              <ClassDetailsPage />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/drive"
          element={
            <ProtectedRoute>
              <DrivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning-path"
          element={
            <ProtectedRoute>
              <LearningPath />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <ForumPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forum/post/:postId"
          element={
            <ProtectedRoute>
              <PostDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-history"
          element={
            <ProtectedRoute>
              <ChatHistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
