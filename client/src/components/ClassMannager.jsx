import React, { useEffect, useState } from "react";
import { load, save } from "../utils/storage";
import { AnimatePresence, motion } from "framer-motion";

export default function ClassesManager() {
  const [classes, setClasses] = useState([]);
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setClasses(load("td_classes", []));
  }, []);

  const addClass = () => {
    const id = (newId || "").trim();
    if (!id) return;
    const items = load("td_classes", []);
    if (items.find((c) => c.id === id)) {
      alert("Class ID already exists.");
      return;
    }
    const newClass = { id, name: newName.trim() || undefined, students: [] };
    const updated = [newClass, ...items];
    save("td_classes", updated);
    setClasses(updated);
    setNewId("");
    setNewName("");
  };

  const removeClass = (id) => {
    if (!window.confirm("Delete class?")) return;
    const updated = load("td_classes", []).filter((c) => c.id !== id);
    save("td_classes", updated);
    setClasses(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Classes Manager
      </h2>

      {/* Input Section */}
      <div className="flex gap-2 mb-4">
        <input
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          placeholder="Class ID (e.g. CSE-501)"
          className="px-3 py-2 border rounded w-1/3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Optional name"
          className="px-3 py-2 border rounded flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
        <button
          onClick={addClass}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all duration-300"
        >
          Add
        </button>
      </div>

      {/* Classes List */}
      <div className="space-y-2">
        {classes.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-gray-400">
            No classes yet.
          </p>
        )}
        <AnimatePresence>
          {classes.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-3 border rounded flex justify-between items-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition"
            >
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">
                  {c.id}
                </div>
                <div className="text-sm text-slate-500 dark:text-gray-400">
                  {c.name || "-"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-slate-600 dark:text-gray-300">
                  {(c.students || []).length} students
                </div>
                <button
                  onClick={() => removeClass(c.id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-all duration-300"
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
