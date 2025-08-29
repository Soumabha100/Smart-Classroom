// client/src/pages/ClassManagementPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import ClassForm from "../components/ClassForm";
import { Link } from "react-router-dom";

// A new component for managing students in a single class
const StudentManager = ({ classItem, onStudentAdded }) => {
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
      setStudentId("");
      onStudentAdded(res.data); // Update the parent component state
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student.");
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-slate-700">Enrolled Students:</h4>
      <ul className="list-disc pl-5 text-slate-600">
        {classItem.students.map((student) => (
          <li key={student._id}>{student.name}</li>
        ))}
      </ul>
      <form
        onSubmit={handleAddStudent}
        className="flex items-center gap-2 mt-4"
      >
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter Student ID"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
    </div>
  );
};

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        setError("Failed to fetch classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [token]);

  const handleNewClass = (newClass) => {
    // To show the new class instantly, we need to get the full teacher info
    const updatedClass = {
      ...newClass,
      teacher: { name: "New Teacher" }, // This is a placeholder, ideally the API would return the populated teacher
      students: [],
    };
    setClasses((prevClasses) => [...prevClasses, updatedClass]);
  };

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Manage Classes</h1>
        <p className="text-slate-600">View, create, and manage all classes.</p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Class List
        </h2>
        {loading && <p>Loading classes...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{classItem.name}</h3>
                <p className="text-sm text-slate-600">
                  Teacher: {classItem.teacher.name}
                </p>
                <p className="text-sm text-slate-500">
                  Students: {classItem.students.length}
                </p>
              </div>
              <Link
                to={`/class/${classItem._id}`}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ClassForm component */}
      <ClassForm onClassAdded={handleNewClass} />
    </DashboardLayout>
  );
};

export default ClassManagementPage;
