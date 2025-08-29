import React, { useState, useEffect } from "react";
import { getTeachers } from "../api/apiService"; 

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await getTeachers(); 
        setTeachers(res.data); 
      } catch (err) {
        setError("Failed to fetch teachers."); 
      } finally {
        setLoading(false); 
      }
    };
    fetchTeachers();
  }, []); 

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-full rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-slate-800">Active Teachers</h2>
      {loading && <p className="text-slate-500">Loading teachers...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="max-h-96 space-y-3 overflow-y-auto pr-2">
        {!loading && teachers.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <p className="text-slate-500">No teachers found.</p>
          </div>
        ) : (
          teachers.map((teacher) => (
            <li
              key={teacher._id}
              className="flex items-center rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-200 font-bold text-sky-700">
                {getInitials(teacher.name)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-slate-800">
                  {teacher.name}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TeacherList;
