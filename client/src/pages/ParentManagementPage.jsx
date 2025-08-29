import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const ParentManagementPage = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const api = axios.create({ headers: { Authorization: `Bearer ${token}` } });

  const fetchData = async () => {
    try {
      const [parentsRes, studentsRes] = await Promise.all([
        api.get("/api/parents"),
        api.get("/api/users/students"),
      ]);
      setParents(parentsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      setError("Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/api/parents/register", {
        name,
        email,
        password,
        studentIds: selectedStudents,
      });
      setSuccess(`Parent "${res.data.name}" created successfully!`);
      // Reset form and refetch data
      setName("");
      setEmail("");
      setPassword("");
      setSelectedStudents([]);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create parent.");
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Manage Parents</h1>
        <p className="text-slate-600">
          Create parent accounts and link them to students.
        </p>
      </header>

      {/* Form for adding a new parent */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Add New Parent
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields for name, email, password */}
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Link Students</label>
            <select
              multiple
              value={selectedStudents}
              onChange={(e) =>
                setSelectedStudents(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="mt-1 w-full p-2 border rounded h-32"
            >
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl or Cmd to select multiple students.
            </p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Create Parent Account
          </button>
        </form>
      </div>

      {/* List of existing parents */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Existing Parents
        </h2>
        <div className="space-y-3">
          {parents.map((parent) => (
            <div key={parent._id} className="p-3 bg-slate-50 rounded-md">
              <p className="font-bold">
                {parent.name} ({parent.email})
              </p>
              <p className="text-sm text-slate-600">
                Children: {parent.students.map((s) => s.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentManagementPage;
