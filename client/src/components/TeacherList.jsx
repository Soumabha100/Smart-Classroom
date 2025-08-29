import React, { useState, useEffect } from "react";
import { getTeachers } from "../api/apiService"; // 1. Import the specific function

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await getTeachers(); // 2. Use the simplified, centralized function
        setTeachers(res.data);
      } catch (err) {
        setError("Failed to fetch teachers.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">Teachers</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-3 max-h-60 overflow-y-auto">
        {teachers.length > 0
          ? teachers.map((teacher) => (
              <li
                key={teacher._id}
                className="p-3 bg-slate-50 rounded-md text-slate-700"
              >
                {teacher.name}
              </li>
            ))
          : !loading && <p className="text-slate-500">No teachers found.</p>}
      </ul>
    </div>
  );
};

export default TeacherList;
