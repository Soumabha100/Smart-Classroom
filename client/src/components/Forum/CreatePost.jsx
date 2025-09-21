import React, { useState } from "react";
import { PenSquare } from "lucide-react";
import { createPost } from "../../api/apiService"; // Make sure this path is correct

const CreatePost = ({ activeSection, setActiveSection }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isActive = activeSection === "create";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in both title and content.");
      return;
    }
    try {
      await createPost({ title, content });
      setTitle("");
      setContent("");
      // Optionally, switch focus back to discussions after posting
      setActiveSection("discussions");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div
      onClick={() => setActiveSection("create")}
      className={`p-6 bg-white border rounded-lg shadow-sm cursor-pointer transition-all duration-300 dark:bg-slate-800 dark:border-slate-700 ${
        !isActive ? "opacity-60 hover:opacity-100" : "opacity-100"
      }`}
    >
      <h2 className="flex items-center gap-3 pb-4 mb-4 text-xl font-semibold border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">
        <PenSquare className="w-6 h-6 text-indigo-500" />
        Create a New Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="sr-only">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear and concise title..."
            className="w-full px-4 py-2 text-base transition-colors bg-slate-100 border-2 border-transparent rounded-md dark:bg-slate-700/50 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="content" className="sr-only">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={isActive ? "6" : "2"} // Text area expands when active
            placeholder="Describe your question or idea in detail..."
            className="w-full px-4 py-2 text-base transition-all duration-300 bg-slate-100 border-2 border-transparent rounded-md dark:bg-slate-700/50 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 font-bold text-white transition-transform transform bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
