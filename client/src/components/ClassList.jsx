// client/src/components/ClassList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// ✨ THE FIX: Import the new admin-specific function
import { getAllClassesForAdmin } from "../api/apiService";
import { LoaderCircle, Book, Users, ArrowRight } from "lucide-react";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state for robustness

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✨ THE FIX: Call the correct API function meant for admins
        const res = await getAllClassesForAdmin();
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch classes for admin:", err);
        setError("Could not load class data."); // Set an error message
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <LoaderCircle className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Display an error message if the fetch fails
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
      {classes.length === 0 ? (
        <div className="text-center py-10">
          <Book size={32} className="mx-auto text-slate-400" />
          <p className="mt-2 text-sm text-slate-500">
            No classes have been created in the system yet.
          </p>
        </div>
      ) : (
        classes.map((classItem) => (
          <Link
            to={`/class/${classItem._id}`}
            key={classItem._id}
            className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {classItem.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Teacher: {classItem.teacher?.name || "N/A"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Users size={14} />
                    {classItem.students.length}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ClassList;
