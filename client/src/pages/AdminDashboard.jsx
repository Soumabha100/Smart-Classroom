import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import UserCard from "../components/UserCard";
import AttendanceChartContainer from "../components/AttendanceChart";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* Left Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* User Cards */}
          <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="admin" />
            <UserCard type="teacher" />
            <UserCard type="student" />
            <UserCard type="parent" />
          </div>
          {/* Middle Charts */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* Attendance Chart */}
            <div className="w-full h-[450px]">
              <AttendanceChartContainer />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
