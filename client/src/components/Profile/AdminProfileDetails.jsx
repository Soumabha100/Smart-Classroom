import React from "react";
import { Database, Server } from "lucide-react";

const AdminProfileDetails = ({ user }) => {
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <h3 className="flex items-center gap-3 text-xl font-semibold text-slate-800 dark:text-white">
        <Server className="w-6 h-6 text-purple-500" />
        System Status
      </h3>
      <ul className="mt-4 space-y-2">
        <li className="text-slate-700 dark:text-slate-300">Total Users: 250</li>
        <li className="text-slate-700 dark:text-slate-300">
          Total Classes: 15
        </li>
        <li className="text-slate-700 dark:text-slate-300">
          Server Health: Optimal
        </li>
      </ul>
    </div>
  );
};

export default AdminProfileDetails;
