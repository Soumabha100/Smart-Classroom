// src/components/AnnouncementsList.jsx
import React, { useEffect, useState } from "react";
import { load } from "../utils/storage";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable announcements viewer.
 * Props:
 *  - audience: "all" | "admin" | "parents"  (default "all")
 *  - limit: number | undefined
 *
 * Matches posts where:
 *   post.audience === "all" OR post.audience === audience OR audience === "all"
 */
export default function AnnouncementsList({ audience = "all", limit }) {
  const [posts, setPosts] = useState([]);

  const loadAndFilter = () => {
    const all = load("td_hod_posts", []);
    const filtered = all.filter(
      (p) =>
        audience === "all" ||
        p.audience === "all" ||
        p.audience === audience
    );
    setPosts(limit ? filtered.slice(0, limit) : filtered);
  };

  useEffect(() => {
    loadAndFilter();

    const handler = (e) => {
      const updated = e?.detail || load("td_hod_posts", []);
      const filtered = updated.filter(
        (p) =>
          audience === "all" ||
          p.audience === "all" ||
          p.audience === audience
      );
      setPosts(limit ? filtered.slice(0, limit) : filtered);
    };

    window.addEventListener("td_hod_posts_updated", handler);

    const storageHandler = (ev) => {
      if (ev.key === "td_hod_posts") loadAndFilter();
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      window.removeEventListener("td_hod_posts_updated", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [audience, limit]);

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
        Announcements
      </h3>

      {posts.length === 0 ? (
        <p className="text-sm text-slate-500 italic">
          No announcements to show.
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {posts.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-xl bg-white/80 dark:bg-slate-900 border dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {p.title}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {p.body}
                    </p>
                    <div className="text-xs text-slate-400 mt-2">
                      {p.author} •{" "}
                      {new Date(p.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-medium">
                    {p.audience}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
