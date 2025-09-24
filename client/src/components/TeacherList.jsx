// client/src/components/TeacherList.jsx
import React, { useState, useEffect } from "react";
import { getTeachers } from "../api/apiService";
import { LoaderCircle, UserX } from "lucide-react";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const res = await getTeachers();
        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <LoaderCircle className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
      {teachers.length === 0 ? (
        <div className="text-center py-10">
          <UserX size={32} className="mx-auto text-slate-400" />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No teachers found.
          </p>
        </div>
      ) : (
        teachers.map((teacher) => (
          <div
            key={teacher._id}
            className="flex items-center rounded-lg bg-slate-50 dark:bg-slate-700/40 p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/50 font-bold text-sky-600 dark:text-sky-300">
              {getInitials(teacher.name)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {teacher.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {teacher.email}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherList;
