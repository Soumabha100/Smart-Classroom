// client/src/pages/AdminClassManagement.jsx

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  UserPlus,
  ArrowRight,
  Trash2,
  Edit,
  X,
  Users,
  UserCog,
  Search,
  CheckCircle,
} from "lucide-react";

import DashboardLayout from "../components/DashboardLayout";
import CreateClassForm from "../components/CreateClassForm";
import AdminEditClassModal from "../components/Admin/AdminEditClassModal";

// ✨ This component gets a major upgrade for a better UX
const ClassDetailsManager = ({ classItem, onClassUpdate }) => {
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});
  const token = localStorage.getItem("token");
  const dropdownRef = useRef(null);

  // --- State for the new searchable student dropdown ---
  const [allStudents, setAllStudents] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- State for teacher assignment ---
  const [newTeacherId, setNewTeacherId] = useState(
    classItem.teacher?._id || ""
  );
  const [allTeachers, setAllTeachers] = useState([]);

  // Fetch all students and teachers when component mounts
  useEffect(() => {
    const api = axios.create({ headers: { Authorization: `Bearer ${token}` } });

    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/users/students");
        setAllStudents(res.data);
      } catch (err) {
        setError((prev) => ({ ...prev, student: "Failed to load students." }));
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await api.get("/api/users/teachers");
        setAllTeachers(res.data);
      } catch (err) {
        setError((prev) => ({ ...prev, teacher: "Failed to load teachers." }));
      }
    };

    fetchStudents();
    fetchTeachers();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized list of students available for enrollment
  const availableStudents = useMemo(() => {
    const enrolledStudentIds = new Set(classItem.students.map((s) => s._id));
    return allStudents
      .filter((student) => !enrolledStudentIds.has(student._id))
      .filter((student) =>
        student.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
      );
  }, [allStudents, classItem.students, studentSearchTerm]);

  const handleAddStudent = async () => {
    if (!selectedStudent) {
      setError({ student: "Please select a student from the list." });
      return;
    }
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.post(`/api/classes/${classItem._id}/students`, {
        studentId: selectedStudent._id,
      });
      onClassUpdate(res.data);
      setSuccess({ student: `${selectedStudent.name} added successfully!` });

      // Reset the form
      setSelectedStudent(null);
      setStudentSearchTerm("");
      setIsDropdownOpen(false);

      setTimeout(() => setSuccess({}), 3000);
    } catch (err) {
      setError({ student: err.response?.data?.message || "Action failed." });
    }
  };

  const handleRemoveStudent = async (studentToRemove) => {
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.delete(
        `/api/classes/${classItem._id}/students/${studentToRemove._id}`
      );
      onClassUpdate(res.data);
      setSuccess({ student: `${studentToRemove.name} removed.` });
      setTimeout(() => setSuccess({}), 3000);
    } catch (err) {
      setError({ student: err.response?.data?.message || "Action failed." });
    }
  };

  const handleChangeTeacher = async () => {
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.put(`/api/classes/${classItem._id}/teacher`, {
        teacherId: newTeacherId,
      });
      setSuccess({ teacher: "Teacher assigned successfully!" });
      onClassUpdate(res.data);
      setTimeout(() => setSuccess({}), 3000);
    } catch (err) {
      setError({
        teacher: err.response?.data?.message || "Failed to assign teacher.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 border-t border-gray-700 pt-4 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Management */}
        <div>
          <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Users size={18} /> Enrolled Students ({classItem.students.length})
          </h4>
          <div className="mb-4 pr-2 max-h-40 overflow-y-auto space-y-2">
            {classItem.students.length > 0 ? (
              classItem.students.map((student) => (
                <div
                  key={student._id}
                  className="flex justify-between items-center bg-gray-900 p-2 rounded-lg"
                >
                  <span className="text-gray-400">{student.name}</span>
                  <button
                    onClick={() => handleRemoveStudent(student)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No students enrolled.</p>
            )}
          </div>

          <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <UserPlus size={18} /> Enroll New Student
          </h4>
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={
                  selectedStudent ? selectedStudent.name : studentSearchTerm
                }
                onChange={(e) => {
                  setStudentSearchTerm(e.target.value);
                  setSelectedStudent(null);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search for a student to add..."
                className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white"
              />
              <button
                onClick={handleAddStudent}
                disabled={!selectedStudent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>
            </div>

            <AnimatePresence>
              {isDropdownOpen && availableStudents.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  {availableStudents.map((student) => (
                    <li
                      key={student._id}
                      onClick={() => {
                        setSelectedStudent(student);
                        setStudentSearchTerm(student.name);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-gray-300 hover:bg-indigo-600 hover:text-white cursor-pointer flex justify-between items-center"
                    >
                      <span>
                        {student.name}{" "}
                        <span className="text-xs text-gray-500">
                          {student.email}
                        </span>
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {error.student && (
            <p className="text-red-500 text-xs mt-2">{error.student}</p>
          )}
          {success.student && (
            <p className="text-green-500 text-xs mt-2">{success.student}</p>
          )}
        </div>
        {/* Teacher Management */}
        <div>
          <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <UserCog size={18} /> Assign Teacher
          </h4>
          <div className="flex items-center gap-2">
            <select
              value={newTeacherId}
              onChange={(e) => setNewTeacherId(e.target.value)}
              className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white appearance-none"
            >
              <option value="" disabled>
                Select a teacher
              </option>
              {allTeachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleChangeTeacher}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Save
            </button>
          </div>
          {error.teacher && (
            <p className="text-red-500 text-xs mt-2">{error.teacher}</p>
          )}
          {success.teacher && (
            <p className="text-green-500 text-xs mt-2">{success.teacher}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Page Component (No changes needed here)
const AdminClassManagement = (
  {
    // ... props
  }
) => {
  // ... existing state and functions
  // The main component remains the same as before.
  // I am omitting it for brevity, but you should keep your existing code for this part.
  // Ensure you have the `AdminClassManagement` component code from our previous conversations.
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedClassId, setExpandedClassId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchAllClasses = useCallback(async () => {
    setLoading(true);
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.get("/api/classes/all");
      setClasses(res.data);
    } catch (err) {
      setError("Failed to fetch classes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllClasses();
  }, [fetchAllClasses]);

  const handleClassUpdate = (updatedClass) => {
    setClasses((prev) =>
      prev.map((c) => (c._id === updatedClass._id ? updatedClass : c))
    );
  };

  const handleNewClass = (newClass) => {
    setClasses((prev) => [newClass, ...prev]);
    setShowCreateForm(false);
  };

  const handleDeleteClass = async (classId) => {
    if (
      window.confirm("Are you sure you want to permanently delete this class?")
    ) {
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        await api.delete(`/api/classes/${classId}`);
        setClasses((prev) => prev.filter((c) => c._id !== classId));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete class.");
      }
    }
  };

  const handleUpdateClass = async (classId, classData) => {
    try {
      const api = axios.create({
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.put(`/api/classes/${classId}`, classData);
      handleClassUpdate(res.data);
      setEditingClass(null);
    } catch (err) {
      console.error("Failed to update class", err);
      throw err;
    }
  };

  const filteredClasses = useMemo(
    () =>
      classes.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [classes, searchTerm]
  );

  return (
    <DashboardLayout>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-white">
            Class Administration
          </h1>
          <p className="text-gray-400 mt-1">
            Full control over all classes in the institution.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg flex items-center gap-2"
        >
          <Plus size={20} /> Create New Class
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
              <CreateClassForm
                onClassAdded={handleNewClass}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminEditClassModal
        isOpen={!!editingClass}
        onClose={() => setEditingClass(null)}
        onSave={handleUpdateClass}
        classData={editingClass}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            System-Wide Class Roster
          </h2>
          <div className="relative w-1/3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by class or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="space-y-4">
          <AnimatePresence>
            {filteredClasses.map((classItem) => (
              <motion.div
                key={classItem._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-indigo-400">
                      {classItem.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Teacher:{" "}
                      {classItem.teacher?.name || (
                        <span className="text-yellow-500 italic">
                          Not Assigned
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Students: {classItem.students.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingClass(classItem)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classItem._id)}
                      className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedClassId(
                          expandedClassId === classItem._id
                            ? null
                            : classItem._id
                        )
                      }
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md"
                    >
                      <motion.div
                        animate={{
                          rotate: expandedClassId === classItem._id ? 90 : 0,
                        }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedClassId === classItem._id && (
                    <ClassDetailsManager
                      classItem={classItem}
                      onClassUpdate={handleClassUpdate}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminClassManagement;
