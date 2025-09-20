import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { load, save, genId } from "../utils/storage";

export default function HODFeed() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setItems(load("td_hod_feed", []));
  }, []);

  const post = () => {
    if (!msg.trim()) return;
    const n = {
      id: genId(),
      text: msg.trim(),
      createdAt: new Date().toISOString(),
      createdBy: "Teacher",
    };
    const updated = [n, ...load("td_hod_feed", [])];
    save("td_hod_feed", updated);
    setItems(updated);
    setMsg("");
  };

  const remove = (id) => {
    if (!window.confirm("Delete announcement?")) return;
    const updated = load("td_hod_feed", []).filter((i) => i.id !== id);
    save("td_hod_feed", updated);
    setItems(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        📢 HOD Feed
      </h2>

      {/* Input */}
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Write announcement..."
        className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      />
      <div className="flex justify-end mt-2">
        <button
          onClick={post}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Post
        </button>
      </div>

      {/* Feed List */}
      <div className="mt-4 space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No announcements yet.
          </p>
        )}

        <AnimatePresence>
          {items.map((i) => (
            <motion.div
              key={i.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-3 border rounded dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {i.createdBy} •{" "}
                    {new Date(i.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-gray-800 dark:text-gray-100">
                    {i.text}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => remove(i.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}