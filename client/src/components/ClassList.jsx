import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getClasses } from "../api/apiService"; 

const ClassList = () => {
  const [classes, setClasses] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses(); 
        setClasses(res.data); 
      } catch (err) {
        setError("Failed to fetch classes."); 
      } finally {
        setLoading(false); 
      }
    };
    fetchClasses();
  }, []); 

  return (
    <div className="h-full rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Classes Overview</h2>
        <Link
          to="/manage-classes"
          className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200"
        >
          Manage All
        </Link>
      </div>
      {loading && <p className="text-slate-500">Loading classes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
        {!loading && classes.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <p className="text-slate-500">No classes found.</p>
            <Link
              to="/manage-classes"
              className="mt-1 font-semibold text-blue-600 hover:underline"
            >
              Create one now!
            </Link>
          </div>
        ) : (
          classes.map((classItem) => (
            <div
              key={classItem._id}
              className="rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{classItem.name}</h3>
                  <p className="text-sm text-slate-500">
                    Teacher: {classItem.teacher.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    {classItem.students.length}
                  </p>
                  <p className="text-xs text-slate-500">Students</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassList;
