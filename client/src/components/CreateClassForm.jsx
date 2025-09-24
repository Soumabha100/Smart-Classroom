// src/components/CreateClassForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Book, User, PlusCircle } from "lucide-react";

const CreateClassForm = ({ onClassAdded, onCancel }) => {
  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch available teachers to populate the dropdown
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
      }
    };
    fetchTeachers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !teacherId) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.post("/api/classes", { name, teacher: teacherId });
      onClassAdded(res.data); // Pass the new class data to the parent
      // Reset form fields
      setName("");
      setTeacherId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <Book
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Class Name (e.g., Grade 10 Math)"
          className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
        />
      </div>

      <div className="relative">
        <User
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
          required
        >
          <option value="" disabled>
            Select a Teacher
          </option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="flex items-center justify-end gap-4 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 font-semibold py-2 px-4 rounded-lg"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <PlusCircle size={20} />
              <span>Create Class</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default CreateClassForm;
