// client/src/pages/AdminDashboard.jsx
import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import UserCard from "../components/UserCard";
import TeacherList from "../components/TeacherList";
import ClassList from "../components/ClassList";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Admin Overview</h1>
        <p className="text-slate-600 mt-1">
          A high-level view of your Smart Classroom.
        </p>
      </header>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UserCard type="admin" />
        <UserCard type="teacher" />
        <UserCard type="student" />
        <UserCard type="parent" />
      </div>

      {/* Main Content Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <ClassList />
          {/* You can add more components here, like "Recent Activity" */}
        </div>
        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          <TeacherList />
          {/* You can add "Announcements" or other widgets here */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
