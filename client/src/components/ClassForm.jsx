// client/src/components/ClassForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ClassForm = ({ onClassAdded }) => {
  const [className, setClassName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch the list of available teachers when the component loads
    const fetchTeachers = async () => {
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await api.get("/api/users/teachers");
        setTeachers(res.data);
      } catch (err) {
        setError("Could not load teachers.");
      }
    };
    fetchTeachers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!className || !teacherId) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.post("/api/classes", {
        name: className,
        teacherId,
      });
      setSuccess(`Class "${res.data.name}" created successfully!`);
      setClassName("");
      setTeacherId("");
      if (onClassAdded) {
        onClassAdded(res.data); // Notify parent component of the new class
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        Add a New Class
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-700"
          >
            Class Name
          </label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="e.g., Grade 10 - Section A"
          />
        </div>
        <div>
          <label
            htmlFor="teacher"
            className="block text-sm font-medium text-gray-700"
          >
            Assign Teacher
          </label>
          <select
            id="teacher"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Create Class
        </button>
      </form>
    </div>
  );
};

export default ClassForm;
