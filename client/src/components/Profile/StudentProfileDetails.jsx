import React from "react";
import {
  BookOpen,
  CheckCircle,
  BarChart,
  TrendingUp,
  Activity,
} from "lucide-react";
import StatCard from "./StatCard"; // Import our new component

// A simple progress bar component
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700">
    <div
      className="bg-indigo-500 h-2 rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const StudentProfileDetails = ({ user }) => {
  // Dummy data - replace with real data from your user object/API
  const academicData = {
    attendance: "92%",
    streak: "14 Days",
    assignmentsDue: 3,
    coursesCompleted: 5,
    enrolledClasses: [
      { name: "Data Structures", progress: 75 },
      { name: "Algorithms", progress: 60 },
      { name: "Database Systems", progress: 85 },
    ],
    recentActivity: [
      { action: "Submitted Assignment", course: "Algorithms", time: "2h ago" },
      { action: "Attended Lecture", course: "Data Structures", time: "1d ago" },
      { action: "Passed Quiz", course: "Database Systems", time: "3d ago" },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BarChart className="w-6 h-6" />}
          label="Overall Attendance"
          value={academicData.attendance}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Attendance Streak"
          value={academicData.streak}
          color="green"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Courses Completed"
          value={academicData.coursesCompleted}
          color="purple"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6" />}
          label="Assignments Due"
          value={academicData.assignmentsDue}
          color="yellow"
        />
      </div>

      {/* Enrolled Classes and Recent Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="p-6 bg-white border rounded-lg shadow-sm lg:col-span-3 dark:bg-slate-800 dark:border-slate-700">
          <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-slate-800 dark:text-white">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            Enrolled Classes
          </h3>
          <ul className="space-y-4">
            {academicData.enrolledClasses.map((cls) => (
              <li key={cls.name}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {cls.name}
                  </p>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {cls.progress}%
                  </p>
                </div>
                <ProgressBar progress={cls.progress} />
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 bg-white border rounded-lg shadow-sm lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
          <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-slate-800 dark:text-white">
            <Activity className="w-6 h-6 text-indigo-500" />
            Recent Activity
          </h3>
          <ul className="space-y-3">
            {academicData.recentActivity.map((activity, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <div className="mt-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {activity.action}:{" "}
                    <span className="font-normal">{activity.course}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activity.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileDetails;
