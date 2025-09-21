import React from "react";
import { Users, ClipboardList } from "lucide-react";

const TeacherProfileDetails = ({ user }) => {
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <h3 className="flex items-center gap-3 text-xl font-semibold text-slate-800 dark:text-white">
        <Users className="w-6 h-6 text-green-500" />
        Teaching Overview
      </h3>
      <ul className="mt-4 space-y-2">
        <li className="text-slate-700 dark:text-slate-300">
          Department: Computer Science
        </li>
        <li className="text-slate-700 dark:text-slate-300">
          Active Classes: 4
        </li>
        <li className="text-slate-700 dark:text-slate-300">
          Total Students: 120
        </li>
      </ul>
    </div>
  );
};

export default TeacherProfileDetails;
