import React from "react";
import { useNavigate } from "react-router-dom";
import { Presentation, ArrowRight } from "lucide-react";

const ClassPreview = ({ classes, isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-800 dark:text-white mb-4">
        <Presentation className="w-6 h-6 text-indigo-500" />
        Your Classes
      </h2>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-slate-500 dark:text-slate-400">
            Loading classes...
          </p>
        ) : classes.length > 0 ? (
          classes.slice(0, 3).map(
            (
              cls // Show a preview of the first 3 classes
            ) => (
              <div
                key={cls._id}
                className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md"
              >
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {cls.name}
                </p>
              </div>
            )
          )
        ) : (
          <p className="text-slate-500 dark:text-slate-400">
            You haven't created any classes yet.
          </p>
        )}
      </div>

      <button
        onClick={() => navigate("/manage-classes")}
        className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 mt-6 font-bold text-white transition-colors bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Manage All Classes
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ClassPreview;
