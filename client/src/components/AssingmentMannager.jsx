import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { load, save, genId } from "../utils/storage";

export default function AssignmentsManager({ classIdProp }) {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [classId, setClassId] = useState(classIdProp || "");

  useEffect(() => {
    setAssignments(load("td_assignments", []));
    setClasses(load("td_classes", []));
  }, []);

  useEffect(() => {
    if (classIdProp) setClassId(classIdProp);
  }, [classIdProp]);

  const create = () => {
    if (!title.trim()) return alert("Enter title");
    const item = {
      id: genId(),
      title: title.trim(),
      description: desc.trim(),
      classId: classId || (classes[0] ? classes[0].id : ""),
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...load("td_assignments", [])];
    save("td_assignments", updated);
    setAssignments(updated);
    setTitle("");
    setDesc("");
  };

  const remove = (id) => {
    if (!window.confirm("Delete assignment?")) return;
    const updated = load("td_assignments", []).filter((a) => a.id !== id);
    save("td_assignments", updated);
    setAssignments(updated);
  };

  const filtered = assignments.filter((a) => !classId || a.classId === classId);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">📝 Assignments Manager</h2>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <div className="flex gap-2 mb-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-white placeholder-slate-400"
          />
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 border border-slate-600 text-white"
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-600 text-white placeholder-slate-400"
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={create}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:from-blue-500 hover:to-indigo-500 transition"
          >
            Create
          </button>
        </div>
      </motion.div>

      {/* Assignment List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400">
            No assignments for selected class.
          </p>
        )}
        <AnimatePresence>
          {filtered.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-lg bg-gradient-to-r from-indigo-600/80 to-blue-600/80 shadow"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm opacity-80">{a.description}</p>
                </div>
                <div className="text-sm opacity-70">
                  {new Date(a.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => remove(a.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
