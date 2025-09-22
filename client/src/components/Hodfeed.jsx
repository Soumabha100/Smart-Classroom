// src/components/Hodfeed.jsx
import React, { useEffect, useState } from "react";
import { load, save } from "../utils/storage";

/**
 * HOD feed (frontend-only)
 * - saves posts to localStorage key "td_hod_posts"
 * - dispatches window CustomEvent 'td_hod_posts_updated' with updated posts
 */
export default function Hodfeed() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all"); // "all" | "admin" | "parents"

  useEffect(() => {
    const existing = load("td_hod_posts", []);
    setPosts(existing);
  }, []);

  const publish = () => {
    if (!title.trim() && !body.trim()) return;

    const newPost = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: title.trim() || "Untitled announcement",
      body: body.trim(),
      audience,
      author: "HOD",
      createdAt: new Date().toISOString(),
    };

    const updated = [newPost, ...posts];
    save("td_hod_posts", updated);
    setPosts(updated);
    setTitle("");
    setBody("");

    // notify same-tab listeners
    window.dispatchEvent(
      new CustomEvent("td_hod_posts_updated", { detail: updated })
    );
  };

  const removePost = (id) => {
    if (!window.confirm("Delete announcement?")) return;
    const updated = posts.filter((p) => p.id !== id);
    save("td_hod_posts", updated);
    setPosts(updated);
    window.dispatchEvent(
      new CustomEvent("td_hod_posts_updated", { detail: updated })
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
        HOD Announcements
      </h2>

      <div className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-3 py-2 border rounded dark:bg-slate-900 dark:border-slate-700"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write announcement..."
          className="w-full px-3 py-2 border rounded h-24 resize-none dark:bg-slate-900 dark:border-slate-700"
        />

        <div className="flex items-center gap-2">
          <label className="text-sm">Audience:</label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="px-2 py-1 border rounded dark:bg-slate-900 dark:border-slate-700"
          >
            <option value="all">All (students / parents / admin)</option>
            <option value="admin">Admin</option>
            <option value="parents">Parents</option>
          </select>

          <button
            onClick={publish}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            disabled={!title.trim() && !body.trim()}
          >
            Publish
          </button>
        </div>
      </div>

      <hr className="my-4" />

      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-slate-500">No announcements yet.</p>
        ) : (
          posts.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border dark:border-slate-700"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {p.title}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                      {p.audience}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {p.body}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {p.author} • {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removePost(p.id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
