import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/apiService";

const StudentCard = ({ student }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
      <p className="text-sm text-slate-500 mb-4">{student.email}</p>

      <div className="mt-4">
        <h4 className="font-semibold text-slate-700 mb-2">Recent Attendance</h4>
        {student.attendance && student.attendance.length > 0 ? (
          <ul className="space-y-2">
            {student.attendance.map((record) => (
              <li
                key={record._id}
                className="flex justify-between items-center rounded-md bg-slate-50 p-2"
              >
                <span className="text-sm text-slate-600">
                  {new Date(record.timestamp).toLocaleDateString()}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    record.status === "Present"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {record.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">
            No attendance records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default function ParentDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/parents/my-students");
        setStudents(res.data);
      } catch (err) {
        setError("Failed to fetch student data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading dashboard...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Parent Dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Welcome! Here's an overview of your children's progress.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {students.length > 0 ? (
          students.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))
        ) : (
          <p>No students are linked to your account.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
