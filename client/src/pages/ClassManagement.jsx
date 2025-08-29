// client/src/pages/ClassManagementPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

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
              {/* Add Edit/Delete buttons here later */}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClassManagementPage;
