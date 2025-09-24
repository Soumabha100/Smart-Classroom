// src/pages/ClassManagementPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, UserPlus, ArrowRight, Trash2, X } from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import CreateClassForm from "../components/CreateClassForm"; // ✨ IMPORTANT: Import the new component

// (The StudentManager component code remains the same as before)
const StudentManager = ({ classItem, onStudentUpdated }) => {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentId) {
      setError("Please enter a student ID.");
      return;
    }
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.post(`/api/classes/${classItem._id}/students`, {
        studentId,
      });
      setSuccess("Student added successfully!");
      setError("");
      setStudentId("");
      onStudentUpdated(res.data);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setSuccess("");
      setError(err.response?.data?.message || "Failed to add student.");
    }
  };

  const handleRemoveStudent = async (studentToRemoveId) => {
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.delete(
        `/api/classes/${classItem._id}/students/${studentToRemoveId}`
      );
      onStudentUpdated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove student.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-4 border-t border-gray-700 pt-4"
    >
      <h4 className="font-semibold text-gray-300 mb-3">Enrolled Students:</h4>
      <div className="mb-4 pr-2 max-h-48 overflow-y-auto">
        {classItem.students.length > 0 ? (
          <ul className="space-y-2">
            <AnimatePresence>
              {classItem.students.map((student) => (
                <motion.li
                  key={student._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                  className="flex justify-between items-center bg-gray-800 p-2 rounded-lg"
                >
                  <span className="text-gray-400">{student.name}</span>
                  <button
                    onClick={() => handleRemoveStudent(student._id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="text-gray-500 italic">No students enrolled yet.</p>
        )}
      </div>

      <form
        onSubmit={handleAddStudent}
        className="flex items-center gap-2 mt-4"
      >
        <div className="relative flex-grow">
          <UserPlus
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              setError("");
              setSuccess("");
            }}
            placeholder="Enter Student ID to Add"
            className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105"
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-green-500 text-sm mt-2"
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedClassId, setExpandedClassId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        const res = await api.get("/api/classes");
        setClasses(res.data);
      } catch (err) {
        setError(
          "Failed to fetch classes. Please check your connection or try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [token]);

  const handleNewClass = (newClass) => {
    setClasses((prevClasses) => [newClass, ...prevClasses]);
    setShowCreateForm(false);
  };

  const handleStudentUpdated = (updatedClass) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => (c._id === updatedClass._id ? updatedClass : c))
    );
  };

  const filteredClasses = useMemo(
    () =>
      classes.filter(
        (classItem) =>
          classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (classItem.teacher &&
            classItem.teacher.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      ),
    [classes, searchTerm]
  );

  return (
    <DashboardLayout>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-white">Manage Classes</h1>
          <p className="text-gray-400 mt-1">
            Oversee, create, and administrate all classes within the system.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Class
        </motion.button>
      </motion.header>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Create a New Class
                </h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              {/* ✨ Use the new component here */}
              <CreateClassForm
                onClassAdded={handleNewClass}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-gray-700"
      >
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Class Roster</h2>
          <input
            type="text"
            placeholder="Search by name or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {loading && (
          <p className="text-center text-gray-400">Loading classes...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="space-y-4">
          <AnimatePresence>
            {filteredClasses.map((classItem) => (
              <motion.div
                key={classItem._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedClassId(
                      expandedClassId === classItem._id ? null : classItem._id
                    )
                  }
                >
                  <div>
                    <h3 className="font-bold text-lg text-indigo-400">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Teacher: {classItem.teacher?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Students: {classItem.students.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/class/${classItem._id}`}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details <ArrowRight size={16} />
                    </Link>
                    <motion.div
                      animate={{
                        rotate: expandedClassId === classItem._id ? 90 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="text-gray-400" />
                    </motion.div>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedClassId === classItem._id && (
                    <StudentManager
                      classItem={classItem}
                      onStudentUpdated={handleStudentUpdated}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredClasses.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No classes found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ClassManagementPage;
