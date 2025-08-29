// client/src/components/TeacherList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await api.get("/api/users/teachers");
        setTeachers(res.data);
      } catch (err) {
        setError("Failed to fetch teachers.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">Teachers</h2>
      {loading && <p>Loading teachers...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-3">
        {teachers.map((teacher) => (
          <li key={teacher._id} className="p-3 bg-slate-50 rounded-md">
            {teacher.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherList;
