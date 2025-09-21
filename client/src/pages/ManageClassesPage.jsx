import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import TeacherClassManager from "../components/Class/TeacherClassManager"; // We will create this next

const ManageClassesPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/teacher-dashboard")}
              className="p-2 rounded-full transition-colors text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Manage Your Classes
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Create new classes, view enrolled students, and manage
                assignments.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <TeacherClassManager />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageClassesPage;
