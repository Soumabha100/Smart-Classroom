import React, { useState } from "react";
import { createComment } from "../../api/apiService";

const CreateComment = ({ postId, onCommentPosted }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await createComment(postId, { text });
      setText("");
      onCommentPosted(); // Callback to refresh the comment list
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <h3 className="pb-4 mb-4 text-xl font-semibold border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white">
        Add Your Comment
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
          placeholder="Join the discussion..."
          className="w-full px-4 py-2 mb-4 text-base transition-colors bg-slate-100 border-2 border-transparent rounded-md dark:bg-slate-700/50 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
        <button
          type="submit"
          className="w-full px-4 py-3 font-bold text-white transition-transform transform bg-indigo-600 rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
