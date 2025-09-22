// src/components/StudentAssignments.jsx
import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

export default function StudentAssignments({ classId }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching assignments (frontend-only demo)
  useEffect(() => {
    setLoading(true);

    // Mock data
    const demoAssignments = [
      {
        id: "1",
        title: "Math Homework",
        description: "Complete exercises 5 to 10 from Chapter 3",
        createdAt: new Date().toISOString(),
        classId: "class-101",
      },
      {
        id: "2",
        title: "Science Project",
        description: "Prepare a model on renewable energy",
        createdAt: new Date().toISOString(),
        classId: "class-101",
      },
    ];

    // Filter if classId is provided
    const filtered = classId
      ? demoAssignments.filter((a) => a.classId === classId)
      : demoAssignments;

    setTimeout(() => {
      setAssignments(filtered);
      setLoading(false);
    }, 800); // simulate loading
  }, [classId]);

  return (
    <section className="bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
          <BookOpen className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          Assignments
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p className="text-sm text-slate-500">No assignments yet.</p>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border dark:border-slate-700"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {a.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {a.description || "No description"}
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleString()
                    : "Unknown date"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
