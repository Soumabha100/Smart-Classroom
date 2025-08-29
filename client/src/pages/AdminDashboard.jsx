import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import UserCard from "../components/UserCard";
import TeacherList from "../components/TeacherList";
import ClassList from "../components/ClassList";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      {/* Dashboard Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Admin Overview
        </h1>
        <p className="mt-2 text-slate-500">
          A high-level view of your Smart Classroom ecosystem.
        </p>
      </header>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <UserCard type="admin" />
        <UserCard type="teacher" />
        <UserCard type="student" />
        <UserCard type="parent" />
      </div>

      {/* Main Content Grids */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Classes List */}
        <div className="lg:col-span-2">
          <ClassList />
        </div>
        {/* Teachers List */}
        <div className="lg:col-span-1">
          <TeacherList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
